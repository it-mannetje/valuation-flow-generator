import React from 'react';
import { CompanyData, SectorConfig } from '@/types/calculator';

// Mock static data for preview
const mockCompanyData: CompanyData = {
  lastYearRevenue: 2500000,
  recurringRevenuePercentage: 75,
  result2024: 450000,
  expectedResult2025: 500000,
  wasLossmaking: false,
  prospects: 'good',
  averageYearlyInvestment: 50000,
  sector: 'it-services',
  employees: 25,
  employeesDisplay: '20-30',
  largestClientDependency: 25,
  largestSupplierRisk: 'low',
  managementParticipation: true,
};

const mockSectors: SectorConfig[] = [
  {
    id: 'it-services',
    name: 'IT Services',
    multiple: 5.5,
    description: 'IT Services sector',
    text: 'Sample text',
  },
];

const PDFPreview = () => {
  const estimatedEbitda = 375000;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">PDF Page 3 Preview</h1>
          <a 
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Calculator
          </a>
        </div>
        
        {/* PDF Page Container - A4 aspect ratio */}
        <div 
          className="bg-white mx-auto shadow-2xl relative overflow-hidden"
          style={{ 
            width: '210mm',
            height: '297mm',
            position: 'relative'
          }}
        >
          {/* Background Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-blue-50">
            {/* Dot pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-50">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    bottom: 20 + (i % 5) * 30,
                    left: 30 + Math.floor(i / 5) * 50,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Left Sidebar - React version for preview */}
          <div 
            className="absolute left-12 top-24"
            style={{ width: '30%' }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-7 h-[50%]" style={{ paddingTop: '20%' }}>
              {/* Header */}
              <div className="flex flex-col items-center mb-5">
                {/* Icon */}
                <div className="w-12 h-12 mb-3.5 bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-7 border-2 border-gray-500 rounded bg-white relative">
                    <div className="w-3.5 h-0.5 bg-gray-500 mt-1.5 ml-1.5" />
                    <div className="w-3.5 h-0.5 bg-gray-500 mt-0.5 ml-1.5" />
                    <div className="w-2.5 h-0.5 bg-gray-500 mt-0.5 ml-1.5" />
                  </div>
                </div>
                <p className="text-[15px] font-semibold text-gray-800 tracking-tight">
                  Ingevulde gegevens
                </p>
              </div>

              {/* Data Section */}
              <div className="space-y-4">
                {/* OMZET */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide text-center">
                    OMZET
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 text-center">
                    € {Math.round(mockCompanyData.lastYearRevenue).toLocaleString('nl-NL')},-
                  </p>
                </div>

                {/* EBITDA */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide text-center">
                    EBITDA
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 text-center">
                    € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
                  </p>
                </div>

                {/* FTE */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide text-center">
                    FTE
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 text-center">
                    {mockCompanyData.employeesDisplay || mockCompanyData.employees}
                  </p>
                </div>

                {/* SECTOR */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide text-center">
                    SECTOR
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 text-center">
                    {mockSectors.find((s) => s.id === mockCompanyData.sector)?.name || mockCompanyData.sector}
                  </p>
                </div>

                {/* MANAGEMENTPARTICIPATIE */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-gray-500 font-medium tracking-wide text-center">
                    MANAGEMENTPARTICIPATIE
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 text-center">
                    {mockCompanyData.managementParticipation ? 'JA' : 'NEE'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area - Placeholder */}
          <div className="absolute right-12 top-24 bottom-24" style={{ width: '60%' }}>
            <div className="bg-white/50 rounded-2xl p-8 h-full flex items-center justify-center">
              <p className="text-gray-400 text-lg">Main content area</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Preview updates in real-time as you make changes to Page3LeftSidebar component</p>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
