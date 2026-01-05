const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (page = 1, perPage = 50) => {
  const response = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d,30d`
  );
  if (!response.ok) throw new Error('Failed to fetch coins');
  return response.json();
};

export const fetchGlobalData = async () => {
  const response = await fetch(`${COINGECKO_BASE}/global`);
  if (!response.ok) throw new Error('Failed to fetch global data');
  return response.json();
};

export const fetchCoinMarketChart = async (coinId, days = 30) => {
  const response = await fetch(
    `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!response.ok) throw new Error('Failed to fetch market chart');
  return response.json();
};

export const fetchExchangeRates = async () => {
  const response = await fetch(`${COINGECKO_BASE}/exchange_rates`);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  const data = await response.json();
  return data.rates;
};

export const searchCoins = async (query) => {
  const response = await fetch(`${COINGECKO_BASE}/search?query=${query}`);
  if (!response.ok) throw new Error('Failed to search coins');
  return response.json();
};
