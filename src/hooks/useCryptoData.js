import { useQuery } from '@tanstack/react-query';
import { fetchTopCoins, fetchGlobalData, fetchCoinMarketChart, fetchExchangeRates } from '@/services/api';

export const useTopCoins = (page = 1, perPage = 50) => {
  const queryInfo = useQuery({
    queryKey: ['topCoins', page, perPage],
    queryFn: () => fetchTopCoins(page, perPage),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  });

  return {
    ...queryInfo,
    totalPages: 6, // Hardcoded for now
  };
};

export const useGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: fetchGlobalData,
    staleTime: 60000,
    refetchInterval: 60000,
  });
};

export const useCoinChart = (coinId, days = 30) => {
  return useQuery({
    queryKey: ['coinChart', coinId, days],
    queryFn: () => fetchCoinMarketChart(coinId, days),
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
