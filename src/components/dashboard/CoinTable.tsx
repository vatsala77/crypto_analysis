import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTopCoins } from '@/hooks/useCryptoData';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import CoinTableSkeleton from './CoinTableSkeleton';
import MiniSparkline from './MiniSparkline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';

const CoinTable = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: coins, isLoading, error } = useTopCoins(page, 50);
  const { user } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const handleWatchlistToggle = (coin: any) => {
    if (isInWatchlist(coin.id)) {
      removeFromWatchlist.mutate(coin.id);
    } else {
      addToWatchlist.mutate({
        coinId: coin.id,
        coinName: coin.name,
        coinSymbol: coin.symbol,
        coinImage: coin.image,
      });
    }
  };

  const PriceChange = ({ value }: { value: number | null | undefined }) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">N/A</span>;
    }
    const isPositive = value >= 0;
    return (
      <span className={cn(
        'flex items-center gap-0.5 font-medium',
        isPositive ? 'text-success' : 'text-destructive'
      )}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {formatPercentage(value)}
      </span>
    );
  };

  if (isLoading) return <CoinTableSkeleton />;

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-destructive">{t('common.error')}</p>
      </div>
    );
  }

  // Calculate total pages (150 coins / 50 per page = 3 pages)
  const totalPages = 3;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card rounded-xl p-4 hidden lg:block">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground">
          <div className="col-span-1"></div>
          <div className="col-span-1">{t('dashboard.rank')}</div>
          <div className="col-span-2">{t('dashboard.coin')}</div>
          <div className="col-span-2 text-right">{t('dashboard.price')}</div>
          <div className="col-span-1 text-right">{t('dashboard.change24h')}</div>
          <div className="col-span-1 text-right">{t('dashboard.change7d')}</div>
          <div className="col-span-2 text-right">{t('dashboard.marketCapCol')}</div>
          <div className="col-span-2 text-right">Sparkline</div>
        </div>
      </div>

      {/* Coins List */}
      <AnimatePresence mode="popLayout">
        {coins?.map((coin, index) => (
          <motion.div
            key={coin.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all duration-300"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Watchlist Button */}
              <div className="col-span-1 flex justify-center">
                {user && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchlistToggle(coin);
                    }}
                    className={cn(
                      'p-1.5 rounded-full transition-colors',
                      isInWatchlist(coin.id)
                        ? 'text-yellow-500'
                        : 'text-muted-foreground hover:text-yellow-500'
                    )}
                  >
                    <Star
                      className={cn(
                        'w-4 h-4',
                        isInWatchlist(coin.id) && 'fill-current'
                      )}
                    />
                  </motion.button>
                )}
              </div>

              {/* Rank */}
              <div className="col-span-1 hidden lg:block">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-sm font-bold">
                  {coin.market_cap_rank}
                </span>
              </div>

              {/* Coin Info */}
              <div className="col-span-6 lg:col-span-2 flex items-center gap-3">
                <span className="lg:hidden inline-flex items-center justify-center w-6 h-6 rounded bg-secondary text-xs font-bold">
                  {coin.market_cap_rank}
                </span>
                <motion.img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="min-w-0">
                  <h3 className="font-semibold truncate text-sm lg:text-base">{coin.name}</h3>
                  <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-5 lg:col-span-2 text-right">
                <span className="font-bold">{formatCurrency(coin.current_price)}</span>
              </div>

              {/* 24h Change */}
              <div className="hidden lg:block col-span-1 text-right">
                <PriceChange value={coin.price_change_percentage_24h} />
              </div>

              {/* 7d Change */}
              <div className="hidden lg:block col-span-1 text-right">
                <PriceChange value={coin.price_change_percentage_7d_in_currency} />
              </div>

              {/* Market Cap */}
              <div className="hidden lg:block col-span-2 text-right">
                <span className="font-medium">{formatCurrency(coin.market_cap)}</span>
              </div>

              {/* Sparkline */}
              <div className="hidden lg:flex col-span-2 justify-end">
                {coin.sparkline_in_7d?.price && (
                  <MiniSparkline data={coin.sparkline_in_7d.price} />
                )}
              </div>
            </div>

            {/* Mobile: Additional Info */}
            <div className="lg:hidden mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-muted-foreground text-xs">24h</span>
                  <PriceChange value={coin.price_change_percentage_24h} />
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">7d</span>
                  <PriceChange value={coin.price_change_percentage_7d_in_currency} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs">MCap</span>
                <p className="font-medium">{formatNumber(coin.market_cap)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? 'default' : 'outline'}
              size="sm"
              className="w-10"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Showing {(page - 1) * 50 + 1}-{Math.min(page * 50, 150)} of 150 coins
      </p>
    </div>
  );
};

export default CoinTable;
