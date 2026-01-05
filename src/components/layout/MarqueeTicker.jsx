import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Globe, Bitcoin } from 'lucide-react';
import { useGlobalData } from '@/hooks/useCryptoData';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

const MarqueeTicker = () => {
  const { t } = useTranslation();
  const { data: globalData, isLoading } = useGlobalData();

  if (isLoading || !globalData) {
    return (
      <div className="bg-secondary/50 border-b border-border/50 py-2">
        <div className="flex items-center justify-center gap-4">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const { total_market_cap, market_cap_percentage, market_cap_change_percentage_24h_usd } = globalData.data;
  const isPositive = market_cap_change_percentage_24h_usd >= 0;

  const tickerContent = (
    <div className="flex items-center gap-8 px-4">
      {/* Global Market Cap */}
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">{t('dashboard.marketCap')}:</span>
        <span className="text-sm font-bold">{formatCurrency(total_market_cap.usd)}</span>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {formatPercentage(market_cap_change_percentage_24h_usd)}
        </span>
      </div>

      <div className="w-px h-4 bg-border" />

      {/* BTC Dominance */}
      <div className="flex items-center gap-2">
        <Bitcoin className="w-4 h-4 text-[#f7931a]" />
        <span className="text-sm font-medium text-muted-foreground">{t('dashboard.btcDominance')}:</span>
        <span className="text-sm font-bold">{market_cap_percentage.btc.toFixed(1)}%</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-secondary/30 backdrop-blur-sm border-b border-border/30 py-2 overflow-hidden"
    >
      <div className="marquee-container">
        <div className="marquee-content">
          {tickerContent}
          {tickerContent}
        </div>
      </div>
    </motion.div>
  );
};

export default MarqueeTicker;
