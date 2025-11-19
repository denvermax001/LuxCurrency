export enum Currency {
  INR = 'INR',
  USD = 'USD',
}

export interface ParseResult {
  value: number;
  formattedIndian: string;
  formattedAmerican: string;
  originalInput: string;
  isValid: boolean;
}

export interface ConversionResult {
  sourceAmount: number;
  targetAmount: number;
  rate: number;
  timestamp: number;
  sourceCurrency: Currency;
  targetCurrency: Currency;
}

export interface RateData {
  rates: { [key: string]: number };
  lastUpdated: number;
}