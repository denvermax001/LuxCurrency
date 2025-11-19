import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Info } from 'lucide-react';
import { Currency } from '../types';
import { parseHybridNumber } from '../utils/parser';
import { formatAmerican, formatAmericanAbbr, formatIndian, formatIndianAbbr, formatCurrency } from '../utils/formatter';
import { getExchangeRates } from '../services/currencyService';

export const ConverterCard: React.FC = () => {
  const [inputStr, setInputStr] = useState<string>('');
  const [sourceCurrency, setSourceCurrency] = useState<Currency>(Currency.INR);
  const [targetCurrency, setTargetCurrency] = useState<Currency>(Currency.USD);
  const [conversionRate, setConversionRate] = useState<number>(0); // 1 USD = ? INR
  const [parsedValue, setParsedValue] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  // Initial Rate Fetch
  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getExchangeRates();
      setConversionRate(rate);
    };
    fetchRate();
  }, []);

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    setInputStr('');
    setParsedValue(null);
    setResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputStr(val);

    if (!val.trim()) {
      setParsedValue(null);
      setResult(null);
      return;
    }

    const numericValue = parseHybridNumber(val);
    setParsedValue(numericValue);

    // Calculate Conversion
    if (conversionRate > 0) {
      let converted = 0;
      if (sourceCurrency === Currency.INR && targetCurrency === Currency.USD) {
        converted = numericValue / conversionRate;
      } else {
        converted = numericValue * conversionRate;
      }
      setResult(converted);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-[1px] rounded-2xl bg-gradient-to-b from-lux-gold/40 to-transparent shadow-2xl">
      <div className="bg-lux-darkGreen/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-lux-silver via-white to-lux-silver tracking-tight mb-2">
            LuxCurrency
          </h1>
          <p className="text-lux-gold/80 text-sm uppercase tracking-widest font-semibold">Hybrid Converter</p>
        </div>

        {/* Exchange Rate Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lux-black/50 border border-lux-gold/20 text-xs text-lux-grey">
            <Info size={14} className="text-lux-gold" />
            <span>Live Rate: 1 USD ≈ {conversionRate.toFixed(2)} INR</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div className="relative group">
            <label className="block text-xs font-semibold text-lux-gold uppercase tracking-wider mb-2 ml-1">
              {sourceCurrency === Currency.INR ? 'Indian Hybrid Input' : 'US Format Input'}
            </label>
            <input
              type="text"
              value={inputStr}
              onChange={handleInputChange}
              placeholder={sourceCurrency === Currency.INR ? "e.g., 4 Lakh, 2.5 Crore, 1Cr 20L" : "e.g., 4.5k, 2 Million, 1B"}
              className="w-full bg-lux-black/60 border border-lux-gold/20 rounded-lg px-5 py-4 text-xl md:text-2xl text-lux-silver placeholder-lux-grey/30 focus:outline-none focus:border-lux-gold/60 focus:shadow-gold-glow transition-all duration-300 font-serif"
            />
            <div className="absolute right-4 top-10 text-lux-grey/50 text-sm font-mono">
              {sourceCurrency}
            </div>
          </div>

          {/* Swap Control */}
          <div className="flex justify-center -my-3 relative z-10">
            <button 
              onClick={handleSwap}
              className="p-3 rounded-full bg-lux-green border border-lux-gold/40 hover:bg-lux-gold hover:text-lux-black hover:border-lux-gold text-lux-gold transition-all duration-300 shadow-lg group"
            >
              <ArrowRightLeft size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Output Section */}
          <div className={`relative overflow-hidden rounded-xl border border-lux-gold/10 bg-lux-black/40 p-6 transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'}`}>
             {/* Background shine effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-lux-gold/5 to-transparent opacity-50"></div>

             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xs text-lux-grey uppercase tracking-wider mb-1">Converted Amount</h3>
                  <div className="text-3xl md:text-4xl font-serif text-lux-gold">
                    {result ? formatCurrency(result, targetCurrency) : '---'}
                  </div>
                </div>
                
                {/* Formatted Equivalents */}
                {result && (
                  <div className="text-right">
                    <div className="text-sm text-lux-silver font-medium">
                      {targetCurrency === Currency.USD 
                        ? formatAmerican(result) 
                        : formatIndian(result)}
                    </div>
                    <div className="text-xs text-lux-grey font-mono mt-1">
                       Compact: {targetCurrency === Currency.USD 
                        ? formatAmericanAbbr(result) 
                        : formatIndianAbbr(result)}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Footer/Decor */}
        <div className="mt-8 text-center">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-lux-gold/30 to-transparent mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
};