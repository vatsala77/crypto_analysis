import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Converter from "./pages/Converter";
import Watchlist from "./pages/Watchlist";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import './i18n';
import { usePageMetadata } from './hooks/usePageMetadata';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60000,
    },
  },
});

const App = () => {
  usePageMetadata();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
