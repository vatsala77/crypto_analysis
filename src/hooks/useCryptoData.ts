import { useQuery } from '@tanstack/react-query';
import { fetchTopCoins, fetchGlobalData, fetchCoinMarketChart, fetchExchangeRates, CoinData, GlobalData } from '@/services/api';

export const useTopCoins = (page: number = 1, perPage: number = 50) => {
  return useQuery<CoinData[]>({
    queryKey: ['topCoins', page, perPage],
    queryFn: () => fetchTopCoins(page, perPage),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  });
};

export const useGlobalData = () => {
  return useQuery<GlobalData>({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useCoinChart = (coinId: string | null, days: number = 30) => {
  return useQuery({
    queryKey: ['coinChart', coinId, days],
    queryFn: () => fetchCoinMarketChart(coinId!, days),
    enabled: !!coinId,
    staleTime: 300000, // 5 minutes
  });
};

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
    staleTime: 300000,
  });
};
