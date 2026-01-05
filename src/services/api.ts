const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  circulating_supply: number;
  ath: number;
  ath_date: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface GlobalData {
  data: {
    total_market_cap: { usd: number };
    market_cap_percentage: { btc: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface CoinMarketChart {
  prices: [number, number][];
}

export const fetchTopCoins = async (
  page: number = 1,
  perPage: number = 50
): Promise<CoinData[]> => {
  const response = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d,30d`
  );
  if (!response.ok) throw new Error('Failed to fetch coins');
  return response.json();
};

export const fetchGlobalData = async (): Promise<GlobalData> => {
  const response = await fetch(`${COINGECKO_BASE}/global`);
  if (!response.ok) throw new Error('Failed to fetch global data');
  return response.json();
};

export const fetchCoinMarketChart = async (
  coinId: string,
  days: number = 30
): Promise<CoinMarketChart> => {
  const response = await fetch(
    `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!response.ok) throw new Error('Failed to fetch market chart');
  return response.json();
};

export const fetchExchangeRates = async (): Promise<Record<string, { value: number }>> => {
  const response = await fetch(`${COINGECKO_BASE}/exchange_rates`);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  const data = await response.json();
  return data.rates;
};

export const searchCoins = async (query: string): Promise<{ coins: { id: string; name: string; symbol: string; thumb: string }[] }> => {
  const response = await fetch(`${COINGECKO_BASE}/search?query=${query}`);
  if (!response.ok) throw new Error('Failed to search coins');
  return response.json();
};
