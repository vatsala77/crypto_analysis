import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, Lock, TrendingUp, TrendingDown, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import MarqueeTicker from '@/components/layout/MarqueeTicker';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useTopCoins } from '@/hooks/useCryptoData';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const Watchlist = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { watchlist, isLoading: watchlistLoading, removeFromWatchlist } = useWatchlist();
  const { data: allCoins } = useTopCoins(1, 100);

  // Get full coin data for watchlist items
  const watchlistWithData = watchlist.map((item) => {
    const coinData = allCoins?.find((c) => c.id === item.coin_id);
    return { ...item, coinData };
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <MarqueeTicker />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6"
            >
              <Star className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-bold mb-4">{t('nav.watchlist')}</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Sign in to save your favorite cryptocurrencies and track them in your personal watchlist.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => navigate('/auth')}>
                <Lock className="w-4 h-4" />
                Sign In to Continue
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarqueeTicker />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {t('nav.watchlist')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your saved cryptocurrencies ({watchlist.length} coins)
          </p>
        </motion.div>

        {watchlistLoading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Go to the dashboard and click the star icon on any coin to add it here.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Coins
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {watchlistWithData.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      {item.coinData && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-sm font-bold">
                          {item.coinData.market_cap_rank}
                        </span>
                      )}
                      
                      {/* Coin Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={item.coin_image || '/placeholder.svg'}
                          alt={item.coin_name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{item.coin_name}</h3>
                          <span className="text-xs text-muted-foreground uppercase">
                            {item.coin_symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Price & Change */}
                      {item.coinData && (
                        <div className="hidden sm:flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(item.coinData.current_price)}</p>
                            <p className="text-xs text-muted-foreground">Price</p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              'flex items-center gap-0.5 font-medium',
                              item.coinData.price_change_percentage_24h >= 0
                                ? 'text-success'
                                : 'text-destructive'
                            )}>
                              {item.coinData.price_change_percentage_24h >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {formatPercentage(item.coinData.price_change_percentage_24h)}
                            </p>
                            <p className="text-xs text-muted-foreground">24h</p>
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWatchlist.mutate(item.coin_id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile: Additional Info */}
                  {item.coinData && (
                    <div className="sm:hidden mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Price</span>
                        <p className="font-bold">{formatCurrency(item.coinData.current_price)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs">24h</span>
                        <p className={cn(
                          'flex items-center gap-0.5 font-medium',
                          item.coinData.price_change_percentage_24h >= 0
                            ? 'text-success'
                            : 'text-destructive'
                        )}>
                          {item.coinData.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {formatPercentage(item.coinData.price_change_percentage_24h)}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
