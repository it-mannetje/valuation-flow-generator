import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalculatorState, CompanyData, ContactData, ValuationResult } from '@/types/calculator';
import CompanyDataStep from './steps/CompanyDataStep';
import ContactDataStep from './steps/ContactDataStep';
import ValuationResultStep from './steps/ValuationResultStep';
import PDFGenerationStep from './steps/PDFGenerationStep';
import { calculateValuation } from '@/lib/calculator';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Bedrijfsgegevens', description: 'Voer uw bedrijfsinformatie in' },
  { id: 2, title: 'Contactgegevens', description: 'Uw persoonlijke gegevens' },
  { id: 3, title: 'Waardering', description: 'Bekijk uw bedrijfswaardering' },
  { id: 4, title: 'Rapport', description: 'Download uw PDF rapport' }
];

export default function CalculatorWizard() {
  const [state, setState] = useState<CalculatorState>({
    currentStep: 1,
    companyData: {},
    contactData: {},
    valuationResult: null,
    sessionId: Math.random().toString(36).substring(2, 15)
  });

  const [isLoading, setIsLoading] = useState(false);

  const progress = (state.currentStep / STEPS.length) * 100;

  const handleCompanyDataSubmit = async (data: CompanyData) => {
    setIsLoading(true);
    
    try {
      const valuationResult = calculateValuation(data);
      
      setState(prev => ({
        ...prev,
        companyData: data,
        valuationResult,
        currentStep: 2
      }));
    } catch (error) {
      console.error('Error calculating valuation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactDataSubmit = (data: ContactData) => {
    setState(prev => ({
      ...prev,
      contactData: data,
      currentStep: 3
    }));
  };

  const handleNextToReport = () => {
    setState(prev => ({
      ...prev,
      currentStep: 4
    }));
  };

  const handlePrevStep = () => {
    if (state.currentStep > 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const handleRestart = () => {
    setState({
      currentStep: 1,
      companyData: {},
      contactData: {},
      valuationResult: null,
      sessionId: Math.random().toString(36).substring(2, 15)
    });
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <CompanyDataStep
            data={state.companyData}
            onSubmit={handleCompanyDataSubmit}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <ContactDataStep
            data={state.contactData}
            valuationResult={state.valuationResult}
            onSubmit={handleContactDataSubmit}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <ValuationResultStep
            companyData={state.companyData as CompanyData}
            contactData={state.contactData as ContactData}
            valuationResult={state.valuationResult as ValuationResult}
            onNext={handleNextToReport}
            onBack={handlePrevStep}
          />
        );
      case 4:
        return (
          <PDFGenerationStep
            companyData={state.companyData as CompanyData}
            contactData={state.contactData as ContactData}
            valuationResult={state.valuationResult as ValuationResult}
            onRestart={handleRestart}
            onBack={handlePrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Bedrijfswaardering Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ontdek de waarde van uw bedrijf met onze professionele waarderingstool
          </p>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Stap {state.currentStep} van {STEPS.length}
              </h2>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% voltooid
              </span>
            </div>
            
            <Progress value={progress} className="mb-6" />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center text-center",
                    "transition-all duration-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                      "transition-all duration-300",
                      state.currentStep > step.id
                        ? "bg-primary text-primary-foreground shadow-primary"
                        : state.currentStep === step.id
                        ? "bg-gradient-primary text-primary-foreground shadow-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.id}
                  </div>
                  <div className="max-w-[120px]">
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      state.currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="animate-fade-in">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}