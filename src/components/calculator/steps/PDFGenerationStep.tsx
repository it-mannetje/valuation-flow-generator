import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyData, ContactData, ValuationResult, SECTORS } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';
import { Download, FileText, RotateCcw, ChevronLeft, CheckCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmittingToHubSpot, setIsSubmittingToHubSpot] = useState(false);
  const [isPDFGenerated, setIsPDFGenerated] = useState(false);
  const [isSubmittedToHubSpot, setIsSubmittedToHubSpot] = useState(false);
  const { toast } = useToast();

  const sectorConfig = SECTORS.find(s => s.id === companyData.sector);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Simulate PDF generation (replace with actual PDF generation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create PDF data (mock implementation)
      const pdfData = {
        companyName: companyData.companyName,
        contactName: `${contactData.firstName} ${contactData.lastName}`,
        valuation: valuationResult.baseValuation,
        minValuation: valuationResult.minValuation,
        maxValuation: valuationResult.maxValuation,
        sector: valuationResult.sector,
        multiple: valuationResult.multiple,
        ebitda: companyData.ebitda,
        revenue: companyData.revenue,
        employees: companyData.employees,
        location: companyData.location,
        foundedYear: companyData.foundedYear,
        sectorText: sectorConfig?.text || 'Sectorspecifieke informatie niet beschikbaar.'
      };

      // Create a downloadable file (mock)
      const blob = new Blob([JSON.stringify(pdfData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bedrijfswaardering_${companyData.companyName.replace(/\s+/g, '_')}.json`;
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
        company_ebitda: companyData.ebitda,
        company_revenue: companyData.revenue,
        company_employees: companyData.employees,
        valuation_multiple: valuationResult.multiple
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
          PDF Rapport & Opvolging
        </h2>
        <p className="text-lg text-muted-foreground">
          Download uw persoonlijke bedrijfswaardering rapport en ontvang professioneel advies
        </p>
      </div>

      {/* PDF Generation Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-card border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">PDF Rapport Generatie</CardTitle>
              <p className="text-muted-foreground">
                Uw persoonlijke bedrijfswaardering rapport met alle details
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PDF Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Rapport Inhoud</h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Executive Summary</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Bedrijfsinformatie: {companyData.companyName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Financiële Analyse</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Sector Analysis: {valuationResult.sector}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Waardering: {formatCurrency(valuationResult.baseValuation)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Recommendations & Next Steps</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Download Uw Rapport</h3>
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  size="lg"
                  className={cn(
                    "w-full bg-gradient-primary hover:shadow-primary",
                    "transition-all duration-300",
                    isPDFGenerated && "bg-success hover:bg-success"
                  )}
                >
                  {isGeneratingPDF ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Genereren...
                    </div>
                  ) : isPDFGenerated ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Rapport Gedownload
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download PDF Rapport
                    </div>
                  )}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Professioneel Advies</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ontvang persoonlijk advies van onze waarderingsexperts over uw bedrijf en mogelijke exit strategieën.
                </p>
                <Button
                  onClick={handleSubmitToHubSpot}
                  disabled={isSubmittingToHubSpot}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full",
                    isSubmittedToHubSpot && "border-success text-success"
                  )}
                >
                  {isSubmittingToHubSpot ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verzenden...
                    </div>
                  ) : isSubmittedToHubSpot ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Gegevens Verzonden
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Aanvragen Persoonlijk Advies
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-center">Waardering Samenvatting</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {formatCurrency(valuationResult.baseValuation)}
              </div>
              <div className="text-sm text-muted-foreground">Geschatte Waardering</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {valuationResult.multiple.toFixed(1)}x
              </div>
              <div className="text-sm text-muted-foreground">EBITDA Multiple</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {valuationResult.sector}
              </div>
              <div className="text-sm text-muted-foreground">Sector</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Vorige Stap
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Nieuwe Berekening
        </Button>
      </div>
    </div>
  );
}