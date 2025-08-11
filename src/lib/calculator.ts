import { CompanyData, ValuationResult, SectorConfig } from '@/types/calculator';

export function calculateValuation(companyData: CompanyData, sectors: SectorConfig[]): ValuationResult {
  // Find sector configuration
  const sectorConfig = sectors.find(s => s.id === companyData.sector);
  
  if (!sectorConfig) {
    throw new Error('Invalid sector selected');
  }

  let multiple = sectorConfig.multiple;
  
  // Use the average of result2024 and expectedResult2025 as EBITDA proxy + yearly investment
  const adjustedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2 + companyData.averageYearlyInvestment;

  // Adjust multiplier based on EBITDA ranges
  if (adjustedEbitda < 200000) {
    multiple -= 0.90;
  } else if (adjustedEbitda < 500000) {
    multiple -= 0.40;
  } else if (adjustedEbitda < 1000000) {
    // No adjustment - multiplier stays the same
  } else if (adjustedEbitda < 2000000) {
    multiple += 0.50;
  } else if (adjustedEbitda < 5000000) {
    multiple += 1.00;
  }

  // Adjust multiplier for loss-making history
  if (companyData.wasLossmaking) {
    multiple -= 1.5;
  }

  // Calculate base valuation
  const baseValuation = multiple * adjustedEbitda;
  
  // Calculate range (±0.3 multiple)
  const minValuation = (multiple - 0.3) * adjustedEbitda;
  const maxValuation = (multiple + 0.3) * adjustedEbitda;

  return {
    baseValuation: Math.round(baseValuation),
    minValuation: Math.round(minValuation),
    maxValuation: Math.round(maxValuation),
    multiple,
    sector: sectorConfig.name
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('nl-NL').format(number);
}

export function validateEbitda(ebitda: number): boolean {
  return ebitda > 0 && ebitda < 1000000000; // Max 1 billion
}

export function validateRevenue(revenue: number): boolean {
  return revenue > 0 && revenue < 10000000000; // Max 10 billion
}

export function validateEmployees(employees: number): boolean {
  return employees > 0 && employees < 1000000; // Max 1 million
}