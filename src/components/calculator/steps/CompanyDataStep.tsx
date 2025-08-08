import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CompanyData, SECTORS } from '@/types/calculator';
import { Building2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const companyDataSchema = z.object({
  // Omzet
  lastYearRevenue: z.number().min(1000, 'Omzet moet minimaal €1.000 zijn'),
  recurringRevenuePercentage: z.number().min(0, 'Percentage moet minimaal 0% zijn').max(100, 'Percentage mag niet meer dan 100% zijn'),
  
  // Bedrijfsresultaat
  result2024: z.number(),
  expectedResult2025: z.number(),
  wasLossmaking: z.boolean(),
  prospects: z.string().min(1, 'Selecteer vooruitzichten'),
  
  // Investeringen
  averageYearlyInvestment: z.number().min(0, 'Investeringen kunnen niet negatief zijn'),
  
  // Overig
  sector: z.string().min(1, 'Selecteer een sector'),
  employees: z.number().min(1, 'Aantal werknemers moet minimaal 1 zijn'),
  largestClientDependency: z.number().min(0, 'Percentage moet minimaal 0% zijn').max(100, 'Percentage mag niet meer dan 100% zijn'),
  largestSupplierRisk: z.string().min(1, 'Selecteer een optie'),
  
  // Display values (optional)
  employeesDisplay: z.string().optional(),
  largestClientDependencyDisplay: z.string().optional(),
  recurringRevenuePercentageDisplay: z.string().optional()
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
      lastYearRevenue: data.lastYearRevenue || 0,
      recurringRevenuePercentage: data.recurringRevenuePercentage || 0,
      result2024: data.result2024 || 0,
      expectedResult2025: data.expectedResult2025 || 0,
      wasLossmaking: data.wasLossmaking || false,
      prospects: data.prospects || '',
      averageYearlyInvestment: data.averageYearlyInvestment || 0,
      sector: data.sector || '',
      employees: data.employees || 0,
      largestClientDependency: data.largestClientDependency || 0,
      largestSupplierRisk: data.largestSupplierRisk || '',
      employeesDisplay: data.employeesDisplay || '',
      largestClientDependencyDisplay: data.largestClientDependencyDisplay || '',
      recurringRevenuePercentageDisplay: data.recurringRevenuePercentageDisplay || ''
    }
  });

  const handleSubmit = (formData: CompanyData) => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-background rounded-lg p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white font-heading mb-2">Bedrijfswaardering Calculator</h1>
        <p className="text-lg text-white font-sans">Ontdek de waarde van uw bedrijf met onze professionele waarderingstool</p>
      </div>

      <div className="bg-card rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Invoer Financieel Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4 font-heading">Invoer Financieel</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="lastYearRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Wat was uw omzet het afgelopen jaar? (€) *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                           <SelectTrigger className="h-12 bg-input text-black">
                             <SelectValue placeholder="Selecteer omzetklasse" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="500000">0-1 miljoen</SelectItem>
                          <SelectItem value="2000000">1-3 miljoen</SelectItem>
                          <SelectItem value="7000000">4-10 miljoen</SelectItem>
                          <SelectItem value="18000000">11-25 miljoen</SelectItem>
                          <SelectItem value="35000000">&gt; 25 miljoen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurringRevenuePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Welk deel is hiervan jaarlijks terugkerende omzet? (%) *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        // Store display value based on selection
                        const displayValue = value === "12" ? "0-25%" : 
                                           value === "38" ? "26-50%" :
                                           value === "63" ? "51-75%" : "76-100%";
                        form.setValue("recurringRevenuePercentageDisplay", displayValue);
                      }} value={field.value?.toString()}>
                        <FormControl>
                           <SelectTrigger className="h-12 bg-input text-black">
                             <SelectValue placeholder="Selecteer percentage" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12">0-25%</SelectItem>
                          <SelectItem value="38">26-50%</SelectItem>
                          <SelectItem value="63">51-75%</SelectItem>
                          <SelectItem value="88">76-100%</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bedrijfsresultaat Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 font-heading">Bedrijfsresultaat</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="result2024"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Wat was het resultaat in 2024? (€) *</FormLabel>
                      <FormControl>
                         <Input
                           type="number"
                           placeholder="75000"
                           className="h-12 bg-input text-black"
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
                  name="expectedResult2025"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Welk resultaat verwacht u voor 2025? (€) *</FormLabel>
                      <FormControl>
                         <Input
                           type="number"
                           placeholder="85000"
                           className="h-12 bg-input text-black"
                           {...field}
                           onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="wasLossmaking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Was de onderneming in één van de afgelopen 3 jaar verlieslatend? *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === 'true')}
                        value={field.value ? 'true' : 'false'}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-loss" />
                          <Label htmlFor="no-loss">Nee</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="yes-loss" />
                          <Label htmlFor="yes-loss">Ja</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prospects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">De vooruitzichten zijn: *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                         <SelectTrigger className="h-12 bg-input text-black">
                           <SelectValue placeholder="Krimpend" />
                         </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="krimpend">Krimpend</SelectItem>
                        <SelectItem value="wisselend">Wisselend</SelectItem>
                        <SelectItem value="gelijkblijvend">Gelijkblijvend</SelectItem>
                        <SelectItem value="stijgend">Stijgend</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Investeringen Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 font-heading">Investeringen</h3>
              <FormField
                control={form.control}
                name="averageYearlyInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Wat investeert u gemiddeld per jaar? (€) *</FormLabel>
                    <FormControl>
                       <Input
                         type="number"
                         placeholder="25000"
                         className="h-12 bg-input text-black"
                         {...field}
                         onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Overig Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 font-heading">Overig</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">In welke sector is het bedrijf actief? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger className="h-12 bg-input text-black">
                             <SelectValue placeholder="Selecteer sector" />
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

                <FormField
                  control={form.control}
                  name="employees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Hoeveel medewerkers (FTE) werken er? *</FormLabel>
                       <Select onValueChange={(value) => { 
                         field.onChange(parseInt(value));
                         // Store display value based on selection
                         const displayValue = value === "6" ? "2-10" : 
                                            value === "18" ? "11-25" :
                                            value === "38" ? "26-50" :
                                            value === "75" ? "51-100" : ">100";
                         form.setValue("employeesDisplay", displayValue);
                       }} value={field.value?.toString()}>
                        <FormControl>
                           <SelectTrigger className="h-12 bg-input text-black">
                             <SelectValue placeholder="Selecteer aantal werknemers" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">2-10</SelectItem>
                          <SelectItem value="18">11-25</SelectItem>
                          <SelectItem value="38">26-50</SelectItem>
                          <SelectItem value="75">51-100</SelectItem>
                          <SelectItem value="150">&gt;100</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                 />

                <FormField
                control={form.control}
                name="largestClientDependency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Voor hoeveel van mijn omzet ben ik afhankelijk van mijn grootste klant?</FormLabel>
                     <Select onValueChange={(value) => {
                       field.onChange(parseInt(value));
                       // Store display value based on selection
                       const displayValue = value === "12" ? "0-25%" : 
                                          value === "38" ? "26-50%" :
                                          value === "63" ? "51-75%" : "76-100%";
                       form.setValue("largestClientDependencyDisplay", displayValue);
                     }} value={field.value?.toString()}>
                      <FormControl>
                         <SelectTrigger className="h-12 bg-input text-black">
                           <SelectValue placeholder="Selecteer percentage" />
                         </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12">0-25%</SelectItem>
                        <SelectItem value="38">26-50%</SelectItem>
                        <SelectItem value="63">51-75%</SelectItem>
                        <SelectItem value="88">76-100%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="largestSupplierRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Als mijn grootste toeleverancier er mee ophoudt dan: *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                         <SelectTrigger className="h-12 bg-input text-black">
                           <SelectValue placeholder="Selecteer optie" />
                         </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="geen-probleem">Geen probleem, ik heb alternatieven</SelectItem>
                        <SelectItem value="korte-onderbreking">Korte onderbreking mogelijk</SelectItem>
                        <SelectItem value="grote-problemen">Grote problemen voor mijn bedrijf</SelectItem>
                        <SelectItem value="bedrijf-in-gevaar">Mijn bedrijf komt in gevaar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                 )}
               />
              </div>
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
      </div>
    </div>
  );
}