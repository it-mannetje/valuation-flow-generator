import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CompanyData, SECTORS } from '@/types/calculator';
import { Building2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const companyDataSchema = z.object({
  companyName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters bevatten'),
  sector: z.string().min(1, 'Selecteer een sector'),
  ebitda: z.number().min(1000, 'EBITDA moet minimaal €1.000 zijn').max(1000000000, 'EBITDA mag niet hoger zijn dan €1 miljard'),
  revenue: z.number().min(1000, 'Omzet moet minimaal €1.000 zijn').max(10000000000, 'Omzet mag niet hoger zijn dan €10 miljard'),
  employees: z.number().min(1, 'Aantal werknemers moet minimaal 1 zijn').max(1000000, 'Aantal werknemers mag niet hoger zijn dan 1 miljoen'),
  foundedYear: z.number().min(1800, 'Oprichtingsjaar moet na 1800 zijn').max(new Date().getFullYear(), 'Oprichtingsjaar kan niet in de toekomst liggen'),
  location: z.string().min(2, 'Locatie moet minimaal 2 karakters bevatten')
});

interface CompanyDataStepProps {
  data: Partial<CompanyData>;
  onSubmit: (data: CompanyData) => void;
  isLoading?: boolean;
}

export default function CompanyDataStep({ data, onSubmit, isLoading = false }: CompanyDataStepProps) {
  const form = useForm<CompanyData>({
    resolver: zodResolver(companyDataSchema),
    defaultValues: {
      companyName: data.companyName || '',
      sector: data.sector || '',
      ebitda: data.ebitda || 0,
      revenue: data.revenue || 0,
      employees: data.employees || 0,
      foundedYear: data.foundedYear || new Date().getFullYear(),
      location: data.location || ''
    }
  });

  const handleSubmit = (formData: CompanyData) => {
    onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-card border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl text-foreground">Bedrijfsgegevens</CardTitle>
            <p className="text-muted-foreground">Voer de basisgegevens van uw bedrijf in voor een accurate waardering</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Company Name & Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Bedrijfsnaam *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bijv. Mijn Bedrijf B.V."
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Sector *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecteer uw sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{sector.name}</span>
                              <span className="text-sm text-muted-foreground">{sector.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financial Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ebitda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">EBITDA (€) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        className="h-12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Earnings Before Interest, Taxes, Depreciation & Amortization
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Jaaromzet (€) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000000"
                        className="h-12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Totale omzet van het afgelopen boekjaar
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Aantal werknemers *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        className="h-12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Oprichtingsjaar *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2015"
                        className="h-12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Locatie *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Amsterdam"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                size="lg"
                className={cn(
                  "px-8 py-3 bg-gradient-primary hover:shadow-primary",
                  "transition-all duration-300 transform hover:scale-105"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Berekenen...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Bereken Waardering
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}