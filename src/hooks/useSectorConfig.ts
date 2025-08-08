import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SectorConfig } from '@/types/calculator';
import { useToast } from '@/hooks/use-toast';

export function useSectorConfig() {
  const [sectors, setSectors] = useState<SectorConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSectors = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sector_configs')
        .select('*')
        .order('name');

      if (error) throw error;

      setSectors(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError('Fout bij laden van sector configuraties');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSector = async (sector: SectorConfig) => {
    try {
      const { error } = await supabase
        .from('sector_configs')
        .update({
          name: sector.name,
          multiple: sector.multiple,
          description: sector.description,
          text: sector.text
        })
        .eq('id', sector.id);

      if (error) throw error;

      // Update local state
      setSectors(prev => prev.map(s => s.id === sector.id ? sector : s));
      
      toast({
        title: "Sector Bijgewerkt",
        description: "De sector instellingen zijn succesvol opgeslagen.",
      });

      return true;
    } catch (err) {
      console.error('Error updating sector:', err);
      toast({
        title: "Fout",
        description: "Kon sector niet bijwerken. Probeer opnieuw.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return {
    sectors,
    isLoading,
    error,
    updateSector,
    refetch: fetchSectors
  };
}