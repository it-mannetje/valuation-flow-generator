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
          text: sector.text,
          header_text: sector.headerText
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

  const createSector = async (sectorData: Omit<SectorConfig, 'id'>) => {
    try {
      const id = sectorData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const { error } = await supabase
        .from('sector_configs')
        .insert({
          id,
          name: sectorData.name,
          multiple: sectorData.multiple,
          description: sectorData.description,
          text: sectorData.text,
          header_text: sectorData.headerText
        });

      if (error) throw error;

      // Update local state
      const newSector = { id, ...sectorData };
      setSectors(prev => [...prev, newSector]);
      
      toast({
        title: "Sector Toegevoegd",
        description: "De nieuwe sector is succesvol aangemaakt.",
      });

      return true;
    } catch (err) {
      console.error('Error creating sector:', err);
      toast({
        title: "Fout",
        description: "Kon sector niet aanmaken. Probeer opnieuw.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteSector = async (sectorId: string) => {
    try {
      const { error } = await supabase
        .from('sector_configs')
        .delete()
        .eq('id', sectorId);

      if (error) throw error;

      // Update local state
      setSectors(prev => prev.filter(s => s.id !== sectorId));
      
      toast({
        title: "Sector Verwijderd",
        description: "De sector is succesvol verwijderd.",
      });

      return true;
    } catch (err) {
      console.error('Error deleting sector:', err);
      toast({
        title: "Fout",
        description: "Kon sector niet verwijderen. Probeer opnieuw.",
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
    createSector,
    deleteSector,
    refetch: fetchSectors
  };
}