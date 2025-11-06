import React from 'react';
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';
import { pdfStyles } from './pdfStyles';
import PDFFooter from './PDFFooter';

import { FooterTemplate, PageFooter, FooterConfig } from '@/types/footer';

interface ValuationReportPDFProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
  pages?: any[];
  sectors?: SectorConfig[];
  footerTemplates?: FooterTemplate[];
  pageFooters?: PageFooter[];
  savedValuationData?: any;
}

const ValuationReportPDF: React.FC<ValuationReportPDFProps> = ({
  companyData,
  contactData,
  valuationResult,
  pages = [],
  sectors = [],
  footerTemplates = [],
  pageFooters = [],
  savedValuationData
}) => {
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;
  const currentDate = new Date().toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Helper function to get page data
  const getPageData = (pageNumber: number) => {
    const page = pages.find(p => p.page_number === pageNumber);
    const pageData = {
      background: page?.background_image_url || null,
      middle_image_url: page?.middle_image_url || null,
      image1_url: page?.image1_url || null,
      image2_url: page?.image2_url || null,
      content: page?.content || null,
      page_name: page?.page_name || null
    };
    return pageData;
  };

  // Helper function to render images safely
  const renderBackgroundImage = (imageUrl: string | null) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      return null;
    }
    
    try {
      return <Image src={imageUrl} style={pdfStyles.backgroundImage} />;
    } catch (error) {
      return null;
    }
  };

  const renderLogo = (logoUrl: string | null, logoStyle: any) => {
    if (!logoUrl || logoUrl.startsWith('blob:')) {
      return null;
    }
    
    try {
      return <Image src={logoUrl} style={logoStyle} />;
    } catch (error) {
      return null;
    }
  };

  // Helper function to render content with placeholders replaced
  const renderContentSections = (content: any) => {
    if (!content || !Array.isArray(content)) return null;
    
    return content.map((section: any, index: number) => {
      if (!section || typeof section !== 'object') return null;
      
      let sectionText = section.text || '';
      
      // Replace sector-specific placeholders
      if (companyData.sector && sectors.length > 0) {
        const sectorConfig = sectors.find(s => s.id === companyData.sector);
        if (sectorConfig) {
          sectionText = sectionText.replace(/PLACEHOLDER tekst 1 sector information/g, sectorConfig.text || '');
          sectionText = sectionText.replace(/PLACEHOLDER tekst 2 sector information/g, sectorConfig.text || '');
          sectionText = sectionText.replace(/{{sector_text}}/g, sectorConfig.text || '');
          sectionText = sectionText.replace(/{{sector_name}}/g, sectorConfig.name || '');
        }
      }
      
      // Replace other placeholders
      sectionText = sectionText.replace(/PLACEHOLDER tekst 1 foreword/g, '');
      sectionText = sectionText.replace(/PLACEHOLDER tekst 1 business valuation/g, '');
      sectionText = sectionText.replace(/PLACEHOLDER tekst 2 next pdfStyles/g, '');
      sectionText = sectionText.replace(/{{company_name}}/g, contactData.companyName || '');
      
      switch (section.type) {
        case 'heading':
          return <Text key={index} style={pdfStyles.sectionTitle}>{sectionText}</Text>;
        case 'paragraph':
          return <Text key={index} style={pdfStyles.forewordText}>{sectionText}</Text>;
        default:
          return <Text key={index} style={pdfStyles.forewordText}>{sectionText}</Text>;
      }
    }).filter(Boolean);
  };

  // Helper function to get sector text
  const getSectorText = () => {
    if (companyData.sector && sectors.length > 0) {
      const sectorConfig = sectors.find(s => s.id === companyData.sector);
      return sectorConfig?.text || '';
    }
    return '';
  };

  // Helper function to get footer config for a page
  const getFooterConfig = (pageNumber: number): FooterConfig | null => {
    // Find the page footer setting for this specific page
    const pageFooter = pageFooters?.find(pf => pf.page_number === pageNumber);
    
    if (!pageFooter || !pageFooter.is_enabled) {
      return null;
    }
    
    // Find the footer template assigned to this page
    const footerTemplate = footerTemplates?.find(ft => ft.id === pageFooter.footer_template_id);
    
    if (!footerTemplate) {
      return null;
    }
    
    return footerTemplate.layout_config;
  };

  // Helper function to render footer
  const renderFooter = (pageNumber: number) => {
    const footerConfig = getFooterConfig(pageNumber);
    
    if (!footerConfig) {
      return null;
    }
    
    return (
      <PDFFooter
        pageNumber={pageNumber}
        logoUrl={footerConfig.logoPosition ? null : null} // Will use text logo from PDFFooter
        config={footerConfig}
        isEnabled={true}
      />
    );
  };

  return (
    <Document>
      {/* Page 1 - Cover */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {/* Main content area with image only */}
        <View style={pdfStyles.coverMainContent}>
          {/* Full width image */}
          <View style={pdfStyles.coverImageSection}>
            {getPageData(1).background && (
              <Image 
                style={pdfStyles.coverMainImage} 
                src={getPageData(1).background} 
              />
            )}
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(1)}
      </Page>

      {/* Page 2 - New Layout */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {/* Full width image only */}
        <View style={pdfStyles.page2Layout}>
          {/* Full width image */}
          <View style={pdfStyles.page2LeftColumn}>
            {getPageData(2).background && (
              <Image 
                style={pdfStyles.page2MainImage} 
                src={getPageData(2).background} 
              />
            )}
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(2)}
      </Page>

      {/* Page 3 - Calculation Results */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(3).background)}
        
        {/* Left side data fields */}
        <View style={{ position: 'absolute', left: 50, top: 350 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Omzet</Text>
            <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'bold' }}>{savedValuationData?.revenue_range_display || companyData.lastYearRevenueDisplay || 'Niet ingevuld'}</Text>
          </View>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>EBITDA</Text>
            <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'bold' }}>€ {Math.round(estimatedEbitda).toLocaleString('nl-NL')}</Text>
          </View>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>FTE</Text>
            <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'bold' }}>{companyData.employeesDisplay || companyData.employees}</Text>
          </View>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Sector</Text>
            <Text style={{ fontSize: 16, color: '#000000', fontWeight: 'bold' }}>{companyData.sector && sectors.length > 0 ? sectors.find(s => s.id === companyData.sector)?.name || valuationResult.sector : valuationResult.sector}</Text>
          </View>
        </View>
        
        {/* Right side data fields */}
        <View style={{ position: 'absolute', right: 50, top: 200 }}>
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Score</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{companyData.prospects || 'Gelijk'}</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Multiple</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>EBITDA</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>€ {Math.round(estimatedEbitda).toLocaleString('nl-NL')}</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Waarderingsmoment</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{currentDate}</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Ondernemingswaarde</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>€ {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')}</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Low Multiple</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{(valuationResult.multiple - 0.5).toFixed(1)}x</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>High Multiple</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>{(valuationResult.multiple + 0.5).toFixed(1)}x</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Waarde Laag</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>€ {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')}</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 10, color: '#666666', marginBottom: 4 }}>Waarde Hoog</Text>
            <Text style={{ fontSize: 14, color: '#000000', fontWeight: 'bold' }}>€ {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')}</Text>
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(3)}
      </Page>

      {/* Page 4 - Marktontwikkelingen */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(4).background)}
        
        {/* Main content layout */}
        <View style={pdfStyles.page4MainContent}>
          {/* Full width section - Section 1 text and sector text */}
          <View style={pdfStyles.page4LeftColumn}>
            {/* Section 1 text from PDF management */}
            {getPageData(4).content?.content && getPageData(4).content.content[0] && (
              <Text style={pdfStyles.page4ContentText}>
                {getPageData(4).content.content[0].text || ''}
              </Text>
            )}
            
            {/* Show sector name above sector text with blue color */}
            {companyData.sector && sectors.length > 0 && (
              <Text style={pdfStyles.page4SectorNameBlue}>
                {sectors.find(s => s.id === companyData.sector)?.name || ''}
              </Text>
            )}
            
            {/* Sector text below sector name */}
            <Text style={pdfStyles.page4ContentText}>
              {getSectorText() || 'De overnamemarkt in de sector kent een sterke dynamiek.'}
            </Text>
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(4)}
      </Page>

      {/* Page 6 - Final Cover Page */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {/* Background image covering full width */}
        <View style={pdfStyles.page6FullBackground}>
          {getPageData(6).background && (
            <Image 
              style={pdfStyles.page6FullBackgroundImage} 
              src={getPageData(6).background} 
            />
          )}
        </View>
        
        {/* Section 2 text at bottom with 25% left margin */}
        {getPageData(6).content?.section2 && (
          <View style={pdfStyles.page6BottomText}>
            <Text style={pdfStyles.page6Section2Text}>
              {getPageData(6).content.section2}
            </Text>
          </View>
        )}
        
        {/* Dynamic Footer */}
        {renderFooter(6)}
      </Page>
    </Document>
  );
};

export default ValuationReportPDF;

// Export the generatePDF function for backwards compatibility
export const generatePDF = async (
  companyData: CompanyData,
  contactData: ContactData,
  valuationResult: ValuationResult,
  pages?: any[],
  sectors?: SectorConfig[],
  savedValuationData?: any
) => {
  try {
    // Create the PDF document
    const MyDocument = (
      <ValuationReportPDF 
        companyData={companyData} 
        contactData={contactData} 
        valuationResult={valuationResult} 
        pages={pages} 
        sectors={sectors} 
        savedValuationData={savedValuationData}
      />
    );
    
    // Generate the PDF as a blob
    const pdfBlob = await pdf(MyDocument).toBlob();
    
    // Create a download link and trigger the download
    const fileName = `Bedrijfswaardering_${contactData.companyName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // PDF generation successful
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};