import { motion } from 'framer-motion';

const CoinTableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-xl p-4 shimmer"
        >
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-8 h-6 bg-muted rounded animate-pulse" />
            
            {/* Coin Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Price */}
            <div className="hidden sm:block w-24">
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>

            {/* 24h Change */}
            <div className="hidden md:block w-20">
              <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            </div>

            {/* 7d Change */}
            <div className="hidden lg:block w-20">
              <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            </div>

            {/* Market Cap */}
            <div className="hidden xl:block w-28">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            </div>

            {/* Sparkline */}
            <div className="hidden xl:block w-32">
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CoinTableSkeleton;
