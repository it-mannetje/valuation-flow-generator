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
  console.log('🚀 ValuationReportPDF - Footer data received:');
  console.log('📊 footerTemplates:', footerTemplates);
  console.log('📋 pageFooters:', pageFooters);
  console.log('📄 pages:', pages);
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;
  const currentDate = new Date().toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Helper function to get page data
  const getPageData = (pageNumber: number) => {
    const page = pages.find(p => p.page_number === pageNumber);
    console.log(`Getting page data for page ${pageNumber}:`, page);
    const pageData = {
      background: page?.background_image_url || null,
      middle_image_url: page?.middle_image_url || null,
      image1_url: page?.image1_url || null,
      image2_url: page?.image2_url || null,
      content: page?.content || null,
      page_name: page?.page_name || null
    };
    console.log(`Page ${pageNumber} data:`, pageData);
    return pageData;
  };

  // Helper function to render images safely
  const renderBackgroundImage = (imageUrl: string | null) => {
    console.log('Rendering background image:', imageUrl);
    if (!imageUrl) {
      console.log('No background image URL provided');
      return null;
    }
    
    // Support both base64 and regular URLs
    if (imageUrl.startsWith('blob:')) {
      console.warn('Background image skipped - blob URLs not supported in PDF:', imageUrl);
      return null;
    }
    
    try {
      console.log('Successfully rendering background image');
      return <Image src={imageUrl} style={pdfStyles.backgroundImage} />;
    } catch (error) {
      console.warn('Failed to load background image:', imageUrl, error);
      return null;
    }
  };

  const renderLogo = (logoUrl: string | null, logoStyle: any) => {
    console.log('Rendering logo:', logoUrl);
    if (!logoUrl) {
      console.log('No logo URL provided');
      return null;
    }
    
    // Support both base64 and regular URLs
    if (logoUrl.startsWith('blob:')) {
      console.warn('Logo skipped - blob URLs not supported in PDF:', logoUrl);
      return null;
    }
    
    try {
      console.log('Successfully rendering logo');
      return <Image src={logoUrl} style={logoStyle} />;
    } catch (error) {
      console.warn('Failed to load logo:', logoUrl, error);
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
    console.log(`🔍 Looking for footer config for page ${pageNumber}`);
    console.log(`📊 Available pageFooters:`, pageFooters);
    console.log(`📋 Available footerTemplates:`, footerTemplates);
    
    // For debugging - always return a default footer config if data is available
    if (footerTemplates && footerTemplates.length > 0) {
      const defaultTemplate = footerTemplates.find(ft => ft.is_default) || footerTemplates[0];
      
      if (defaultTemplate) {
        console.log(`✅ Using default template for page ${pageNumber}:`, defaultTemplate);
        return {
          ...defaultTemplate.layout_config,
          // Override page number styling to match user requirements
          pageNumberStyle: {
            backgroundColor: '#f3f4f6', // Light gray
            borderRadius: 15,
            width: '85px', // ~3cm
            height: '42px', // ~1.5cm
            color: '#374151',
            fontSize: 12,
            fontWeight: 'normal'
          },
          dottedLineStyle: {
            color: '#1e40af', // Dark blue
            width: 2,
            height: 20,
            marginRight: 8
          }
        };
      }
    }
    
    console.log(`❌ No footer config available for page ${pageNumber}`);
    return null;
  };

  // Helper function to render footer
  const renderFooter = (pageNumber: number) => {
    console.log(`🚀 Rendering footer for page ${pageNumber}`);
    const footerConfig = getFooterConfig(pageNumber);
    
    if (!footerConfig) {
      console.log(`⚠️ No footer config found for page ${pageNumber}`);
      return null;
    }
    
    console.log(`✅ Rendering PDFFooter for page ${pageNumber} with config:`, footerConfig);
    
    return (
      <PDFFooter
        pageNumber={pageNumber}
        logoUrl={null} // Use text logo instead
        config={footerConfig}
        isEnabled={true}
      />
    );
  };

  return (
    <Document>
      {/* Page 1 - Cover */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Blue header section */}
        <View style={pdfStyles.coverHeaderSection}>
          <View style={pdfStyles.headerLeftContent}>
            <Text style={pdfStyles.headerTitle}>
              {getPageData(1).content?.title || "Rapport waardebepaling"}
            </Text>
            <Text style={pdfStyles.headerConfidential}>STRICTLY CONFIDENTIAL</Text>
          </View>
          {/* Logo in upper right corner - fetched from PDF management */}
          {getPageData(1).content?.logo_url ? (
            renderLogo(getPageData(1).content.logo_url, pdfStyles.headerLogo)
          ) : null}
        </View>
        
        {/* Main content area with image and company info */}
        <View style={pdfStyles.coverMainContent}>
          {/* Left section - Main image (60% width) */}
          <View style={pdfStyles.coverImageSection}>
            {getPageData(1).background ? (
              <Image 
                style={pdfStyles.coverMainImage} 
                src={getPageData(1).background} 
              />
            ) : (
              <Image 
                style={pdfStyles.coverMainImage} 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=800&h=600" 
              />
            )}
          </View>
          
          {/* Right section - Company info (40% width) */}
          <View style={pdfStyles.coverCompanySection}>
            {/* Decorative dotted line */}
            <View style={pdfStyles.companyDecorativeLine} />
            
            {/* Company name and date */}
            <Text style={pdfStyles.companyNameLarge}>{contactData.companyName}</Text>
            <Text style={pdfStyles.companyDate}>[{currentDate}]</Text>
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(1)}
      </Page>

      {/* Page 2 - New Layout */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Main content area with two columns */}
        <View style={pdfStyles.page2Layout}>
          {/* Left column - Image (45%) */}
          <View style={pdfStyles.page2LeftColumn}>
            {getPageData(2).background ? (
              <Image 
                style={pdfStyles.page2MainImage} 
                src={getPageData(2).background} 
              />
            ) : (
              <Image 
                style={pdfStyles.page2MainImage} 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
              />
            )}
          </View>
          
          {/* Right column - Title and text (55%) */}
          <View style={pdfStyles.page2RightColumn}>
            <Text style={pdfStyles.page2Title}>
              {getPageData(2).page_name || "Voorwoord"}
            </Text>
            
          {/* Show all text content from PDF management */}
            <View style={{ flex: 1 }}>
              {getPageData(2).content?.content ? (
                 getPageData(2).content.content.map((section: any, index: number) => (
                   <Text key={index} style={pdfStyles.page2TextContent}>
                     {section.text || ''}
                   </Text>
                 ))
               ) : (
                 <Text style={pdfStyles.page2TextContent}>
                  Ondernemen is kansen zien, risico's inschatten en soms moeilijke keuzes maken. Bij 
                  FBM Corporate Finance begrijpen we als geen ander wat daar allemaal bij komt kijken. 
                  Wij staan ondernemers bij in belangrijke financiële beslissingen, met een scherpe blik, 
                  een open houding en bovenal: advies met karakter. Met een persoonlijke benadering en 
                  diepgaande expertise helpen we middelgrote en grote bedrijven bij complexe vraagstukken 
                  op het gebied van fusies en overnames, financieringen, herstructureringen en 
                  bedrijfswaarderingen.
                </Text>
              )}
            </View>
            
            {/* Portrait image positioned below text in right section */}
            {getPageData(2).image1_url && (
              <Image 
                style={pdfStyles.page2PortraitImage} 
                src={getPageData(2).image1_url} 
              />
            )}
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(2)}
      </Page>

      {/* Page 3 - Calculation Results */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(3).background)}
        
        <View style={pdfStyles.content}>
          {/* Header with page number and title */}
          <View style={pdfStyles.page3Header}>
            <View style={pdfStyles.page3HeaderNumber}>
              <Text style={pdfStyles.page3Number}>3</Text>
            </View>
            <View style={pdfStyles.page3HeaderTitle}>
              <Text style={pdfStyles.page3Title}>Indicatieve calculatie</Text>
            </View>
          </View>
          
          {/* Main content area with two columns */}
          <View style={pdfStyles.page3MainContent}>
            {/* Left column - Input data */}
            <View style={pdfStyles.page3LeftColumn}>
              <Text style={pdfStyles.page3ColumnTitle}>Ingevoerde gegevens</Text>
              
              <View style={pdfStyles.page3DataList}>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Omzet in het afgelopen jaar</Text>
                  <Text style={pdfStyles.page3Value}>{savedValuationData?.revenue_range_display || companyData.lastYearRevenueDisplay || 'Niet ingevuld'}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Aandeel jaarlijks terugkerende omzet</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.recurringRevenuePercentageDisplay || `${companyData.recurringRevenuePercentage}%`}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Resultaat vorig boekjaar</Text>
                  <Text style={pdfStyles.page3Value}>{formatCurrency(companyData.result2024)}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Verwacht resultaat dit boekjaar</Text>
                  <Text style={pdfStyles.page3Value}>{formatCurrency(companyData.expectedResult2025)}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Verlies in de afgelopen 3 jaar</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.wasLossmaking ? 'Ja' : 'Nee'}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Vooruitzichten</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.prospects}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Gemiddelde investering per jaar</Text>
                  <Text style={pdfStyles.page3Value}>{savedValuationData?.average_yearly_investment ? formatCurrency(savedValuationData.average_yearly_investment) : formatCurrency(companyData.averageYearlyInvestment || 0)}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Sector</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.sector && sectors.length > 0 ? sectors.find(s => s.id === companyData.sector)?.name || valuationResult.sector : valuationResult.sector}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Aantal (FTE) medewerkers</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.employeesDisplay || companyData.employees}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Omzet via de grootste klant</Text>
                  <Text style={pdfStyles.page3Value}>{companyData.largestCustomerPercentageDisplay || companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Afhankelijkheid van grootste toeleverancier</Text>
                  <Text style={pdfStyles.page3Value}>Geen enkel probleem</Text>
                </View>
              </View>
              
              {/* Business images */}
              <View style={pdfStyles.page3Images}>
                {getPageData(3).image1_url && (
                  <Image 
                    style={pdfStyles.page3Image} 
                    src={getPageData(3).image1_url}
                  />
                )}
                {getPageData(3).image2_url && (
                  <Image 
                    style={pdfStyles.page3Image} 
                    src={getPageData(3).image2_url}
                  />
                )}
              </View>
            </View>
            
            {/* Dotted separator line */}
            <View style={pdfStyles.page3Separator} />
            
            {/* Right column - Key assumptions and results */}
            <View style={pdfStyles.page3RightColumn}>
              <Text style={pdfStyles.page3ColumnTitle}>Belangrijkste uitgangspunten</Text>
              
              {/* Key metrics boxes - 2x2 grid layout */}
              <View style={pdfStyles.page3MetricsContainer}>
                {/* First row */}
                <View style={pdfStyles.page3MetricsGrid}>
                  <View style={pdfStyles.page3MetricBox}>
                    <Text style={pdfStyles.page3MetricValue}>€ {Math.round(estimatedEbitda).toLocaleString('nl-NL')}</Text>
                    <Text style={pdfStyles.page3MetricLabel}>EBITDA (Adjusted)</Text>
                  </View>
                  <View style={pdfStyles.page3MetricBox}>
                    <Text style={pdfStyles.page3MetricValue}>{currentDate}</Text>
                    <Text style={pdfStyles.page3MetricLabel}>Waarderingsmoment</Text>
                  </View>
                </View>
                {/* Second row */}
                <View style={pdfStyles.page3MetricsGrid}>
                  <View style={pdfStyles.page3MetricBox}>
                    <Text style={pdfStyles.page3MetricValue}>€ {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')}</Text>
                    <Text style={pdfStyles.page3MetricLabel}>Ondernemingswaarde</Text>
                  </View>
                  <View style={pdfStyles.page3MetricBox}>
                    <View style={pdfStyles.page3MultiplierContainer}>
                      <Text style={pdfStyles.page3MultiplierValue}>{savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}</Text>
                      <Text style={pdfStyles.page3MultiplierText}> x EBITDA</Text>
                    </View>
                    <Text style={pdfStyles.page3MetricLabel}>Multiple op EBITDA</Text>
                  </View>
                </View>
              </View>
              
              {/* Disclaimer text */}
              <Text style={pdfStyles.page3Disclaimer}>
                Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde uitgangspunten. Neem contact met ons op om de exacte waarde van jouw bedrijf te bepalen.
              </Text>
              
              {/* Horizontal dotted line after disclaimer */}
              <View style={pdfStyles.page3HorizontalDottedLine} />
              
              {/* Bandwidth chart */}
              <View style={pdfStyles.page3ChartContainer}>
                <Text style={pdfStyles.page3ChartTitle}>Indicatieve bandbreedte</Text>
                
                {/* Added spacing after "Indicatieve bandbreedte" */}
                <View style={pdfStyles.page3SpacingAfterTitle}></View>
                
                <View style={pdfStyles.page3Chart}>
                  {/* Chart bars */}
                  <View style={pdfStyles.page3ChartBars}>
                    <View style={pdfStyles.page3ChartBar1}>
                      <View style={pdfStyles.page3Bar1} />
                    <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')}</Text>
                    </View>
                    <View style={pdfStyles.page3ChartBar2}>
                      <View style={pdfStyles.page3Bar2} />
                      <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')}</Text>
                    </View>
                    <View style={pdfStyles.page3ChartBar3}>
                      <View style={pdfStyles.page3Bar3} />
                      <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')}</Text>
                    </View>
                  </View>
                  
                  {/* Chart baseline */}
                  <View style={pdfStyles.page3ChartBaseline} />
                </View>
              </View>
            </View>
          </View>
          
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(3)}
      </Page>

      {/* Page 4 - Marktontwikkelingen */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Header section with number and title */}
        <View style={pdfStyles.page4HeaderContainer}>
          <View style={pdfStyles.page4HeaderNumber}>
            <Text style={pdfStyles.page4Number}>4</Text>
          </View>
          <View style={pdfStyles.page4HeaderTitle}>
            <Text style={pdfStyles.page4HeaderTitleText}>Markontwikkelingen</Text>
          </View>
        </View>
        
        {/* Main content layout */}
        <View style={pdfStyles.page4MainContent}>
          {/* Left section - Section 1 text and sector text */}
          <View style={pdfStyles.page4LeftColumn}>
            {/* Section 1 text from PDF management */}
            {getPageData(4).content?.content && getPageData(4).content.content[0] && (
              <Text style={pdfStyles.page4ContentText}>
                {getPageData(4).content.content[0].text || ''}
              </Text>
            )}
            
            {/* Sector text below section 1 */}
            <Text style={pdfStyles.page4ContentText}>
              {getSectorText() || 'De overnamemarkt in de sector kent een sterke dynamiek.'}
            </Text>
          </View>

          {/* Right section with image and section 2 text */}
          <View style={pdfStyles.page4RightColumn}>
            {/* Image from pdf management */}
            {getPageData(4).image1_url ? (
              <Image 
                style={pdfStyles.page4ImageMoved} 
                src={getPageData(4).image1_url}
              />
            ) : (
              <Image 
                style={pdfStyles.page4ImageMoved} 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=600" 
              />
            )}
            
            {/* Section 2 text below image */}
            {getPageData(4).content?.content && getPageData(4).content.content[1] && (
              <Text style={pdfStyles.page4ContentText}>
                {getPageData(4).content.content[1].text || ''}
              </Text>
            )}
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(4)}
      </Page>

      {/* Page 5 - Bedrijfswaardering */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Header section with number and title */}
        <View style={pdfStyles.page5HeaderContainer}>
          <View style={pdfStyles.page5HeaderNumber}>
            <Text style={pdfStyles.page5Number}>5</Text>
          </View>
          <View style={pdfStyles.page5HeaderTitle}>
            <Text style={pdfStyles.page5Title}>Business Valuation</Text>
          </View>
        </View>

        {/* Main content area with new layout */}
        <View style={pdfStyles.page5MainContent}>
          {/* Left section - text content (50% width) */}
          <View style={pdfStyles.page5LeftColumn}>
            {/* Section 1 from PDF management with blue color */}
            {getPageData(5).content?.content && getPageData(5).content.content[0] && (
              <Text style={pdfStyles.page5ContentText}>
                {getPageData(5).content.content[0].text || ''}
              </Text>
            )}
          </View>
          
          {/* Right section - image and section 2 text (50% width) */}
          <View style={pdfStyles.page5RightColumn}>
            {/* Image from pdf management */}
            {getPageData(5).image1_url ? (
              <Image 
                style={pdfStyles.page5SectionImage} 
                src={getPageData(5).image1_url}
              />
            ) : (
              <Image 
                style={pdfStyles.page5SectionImage} 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=600" 
              />
            )}
            
            {/* Section 2 text below image */}
            {getPageData(5).content?.content && getPageData(5).content.content[1] && (
              <Text style={pdfStyles.page5Section2Text}>
                {getPageData(5).content.content[1].text || ''}
              </Text>
            )}
          </View>
        </View>
        
        {/* Dynamic Footer */}
        {renderFooter(5)}
      </Page>

      {/* Page 6 - Final Cover Page */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Background image covering full width with 10% header space */}
        <View style={pdfStyles.page6FullBackground}>
          {getPageData(6).background ? (
            <Image 
              style={pdfStyles.page6FullBackgroundImage} 
              src={getPageData(6).background} 
            />
          ) : (
            <Image 
              style={pdfStyles.page6FullBackgroundImage} 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200&h=800" 
            />
          )}
        </View>
        
        {/* Page title on white background over image */}
        <View style={pdfStyles.page6TitleOverlay}>
          <Text style={pdfStyles.page6WhiteTitle}>{getPageData(6).page_name || "Titel vanuit pdf beheer"}</Text>
          
          {getPageData(6).content?.section1 && (
            <Text style={pdfStyles.page6Section1Text}>{getPageData(6).content.section1}</Text>
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
    
    console.log('PDF generated and download triggered successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};