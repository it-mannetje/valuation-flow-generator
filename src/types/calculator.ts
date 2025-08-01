export interface CompanyData {
  // Omzet
  lastYearRevenue: number;
  recurringRevenuePercentage: number;
  
  // Bedrijfsresultaat
  result2024: number;
  expectedResult2025: number;
  wasLossmaking: boolean;
  prospects: string;
  
  // Investeringen
  averageYearlyInvestment: number;
  
  // Overig
  sector: string;
  employees: number;
  largestClientDependency: number;
  largestSupplierRisk: string;
  
  // Display values for ranges
  employeesDisplay?: string;
  largestClientDependencyDisplay?: string;
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

export const SECTORS: SectorConfig[] = [
  {
    id: 'technology',
    name: 'Technology',
    multiple: 5.2,
    description: 'Software, IT services, hardware',
    text: 'Technology companies typically command higher multiples due to scalability and growth potential.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    multiple: 4.8,
    description: 'Medical services, pharmaceuticals, devices',
    text: 'Healthcare businesses benefit from stable demand and regulatory barriers to entry.'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    multiple: 3.5,
    description: 'Industrial production, machinery',
    text: 'Manufacturing companies are valued based on asset intensity and market position.'
  },
  {
    id: 'retail',
    name: 'Retail',
    multiple: 3.2,
    description: 'Consumer goods, e-commerce',
    text: 'Retail valuations depend on brand strength and omnichannel capabilities.'
  },
  {
    id: 'finance',
    name: 'Financial Services',
    multiple: 4.1,
    description: 'Banking, insurance, fintech',
    text: 'Financial services are valued on regulatory compliance and recurring revenue streams.'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    multiple: 6.8,
    description: 'Property development, management',
    text: 'Real estate companies benefit from asset appreciation and rental income stability.'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    multiple: 4.5,
    description: 'Professional services, advisory',
    text: 'Consulting firms are valued on expertise, client relationships and recurring engagements.'
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    multiple: 3.8,
    description: 'Hotels, restaurants, tourism',
    text: 'Hospitality businesses are valued on location, brand recognition and operational efficiency.'
  },
  {
    id: 'energy',
    name: 'Energy',
    multiple: 4.2,
    description: 'Oil, gas, renewable energy',
    text: 'Energy companies are valued based on reserves, production capacity and market positioning.'
  },
  {
    id: 'logistics',
    name: 'Logistics',
    multiple: 3.9,
    description: 'Transportation, warehousing',
    text: 'Logistics companies benefit from e-commerce growth and supply chain optimization.'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    multiple: 3.1,
    description: 'Farming, food production',
    text: 'Agricultural businesses are valued on land assets, production efficiency and market access.'
  },
  {
    id: 'education',
    name: 'Education',
    multiple: 4.0,
    description: 'Schools, training, e-learning',
    text: 'Education providers are valued on accreditation, student outcomes and scalability.'
  }
];