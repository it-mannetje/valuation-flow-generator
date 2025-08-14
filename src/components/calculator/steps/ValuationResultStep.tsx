import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { formatCurrency, formatNumber } from '@/lib/calculator';
import { TrendingUp, Building2, Users, DollarSign, FileText, ChevronLeft, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/components/calculator/pdf/ValuationReportPDF';

interface ValuationResultStepProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
  onNext: () => void;
  onBack: () => void;
}

export default function ValuationResultStep({ 
  companyData, 
  contactData, 
  valuationResult, 
  onNext, 
  onBack 
}: ValuationResultStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [sectors, setSectors] = useState<SectorConfig[]>([]);
  const { toast } = useToast();
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;
  
  // Helper function to get revenue display text
  const getRevenueDisplayText = (revenue: number) => {
    switch (revenue) {
      case 500000: return "€0-1 miljoen";
      case 2000000: return "€1-3 miljoen";
      case 7000000: return "€4-10 miljoen";
      case 18000000: return "€11-25 miljoen";
      case 35000000: return "€>25 miljoen";
      default: return formatCurrency(revenue);
    }
  };

  // Fetch PDF pages and sectors for the PDF generation
  React.useEffect(() => {
    const fetchPDFData = async () => {
      try {
        // Fetch PDF pages
        const { data: pdfPages } = await supabase
          .from('pdf_pages')
          .select('*')
          .order('page_number');
        
        // Fetch sectors
        const { data: sectorData } = await supabase
          .from('sector_configs')
          .select('*')
          .order('name');
        
        setPages(pdfPages || []);
        setSectors(sectorData || []);
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      }
    };

    fetchPDFData();
  }, []);

  const saveToDatabase = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to save valuation data:', {
        companyData,
        contactData,
        valuationResult
      });

      const insertData = {
        // Contact Information
        contact_name: `${contactData.firstName} ${contactData.lastName}`,
        contact_email: contactData.email,
        contact_phone: contactData.phone,
        contact_company: contactData.companyName,
        
        // Financial Data
        revenue: companyData.lastYearRevenue,
        revenue_range_display: companyData.lastYearRevenueDisplay,
        result_previous_year: companyData.result2024,
        result_current_year: companyData.expectedResult2025,
        was_lossmaking: companyData.wasLossmaking,
        
        // Company Details
        sector: companyData.sector,
        employees: companyData.employees,
        employees_display: companyData.employeesDisplay,
        prospects: companyData.prospects,
        
        // Dependencies
        largest_client_dependency: companyData.largestClientDependency,
        largest_client_dependency_display: companyData.largestClientDependencyDisplay,
        largest_supplier_dependency: companyData.largestSupplierRisk,
        recurring_revenue: companyData.recurringRevenuePercentage,
        recurring_revenue_display: companyData.recurringRevenuePercentageDisplay,
        
        // Valuation Results
        valuation_amount: valuationResult.baseValuation,
        valuation_range_min: valuationResult.minValuation,
        valuation_range_max: valuationResult.maxValuation,
        multiplier: valuationResult.multiple
      };

      console.log('Insert data:', insertData);

      const { error } = await supabase
        .from('valuation_requests')
        .insert(insertData);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Aanvraag opgeslagen",
        description: "Uw bedrijfswaardering aanvraag is succesvol opgeslagen.",
      });

      // Generate and download PDF with database content
      await generatePDF(companyData, contactData, valuationResult, pages, sectors);
      
      // Proceed to next step
      onNext();
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        title: "Fout bij opslaan",
        description: `Er is een fout opgetreden bij het opslaan van uw aanvraag: ${error.message || 'Onbekende fout'}. Probeer het nogmaals.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Uw Bedrijfswaardering
        </h2>
        <p className="text-lg text-muted-foreground">
          Hallo {contactData.firstName}, hier is de professionele waardering van uw bedrijf
        </p>
      </div>

      {/* Main Valuation Card */}
      <Card className="shadow-lg bg-gradient-card rounded-lg">
        <CardHeader className="text-center border-b rounded-t-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">Geschatte Bedrijfswaardering {contactData.companyName}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Valuation */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  {formatCurrency(valuationResult.baseValuation)}
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Geschatte waarde
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {formatCurrency(valuationResult.minValuation)}
                  </div>
                  <div className="text-sm text-muted-foreground">Minimum waardering</div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {formatCurrency(valuationResult.maxValuation)}
                  </div>
                  <div className="text-sm text-muted-foreground">Maximum waardering</div>
                </div>
              </div>
            </div>

            {/* Valuation Details */}
            <div className="bg-background/60 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Waardering Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gem. Resultaat</span>
                  <span className="font-medium">{formatCurrency(estimatedEbitda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Multiple</span>
                  <span className="font-medium">{valuationResult.multiple.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-medium">{valuationResult.sector}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Waardering</span>
                  <span className="text-primary">{formatCurrency(valuationResult.baseValuation)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Information */}
        <Card className="shadow-card rounded-lg">
          <CardHeader className="rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Bedrijfsinformatie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">Bedrijfsnaam</div>
              <div className="font-medium">{contactData.companyName}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Sector</div>
                <div className="font-medium">{valuationResult.sector}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Werknemers</div>
                <div className="font-medium flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {companyData.employeesDisplay || companyData.employees}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Vooruitzichten</div>
                <div className="font-medium capitalize">{companyData.prospects}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Klant Afhankelijkheid</div>
                <div className="font-medium">{companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Metrics */}
        <Card className="shadow-card rounded-lg">
          <CardHeader className="rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Financiële Kerncijfers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Jaaromzet</div>
                <div className="font-medium">{getRevenueDisplayText(companyData.lastYearRevenue)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Terugkerend (%)</div>
                <div className="font-medium">{companyData.recurringRevenuePercentageDisplay || `${companyData.recurringRevenuePercentage}%`}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Resultaat 2024</div>
                <div className="font-medium">{formatCurrency(companyData.result2024)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Verwacht 2025</div>
                <div className="font-medium">{formatCurrency(companyData.expectedResult2025)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Gem. Investering</div>
                <div className="font-medium">{formatCurrency(companyData.averageYearlyInvestment)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Verlieslatend 3 jr</div>
                <div className="font-medium">{companyData.wasLossmaking ? 'Ja' : 'Nee'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="bg-accent/10 border-accent rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Belangrijke Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deze waardering is een indicatie gebaseerd op bedrijfsresultaten en sectorgemiddelden. 
                De werkelijke waarde van uw bedrijf kan afwijken door factoren zoals marktpositie, 
                groeiperspectieven, activa, schulden en marktontwikkelingen. Voor een definitieve 
                waardering adviseren wij een professionele due diligence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-primary" />
            Rapport Preview
          </CardTitle>
          <p className="text-muted-foreground">
            Hieronder ziet u een voorvertoning van uw bedrijfswaardering rapport
          </p>
        </CardHeader>
        <CardContent className="p-8 bg-background/80 mx-6 mb-6 rounded-lg shadow-sm">
          {/* Simplified report content */}
          <div className="space-y-6">
            <div className="text-center border-b pb-4">
              <h3 className="text-2xl font-bold text-foreground">Bedrijfswaardering Rapport</h3>
              <p className="text-muted-foreground">{contactData.companyName}</p>
              <p className="text-sm text-muted-foreground">Datum: {new Date().toLocaleDateString('nl-NL')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Waardering Samenvatting</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Geschatte waarde:</span>
                    <span className="font-medium">{formatCurrency(valuationResult.baseValuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="font-medium">{formatCurrency(valuationResult.minValuation)} - {formatCurrency(valuationResult.maxValuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiple:</span>
                    <span className="font-medium">{valuationResult.multiple.toFixed(1)}x</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Bedrijfsgegevens</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Sector:</span>
                    <span className="font-medium">{valuationResult.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Werknemers:</span>
                    <span className="font-medium">{companyData.employeesDisplay || companyData.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jaaromzet:</span>
                    <span className="font-medium">{getRevenueDisplayText(companyData.lastYearRevenue)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-muted-foreground text-xs pt-4 border-t">
              ... volledig rapport bevat uitgebreide analyse, marktdata en aanbevelingen ...
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Vorige Stap
        </Button>

        <Button
          size="lg"
          onClick={saveToDatabase}
          disabled={isLoading}
          className={cn(
            "bg-gradient-primary hover:shadow-primary",
            "transition-all duration-300 flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isLoading ? 'Opslaan...' : 'Download Rapport'}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="flex items-center justify-center gap-2"
          onClick={() => {
            // TODO: Implement personal advice request functionality
            console.log('Aanvragen persoonlijk advies');
          }}
        >
          <Users className="w-5 h-5" />
          Persoonlijk Advies
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex items-center justify-center gap-2"
          onClick={() => {
            // TODO: Implement restart functionality
            window.location.reload();
          }}
        >
          <TrendingUp className="w-5 h-5" />
          Nieuwe Berekening
        </Button>
      </div>
    </div>
  );
}