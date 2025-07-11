import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ContactData, ValuationResult } from '@/types/calculator';
import { User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/calculator';
import { cn } from '@/lib/utils';

const contactDataSchema = z.object({
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: z.string().min(2, 'Achternaam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  phone: z.string().min(10, 'Voer een geldig telefoonnummer in'),
  companyName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters bevatten'),
  position: z.string().min(2, 'Functie moet minimaal 2 karakters bevatten')
});

interface ContactDataStepProps {
  data: Partial<ContactData>;
  valuationResult: ValuationResult | null;
  onSubmit: (data: ContactData) => void;
  onBack: () => void;
}

export default function ContactDataStep({ data, valuationResult, onSubmit, onBack }: ContactDataStepProps) {
  const form = useForm<ContactData>({
    resolver: zodResolver(contactDataSchema),
    defaultValues: {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      companyName: data.companyName || '',
      position: data.position || ''
    }
  });

  const handleSubmit = (formData: ContactData) => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-card border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Contactgegevens</CardTitle>
                  <p className="text-muted-foreground">
                    Voer uw gegevens in om uw persoonlijke bedrijfswaardering te ontvangen
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Voornaam *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jan"
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Achternaam *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="de Vries"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">E-mailadres *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jan@bedrijf.nl"
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Telefoonnummer *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+31 6 12345678"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Business Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Bedrijfsnaam *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mijn Bedrijf B.V."
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
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Functie *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="CEO / Eigenaar"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={onBack}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Vorige Stap
                    </Button>

                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        "flex-1 bg-gradient-primary hover:shadow-primary",
                        "transition-all duration-300 transform hover:scale-105"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Bekijk Waardering
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Valuation Preview */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg bg-gradient-card sticky top-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl text-foreground">Waardering Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gebaseerd op uw bedrijfsgegevens
              </p>
            </CardHeader>

            <CardContent className="p-6">
              {valuationResult ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatCurrency(valuationResult.baseValuation)}
                    </div>
                    <p className="text-sm text-muted-foreground">Geschatte waardering</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(valuationResult.minValuation)}
                      </div>
                      <div className="text-xs text-muted-foreground">Minimum</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(valuationResult.maxValuation)}
                      </div>
                      <div className="text-xs text-muted-foreground">Maximum</div>
                    </div>
                  </div>

                  <div className="bg-accent/20 rounded-lg p-4">
                    <div className="text-sm font-medium text-foreground mb-1">
                      Sector: {valuationResult.sector}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Multiple: {valuationResult.multiple.toFixed(1)}x
                    </div>
                  </div>

                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-sm text-success-foreground">
                      ✓ Vul uw contactgegevens in om het volledige rapport te ontvangen
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Waardering wordt berekend...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}