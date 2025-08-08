import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyData, ContactData, ValuationResult } from '@/types/calculator';
import { formatCurrency, formatNumber } from '@/lib/calculator';
import { TrendingUp, Building2, Users, DollarSign, FileText, ChevronLeft, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;

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
                <div className="font-medium">{formatCurrency(companyData.lastYearRevenue)}</div>
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
          size="lg"
          onClick={onNext}
          className={cn(
            "flex-1 bg-gradient-primary hover:shadow-primary",
            "transition-all duration-300 transform hover:scale-105"
          )}
        >
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF Rapport
          </div>
        </Button>
      </div>
    </div>
  );
}