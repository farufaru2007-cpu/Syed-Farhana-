/**
 * Formats a number into Indian Rupee currency string
 * e.g. 1500 -> ₹1,500
 * e.g. 150000 -> ₹1,50,000
 */
export function formatRupee(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  // Use Intl with en-IN locale
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Formats date into readable Indian display format
 */
export function formatIndianDate(dateString: string): string {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateString === todayStr) return 'Today';
    if (dateString === yesterdayStr) return 'Yesterday';

    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Get current Indian month name, e.g. "October 2026"
 */
export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}
