import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyData, ContactData, ValuationResult } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';
import { Download, FileText, RotateCcw, ChevronLeft, CheckCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSectorConfig } from '@/hooks/useSectorConfig';

interface PDFGenerationStepProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
  onRestart: () => void;
  onBack: () => void;
}

export default function PDFGenerationStep({ 
  companyData, 
  contactData, 
  valuationResult, 
  onRestart, 
  onBack 
}: PDFGenerationStepProps) {
  const { sectors } = useSectorConfig();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmittingToHubSpot, setIsSubmittingToHubSpot] = useState(false);
  const [isPDFGenerated, setIsPDFGenerated] = useState(false);
  const [isSubmittedToHubSpot, setIsSubmittedToHubSpot] = useState(false);
  const { toast } = useToast();

  const sectorConfig = sectors.find(s => s.id === companyData.sector);
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Simulate PDF generation (replace with actual PDF generation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create PDF data (mock implementation)
      const pdfData = {
        contactName: `${contactData.firstName} ${contactData.lastName}`,
        companyName: contactData.companyName,
        valuation: valuationResult.baseValuation,
        minValuation: valuationResult.minValuation,
        maxValuation: valuationResult.maxValuation,
        sector: valuationResult.sector,
        multiple: valuationResult.multiple,
        estimatedEbitda: estimatedEbitda,
        lastYearRevenue: companyData.lastYearRevenue,
        recurringRevenuePercentage: companyData.recurringRevenuePercentage,
        result2024: companyData.result2024,
        expectedResult2025: companyData.expectedResult2025,
        employees: companyData.employees,
        wasLossmaking: companyData.wasLossmaking,
        prospects: companyData.prospects,
        averageYearlyInvestment: companyData.averageYearlyInvestment,
        largestClientDependency: companyData.largestClientDependency,
        largestSupplierRisk: companyData.largestSupplierRisk,
        sectorText: sectorConfig?.text || 'Sectorspecifieke informatie niet beschikbaar.'
      };

      // Create a downloadable file (mock)
      const blob = new Blob([JSON.stringify(pdfData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bedrijfswaardering_${contactData.companyName.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsPDFGenerated(true);
      toast({
        title: "PDF Rapport Gegenereerd",
        description: "Uw bedrijfswaardering rapport is succesvol aangemaakt en gedownload.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Fout bij PDF Generatie",
        description: "Er is een fout opgetreden bij het aanmaken van het PDF rapport.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSubmitToHubSpot = async () => {
    setIsSubmittingToHubSpot(true);
    
    try {
      // Simulate HubSpot submission (replace with actual HubSpot API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hubspotData = {
        firstname: contactData.firstName,
        lastname: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.companyName,
        jobtitle: contactData.position,
        company_valuation: valuationResult.baseValuation,
        company_sector: valuationResult.sector,
        company_estimated_ebitda: estimatedEbitda,
        company_last_year_revenue: companyData.lastYearRevenue,
        company_employees: companyData.employees,
        valuation_multiple: valuationResult.multiple,
        company_prospects: companyData.prospects,
        largest_client_dependency: companyData.largestClientDependency
      };

      console.log('Submitting to HubSpot:', hubspotData);
      
      setIsSubmittedToHubSpot(true);
      toast({
        title: "Gegevens Verzonden",
        description: "Uw gegevens zijn succesvol verzonden naar ons CRM systeem.",
      });
    } catch (error) {
      console.error('Error submitting to HubSpot:', error);
      toast({
        title: "Fout bij Verzenden",
        description: "Er is een fout opgetreden bij het verzenden van uw gegevens.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingToHubSpot(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          PDF rapport en opvolging
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Dank voor uw aanvraag! Uw bedrijfswaardering is voltooid.
        </p>
        <p className="text-base text-muted-foreground">
          Indien u nu al een persoonlijk advies wilt aanvragen, maak dan nu een afspraak via onderstaande knop.
        </p>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-gradient-card border-b rounded-t-lg text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">Uw Bedrijfswaardering</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Valuation Summary */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-primary mb-4">
              {formatCurrency(valuationResult.baseValuation)}
            </div>
            <div className="text-lg text-muted-foreground mb-2">
              Geschatte waarde van {contactData.companyName}
            </div>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <span>Min: {formatCurrency(valuationResult.minValuation)}</span>
              <span>Max: {formatCurrency(valuationResult.maxValuation)}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center bg-muted/30 rounded-lg p-4">
              <div className="text-xl font-bold text-foreground mb-1">
                {valuationResult.multiple.toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">Resultaat Multiple</div>
            </div>
            <div className="text-center bg-muted/30 rounded-lg p-4">
              <div className="text-xl font-bold text-foreground mb-1">
                {valuationResult.sector}
              </div>
              <div className="text-sm text-muted-foreground">Sector</div>
            </div>
            <div className="text-center bg-muted/30 rounded-lg p-4">
              <div className="text-xl font-bold text-foreground mb-1">
                {formatCurrency(estimatedEbitda)}
              </div>
              <div className="text-sm text-muted-foreground">Gem. Resultaat</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSubmitToHubSpot}
              disabled={isSubmittingToHubSpot}
              size="lg"
              className={cn(
                "w-full bg-gradient-primary hover:shadow-primary",
                "transition-all duration-300",
                isSubmittedToHubSpot && "bg-success hover:bg-success"
              )}
            >
              {isSubmittingToHubSpot ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verzenden...
                </div>
              ) : isSubmittedToHubSpot ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Advies Aangevraagd
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Aanvragen Persoonlijk Advies
                </div>
              )}
            </Button>

            <div className="flex flex-col sm:flex-row gap-4">
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
                variant="outline"
                size="lg"
                onClick={onRestart}
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Nieuwe Berekening
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}