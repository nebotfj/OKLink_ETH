export const formatBalance = (value: string, decimals: number = 18, maxDecimals: number = 9): string => {
  try {
    if (!value) return '0';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0';
    
    const formatted = numValue / Math.pow(10, decimals);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: maxDecimals
    }).format(formatted);
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};