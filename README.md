
🚀 Crypto Analytics Dashboard
Crypto Analytics Dashboard is a high-performance, real-time cryptocurrency tracking platform. It provides users with live market data, advanced coin analytics, and personalized tracking tools. With secure Google OAuth integration via Supabase, users can maintain their own asset watchlists across different devices.

🌟 Project Overview
The application leverages the CoinGecko API v3 to fetch and display the latest market movements, including prices, market caps, and percentage changes. Designed with a sleek, responsive dark-themed UI, it focuses on providing clear financial data and trend visualization.

🛠️ Tools & Technologies
⚛️ React.js: Frontend framework for building the user interface.

⚡ Vite: Next-generation frontend tooling for fast development.

🟦 TypeScript: Ensuring type safety and robust code.

🎨 Tailwind CSS: Utility-first CSS framework for modern styling.

🛡️ Supabase: Backend-as-a-Service for database and real-time data persistence.

🔑 Google OAuth 2.0: Secure user authentication via Supabase Auth.

🔄 TanStack Query: Optimized API caching and server-state management.

📊 CoinGecko API: Source for comprehensive cryptocurrency market data.

✨ Framer Motion: Library for creating fluid UI animations and transitions.

🧭 Lucide React: Clean and consistent icon library.

✨ Key Features
📈 Real-time Market Dashboard: Track the top  cryptocurrencies with live price updates and market rank.

🔔 Global Stats Ticker: Stay updated with Global Market Cap and BTC Dominance metrics prominently displayed at the top.

⭐ Personalized Watchlist: Add coins to your favorites using the star icon; data is saved to your secure profile via Supabase.

💱 Crypto Converter: Built-in tool to instantly convert cryptocurrency values into fiat currencies like USD, INR, EUR, and GBP.

📉 Visual Trend Charts: Interactive mini-sparklines depicting the price trend of each coin over the last 7 days.

🚀 Setup & Installation
To run this project locally, follow these steps:

Clone the Repository:

Bash

git clone https://github.com/vatsala77/crypto-analysis.git
cd crypto-analytics
Install Dependencies:

Bash

npm install
Environment Variables: Create a .env file in the root directory and add your Supabase credentials:

Code snippet

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run Development Server:

Bash

npm run dev
Build for Production:

Bash

npm run build