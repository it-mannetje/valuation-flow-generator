export interface CompanyData {
  // Omzet
  lastYearRevenue: number;
  lastYearRevenueDisplay?: string;
  recurringRevenuePercentage: number;
  
  // Bedrijfsresultaat
  result2024: number;
  expectedResult2025: number;
  wasLossmaking: boolean;
  prospects: string;
  
  // Investeringen
  averageYearlyInvestment: number;
  averageYearlyInvestmentDisplay?: string;
  
  // Overig
  sector: string;
  employees: number;
  largestClientDependency: number;
  largestCustomerPercentage?: number;
  largestCustomerPercentageDisplay?: string;
  largestSupplierRisk: string;
  
  // Display values for ranges
  employeesDisplay?: string;
  largestClientDependencyDisplay?: string;
  recurringRevenuePercentageDisplay?: string;
}

export interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  position: string;
}

export interface ValuationResult {
  baseValuation: number;
  minValuation: number;
  maxValuation: number;
  multiple: number;
  sector: string;
  // Additional properties for PDF
  value?: number;
  method?: string;
  rangeMin?: number;
  rangeMax?: number;
}

export interface SectorConfig {
  id: string;
  name: string;
  multiple: number;
  description: string;
  text: string;
}

export interface CalculatorState {
  currentStep: number;
  companyData: Partial<CompanyData>;
  contactData: Partial<ContactData>;
  valuationResult: ValuationResult | null;
  sessionId: string;
}

// DEPRECATED: Static sector data is now fetched from Supabase database via useSectorConfig hook
// This constant is kept for backward compatibility but should not be used in new code