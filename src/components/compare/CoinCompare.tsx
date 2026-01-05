import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useTopCoins, useCoinChart } from '@/hooks/useCryptoData';
import { formatCurrency, formatNumber, formatPercentage, formatSupply } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const CoinCompare = () => {
  const { t } = useTranslation();
  const { data: coins, isLoading } = useTopCoins(1, 50);
  const [coin1, setCoin1] = useState<string>('bitcoin');
  const [coin2, setCoin2] = useState<string>('ethereum');
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const { data: chart1 } = useCoinChart(coin1);
  const { data: chart2 } = useCoinChart(coin2);

  const coin1Data = coins?.find((c) => c.id === coin1);
  const coin2Data = coins?.find((c) => c.id === coin2);

  const filteredCoins1 = coins?.filter((c) =>
    c.name.toLowerCase().includes(search1.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search1.toLowerCase())
  );

  const filteredCoins2 = coins?.filter((c) =>
    c.name.toLowerCase().includes(search2.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search2.toLowerCase())
  );

  // Prepare chart data
  const chartData = chart1?.prices && chart2?.prices
    ? chart1.prices.map((price, index) => ({
        date: new Date(price[0]).toLocaleDateString(),
        [coin1]: price[1],
        [coin2]: chart2.prices[index]?.[1] || 0,
      }))
    : [];

  const ComparisonStat = ({
    label,
    value1,
    value2,
    format = 'number',
  }: {
    label: string;
    value1: number | undefined;
    value2: number | undefined;
    format?: 'currency' | 'number' | 'supply';
  }) => {
    const formatValue = (val: number | undefined) => {
      if (val === undefined) return 'N/A';
      switch (format) {
        case 'currency':
          return formatCurrency(val);
        case 'supply':
          return formatSupply(val);
        default:
          return formatNumber(val);
      }
    };

    const winner = value1 && value2 ? (value1 > value2 ? 1 : value1 < value2 ? 2 : 0) : 0;

    return (
      <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-border/30">
        <div className={cn(
          'text-right font-semibold transition-all',
          winner === 1 && 'text-primary scale-105'
        )}>
          {formatValue(value1)}
        </div>
        <div className="text-center text-sm text-muted-foreground font-medium">{label}</div>
        <div className={cn(
          'text-left font-semibold transition-all',
          winner === 2 && 'text-primary scale-105'
        )}>
          {formatValue(value2)}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mb-4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t('compare.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('compare.subtitle')}</p>
          </div>
        </div>

        {/* Coin Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coin 1 */}
          <div className="space-y-3">
            <Select value={coin1} onValueChange={setCoin1}>
              <SelectTrigger className="h-14">
                <SelectValue>
                  {coin1Data && (
                    <div className="flex items-center gap-3">
                      <img
                        src={coin1Data.image}
                        alt={coin1Data.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <p className="font-semibold">{coin1Data.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{coin1Data.symbol}</p>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder={t('compare.search')}
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredCoins1?.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                        <span>{coin.name}</span>
                        <span className="text-muted-foreground text-xs uppercase">{coin.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Coin 2 */}
          <div className="space-y-3">
            <Select value={coin2} onValueChange={setCoin2}>
              <SelectTrigger className="h-14">
                <SelectValue>
                  {coin2Data && (
                    <div className="flex items-center gap-3">
                      <img
                        src={coin2Data.image}
                        alt={coin2Data.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-left">
                        <p className="font-semibold">{coin2Data.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{coin2Data.symbol}</p>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder={t('compare.search')}
                    value={search2}
                    onChange={(e) => setSearch2(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredCoins2?.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                        <span>{coin.name}</span>
                        <span className="text-muted-foreground text-xs uppercase">{coin.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      {coin1Data && coin2Data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="grid grid-cols-3 gap-4 items-center mb-4 pb-4 border-b border-border">
            <div className="flex items-center justify-end gap-2">
              <img src={coin1Data.image} alt={coin1Data.name} className="w-6 h-6 rounded-full" />
              <span className="font-bold">{coin1Data.symbol.toUpperCase()}</span>
            </div>
            <div className="text-center text-sm text-muted-foreground font-medium">VS</div>
            <div className="flex items-center gap-2">
              <img src={coin2Data.image} alt={coin2Data.name} className="w-6 h-6 rounded-full" />
              <span className="font-bold">{coin2Data.symbol.toUpperCase()}</span>
            </div>
          </div>

          <ComparisonStat
            label={t('compare.marketCapRank')}
            value1={coin1Data.market_cap_rank}
            value2={coin2Data.market_cap_rank}
          />
          <ComparisonStat
            label={t('compare.allTimeHigh')}
            value1={coin1Data.ath}
            value2={coin2Data.ath}
            format="currency"
          />
          <ComparisonStat
            label={t('compare.circulatingSupply')}
            value1={coin1Data.circulating_supply}
            value2={coin2Data.circulating_supply}
            format="supply"
          />
          <ComparisonStat
            label={t('dashboard.marketCapCol')}
            value1={coin1Data.market_cap}
            value2={coin2Data.market_cap}
            format="currency"
          />
        </motion.div>
      )}

      {/* Price Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-4">{t('compare.priceHistory')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.slice(-30)}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--primary))"
                  tickFormatter={(val) => `$${formatNumber(val)}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--accent))"
                  tickFormatter={(val) => `$${formatNumber(val)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={coin1}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name={coin1Data?.name}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={coin2}
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  name={coin2Data?.name}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoinCompare;
