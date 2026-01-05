import Header from '@/components/layout/Header';
import MarqueeTicker from '@/components/layout/MarqueeTicker';
import CurrencyConverter from '@/components/converter/CurrencyConverter';

const Converter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MarqueeTicker />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <CurrencyConverter />
      </main>
    </div>
  );
};

export default Converter;
