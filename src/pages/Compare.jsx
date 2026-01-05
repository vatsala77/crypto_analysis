import Header from '@/components/layout/Header';
import MarqueeTicker from '@/components/layout/MarqueeTicker';
import CoinCompare from '@/components/compare/CoinCompare';

const Compare = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarqueeTicker />
      
      <main className="container mx-auto px-4 py-8">
        <CoinCompare />
      </main>
    </div>
  );
};

export default Compare;
