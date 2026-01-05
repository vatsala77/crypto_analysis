import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from '@/components/layout/Header';
import MarqueeTicker from '@/components/layout/MarqueeTicker';
import CoinTable from '@/components/dashboard/CoinTable';

const Index = () => {
  const { t } = useTranslation();

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
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            {t('dashboard.top50')}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        <CoinTable />
      </main>
    </div>
  );
};

export default Index;
