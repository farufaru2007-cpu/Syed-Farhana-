import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Smart Parser: Extracts transaction details from Indian SMS, UPI notes, or plain text
app.post('/api/ai/parse-transaction', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Please provide text to parse.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an Indian financial assistant analyzing SMS alerts, UPI payment receipts, or quick transaction notes.
Analyze this message and extract the transaction details accurately.

Text to analyze:
"""${text}"""

Context:
- Today's date is: ${todayStr}
- Expense categories allowed:
  "🍛 Food", "🛒 Groceries", "🛍️ Shopping", "🚌 Travel & Transport", "📱 Mobile Recharge", "💡 Electricity & Bills", "🎓 Education", "🏥 Health", "🎬 Entertainment", "🏠 Rent", "💳 EMI", "☕ Snacks & Tea", "✈️ Travel", "🧴 Personal Care", "📦 Other"
- Income categories allowed:
  "Salary", "Pocket Money", "Freelance", "Business", "Scholarship", "Allowance", "Other"
- Payment methods allowed:
  "UPI", "Cash", "Debit Card", "Credit Card", "Bank Transfer", "Net Banking", "Other"

Guidance for Indian context:
- "debited", "paid", "sent", "transferred to", "spent", "purchase of" -> type = "expense"
- "credited", "received", "salary", "cashback", "deposited" -> type = "income"
- Swiggy, Zomato, Canteen, Dhaba, Restaurant -> "🍛 Food"
- Chai, Tea, Samosa, Tapri, Cafe Coffee Day, Starbucks -> "☕ Snacks & Tea"
- Zepto, Blinkit, Instamart, BigBasket, DMart, Ration -> "🛒 Groceries"
- Ola, Uber, Rapido, Metro, Auto, Bus, Fuel, Petrol -> "🚌 Travel & Transport"
- Jio, Airtel, Vi, BSNL -> "📱 Mobile Recharge"
- If no payment method is stated but mentions UPI/PhonePe/GPay/Paytm -> "UPI". If physical cash mentioned -> "Cash". Default to "UPI" or "Other" if uncertain.
- Default to today's date (${todayStr}) if no date in the text.
`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: '"expense" or "income"',
            },
            amount: {
              type: Type.NUMBER,
              description: 'Transaction amount in Indian Rupees (positive number)',
            },
            title: {
              type: Type.STRING,
              description: 'Short clean merchant or purpose name (e.g. Swiggy Order, Chai & Samosa, Auto Fare)',
            },
            category: {
              type: Type.STRING,
              description: 'Exact matching category name from allowed list',
            },
            paymentMethod: {
              type: Type.STRING,
              description: 'Exact matching payment method from allowed list',
            },
            date: {
              type: Type.STRING,
              description: 'YYYY-MM-DD format',
            },
            note: {
              type: Type.STRING,
              description: 'Optional reference number, bank name, or extra detail',
            },
            confidenceReason: {
              type: Type.STRING,
              description: 'A brief friendly sentence explaining how details were detected',
            },
          },
          required: ['type', 'amount', 'title', 'category', 'paymentMethod', 'date'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error('Error parsing transaction:', error);
    return res.status(500).json({
      error: 'Failed to parse transaction with AI',
      details: error?.message || 'Unknown error',
    });
  }
});

// AI Financial Dost: Personalized budget advice & savings coach in simple friendly English
app.post('/api/ai/financial-advice', async (req: Request, res: Response) => {
  try {
    const {
      totalIncome,
      totalSpent,
      moneyAvailable,
      savingsRate,
      categoryBreakdown,
      paymentMethodBreakdown,
      monthlyBudget,
      recentTransactions,
      userPersona,
    } = req.body;

    const prompt = `You are "AI Financial Dost" (financial friend & advisor) for an Indian user (persona: ${userPersona || 'student/young professional'}).
Analyze their finances and give warm, practical, relatable Indian financial advice.
Do NOT use heavy Wall Street/banking jargon. Use warm, simple English that an Indian student or fresh graduate understands.

Current Financial Summary (in ₹ Indian Rupees):
- 💰 Money Available (Current Balance): ₹${moneyAvailable}
- 💵 Total Income: ₹${totalIncome}
- 💸 Total Spent: ₹${totalSpent}
- 🏦 Money Saved Rate: ${savingsRate}%
- Monthly Target Budget: ${monthlyBudget ? `₹${monthlyBudget}` : 'Not set yet'}
- Spending By Category: ${JSON.stringify(categoryBreakdown || [])}
- Payment Modes Used: ${JSON.stringify(paymentMethodBreakdown || [])}
- Recent 8 Transactions: ${JSON.stringify(recentTransactions || [])}

Provide your response in JSON matching the schema.
Keep tone: encouraging, practical, insightful, slightly funny and relatable to Indian daily life (Chai breaks, UPI impulse spending, Swiggy/Zomato cravings, metro pass, etc.).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: '"great" (if savings > 30%), "caution" (if savings 10-30% or near budget), or "critical" (if overspent or savings < 10%)',
            },
            headline: {
              type: Type.STRING,
              description: 'Catchy 1-sentence verdict with emoji (e.g. "Shabash! Great savings this month! 🚀" or "Arre dost! Food & chai took 42% of your money ☕")',
            },
            dailySafeSpend: {
              type: Type.STRING,
              description: 'Recommended daily spending allowance for remainder of the month (e.g. "₹250 - ₹350 per day")',
            },
            topInsight: {
              type: Type.STRING,
              description: 'A 2-3 sentence analysis of their biggest spending area and where money is leaking',
            },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 practical, high-impact Indian tips (e.g. UPI limits, meal planning, subscriptions)',
            },
            motivationalQuote: {
              type: Type.STRING,
              description: 'Short inspirational line about financial freedom for Indian youth',
            },
          },
          required: ['status', 'headline', 'dailySafeSpend', 'topInsight', 'actionableTips', 'motivationalQuote'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error('Error generating advice:', error);
    return res.status(500).json({
      error: 'Failed to generate financial advice',
      details: error?.message || 'Unknown error',
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (!isDev && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
