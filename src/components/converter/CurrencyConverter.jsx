import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { useTopCoins, useExchangeRates } from '@/hooks/useCryptoData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const fiatCurrencies = [
  { code: 'usd', symbol: '$', name: 'US Dollar' },
  { code: 'inr', symbol: '₹', name: 'Indian Rupee' },
  { code: 'eur', symbol: '€', name: 'Euro' },
  { code: 'gbp', symbol: '£', name: 'British Pound' },
];

const CurrencyConverter = () => {
  const { t } = useTranslation();
  const { data: coins, isLoading: coinsLoading } = useTopCoins(1, 50);
  const { data: rates, isLoading: ratesLoading } = useExchangeRates();
  
  const [amount, setAmount] = useState('1');
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  const isLoading = coinsLoading || ratesLoading;

  const conversions = useMemo(() => {
    if (!coins || !rates) return [];

    const coin = coins.find((c) => c.id === selectedCoin);
    if (!coin) return [];

    const usdValue = parseFloat(amount) * coin.current_price;

    return fiatCurrencies.map((fiat) => {
      const rate = rates[fiat.code];
      const converted = rate ? usdValue * rate.value : 0;
      return {
        ...fiat,
        value: converted,
      };
    });
  }, [coins, rates, amount, selectedCoin]);

  const selectedCoinData = coins?.find((c) => c.id === selectedCoin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <ArrowDownUp className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t('converter.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('converter.subtitle')}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t('converter.amount')}
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-lg font-semibold h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {t('converter.from')}
              </label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select coin">
                    {selectedCoinData && (
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedCoinData.image}
                          alt={selectedCoinData.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{selectedCoinData.name}</span>
                        <span className="text-muted-foreground uppercase">
                          ({selectedCoinData.symbol})
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {coins?.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{coin.name}</span>
                        <span className="text-muted-foreground uppercase text-xs">
                          {coin.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <label className="text-sm font-medium text-muted-foreground block">
              {t('converter.result')}
            </label>
            {conversions.map((conv, index) => (
              <motion.div
                key={conv.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                    {conv.symbol}
                  </span>
                  <div>
                    <p className="font-medium">{conv.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{conv.code}</p>
                  </div>
                </div>
                <p className="text-xl font-bold">
                  {conv.symbol}
                  {conv.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CurrencyConverter;
