import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useWatchlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addToWatchlist = useMutation({
    mutationFn: async ({
      coinId,
      coinName,
      coinSymbol,
      coinImage,
    }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase.from('watchlist').insert({
        user_id: user.id,
        coin_id: coinId,
        coin_name: coinName,
        coin_symbol: coinSymbol,
        coin_image: coinImage,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Added to watchlist');
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Already in watchlist');
      } else {
        toast.error('Failed to add to watchlist');
      }
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (coinId) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('coin_id', coinId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
    onError: () => {
      toast.error('Failed to remove from watchlist');
    },
  });

  const isInWatchlist = (coinId) => {
    return watchlist.some((item) => item.coin_id === coinId);
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};
