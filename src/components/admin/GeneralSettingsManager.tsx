import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Settings } from 'lucide-react';

interface GeneralSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
}

export default function GeneralSettingsManager() {
  const [settings, setSettings] = useState<GeneralSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    default_multiple_range_min: 0.3,
    default_multiple_range_max: 0.3,
    currency: 'EUR',
    disclaimer_text: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('general_settings')
        .select('*');

      if (error) throw error;

      setSettings(data || []);
      
      // Populate form data
      const newFormData = { ...formData };
      data?.forEach(setting => {
        switch (setting.setting_key) {
          case 'default_multiple_range':
            if (setting.setting_value && typeof setting.setting_value === 'object') {
              const rangeValue = setting.setting_value as { min?: number; max?: number };
              newFormData.default_multiple_range_min = rangeValue.min || 0.3;
              newFormData.default_multiple_range_max = rangeValue.max || 0.3;
            }
            break;
          case 'currency':
            newFormData.currency = (setting.setting_value as string) || 'EUR';
            break;
          case 'disclaimer_text':
            newFormData.disclaimer_text = (setting.setting_value as string) || '';
            break;
        }
      });
      setFormData(newFormData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Fout",
        description: "Kon instellingen niet laden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('general_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSetting('default_multiple_range', {
          min: formData.default_multiple_range_min,
          max: formData.default_multiple_range_max
        }),
        updateSetting('currency', formData.currency),
        updateSetting('disclaimer_text', formData.disclaimer_text)
      ]);

      toast({
        title: "Instellingen Opgeslagen",
        description: "Alle algemene instellingen zijn succesvol bijgewerkt.",
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Fout",
        description: "Kon instellingen niet opslaan",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div>Laden van instellingen...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Algemene Instellingen
          </CardTitle>
          <p className="text-muted-foreground">
            Configureer algemene parameters voor de calculator
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multiple Range Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="multiple-range-min">Standaard Multiple Range (Min)</Label>
              <Input
                id="multiple-range-min"
                type="number"
                step="0.1"
                value={formData.default_multiple_range_min}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  default_multiple_range_min: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimale range voor waardering berekening
              </p>
            </div>
            <div>
              <Label htmlFor="multiple-range-max">Standaard Multiple Range (Max)</Label>
              <Input
                id="multiple-range-max"
                type="number"
                step="0.1"
                value={formData.default_multiple_range_max}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  default_multiple_range_max: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximale range voor waardering berekening
              </p>
            </div>
          </div>

          {/* Currency Setting */}
          <div>
            <Label htmlFor="currency">Valuta</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="USD">Dollar ($)</SelectItem>
                <SelectItem value="GBP">Pond (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Disclaimer Text */}
          <div>
            <Label htmlFor="disclaimer-text">Disclaimer Tekst</Label>
            <Textarea
              id="disclaimer-text"
              rows={4}
              value={formData.disclaimer_text}
              onChange={(e) => setFormData(prev => ({ ...prev, disclaimer_text: e.target.value }))}
              placeholder="Voer disclaimer tekst in..."
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Opslaan...' : 'Instellingen Opslaan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}