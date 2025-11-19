import { DEFAULT_RATES } from '../constants';
import { RateData } from '../types';

let rateCache: RateData | null = null;

export const getExchangeRates = async (): Promise<number> => {
  // Check local memory cache first
  if (rateCache && (Date.now() - rateCache.lastUpdated < 5 * 60 * 1000)) {
    return rateCache.rates.INR;
  }

  try {
    // Fetch from OUR backend, not external API directly
    const response = await fetch('/api/rates');
    
    if (!response.ok) {
        throw new Error("Backend API failed");
    }
    
    const data = await response.json();

    if (data && data.rates && data.rates.INR) {
      rateCache = {
        rates: { USD: 1, INR: data.rates.INR },
        lastUpdated: Date.now()
      };
      return data.rates.INR;
    }
    throw new Error("Invalid API response structure");
  } catch (error) {
    console.warn("Currency service failed, using fallback rates.", error);
    return DEFAULT_RATES.USD_TO_INR;
  }
};