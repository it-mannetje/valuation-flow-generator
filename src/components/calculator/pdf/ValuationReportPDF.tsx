import React from 'react';
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';
import { pdfStyles } from './pdfStyles';

interface ValuationReportPDFProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
  pages?: any[];
  sectors?: SectorConfig[];
}

const ValuationReportPDF: React.FC<ValuationReportPDFProps> = ({
  companyData,
  contactData,
  valuationResult,
  pages = [],
  sectors = []
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
    return {
      background: page?.background_image_url || null,
      topLogo: page?.top_logo_url || null,
      topLogoPosition: page?.top_logo_position || 'left',
      footerLogo: page?.footer_logo_url || null,
      footerLogoPosition: page?.footer_logo_position || 'left',
      middle_image_url: page?.middle_image_url || null,
      logo_image_url: page?.logo_image_url || null,
      image1_url: page?.image1_url || null,
      image2_url: page?.image2_url || null,
      content: page?.content || null,
      page_name: page?.page_name || null
    };
  };

  // Helper function to render images safely
  const renderBackgroundImage = (imageUrl: string | null) => {
    if (!imageUrl || imageUrl.startsWith('blob:')) return null;
    
    try {
      return <Image src={imageUrl} style={pdfStyles.backgroundImage} />;
    } catch (error) {
      console.warn('Failed to load background image:', imageUrl, error);
      return null;
    }
  };

  const renderLogo = (logoUrl: string | null, logoStyle: any) => {
    if (!logoUrl || logoUrl.startsWith('blob:')) return null;
    
    try {
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

  // Helper to get revenue display from display value
  const getRevenueDisplay = () => {
    return companyData.lastYearRevenueDisplay || formatCurrency(companyData.lastYearRevenue);
  };

  return (
    <Document>
      {/* Page 1 - Cover */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Blue header section */}
        <View style={pdfStyles.coverHeaderSection}>
          <View style={pdfStyles.headerLeftContent}>
            <View style={{
              backgroundColor: '#1e3a8a',
              padding: '8 16',
              borderRadius: 8,
              marginRight: 20
            }}>
              <Text style={[pdfStyles.headerTitle, { backgroundColor: 'transparent' }]}>Rapport waardebepaling</Text>
            </View>
            <Text style={[pdfStyles.headerConfidential, { color: '#60a5fa', fontWeight: 'bold' }]}>STRICTLY CONFIDENTIAL</Text>
          </View>
          {/* Logo in header */}
          {renderLogo(getPageData(1).topLogo, pdfStyles.headerLogo)}
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
      </Page>

      {/* Page 2 - Foreword */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        
        {/* Main content area with two columns */}
        <View style={pdfStyles.page2Layout}>
          {/* Left column - Main image (50%) */}
          <View style={pdfStyles.page2LeftColumn}>
            {getPageData(2).background ? (
              <Image 
                style={[pdfStyles.page2MainImage, { height: '90%' }]} 
                src={getPageData(2).background} 
              />
            ) : (
              <Image 
                style={[pdfStyles.page2MainImage, { height: '90%' }]} 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
              />
            )}
          </View>
          
          {/* Right column - Text content (50%) */}
          <View style={pdfStyles.page2RightColumn}>
            <Text style={pdfStyles.page2Title}>Voorwoord</Text>
            
            {getPageData(2).content ? (
              renderContentSections(getPageData(2).content)
            ) : (
              <>
                <Text style={[pdfStyles.page2Paragraph, { fontSize: 10 }]}>
                  Ondernemen is kansen zien, risico's inschatten en soms moeilijke keuzes maken. Bij 
                  FBM Corporate Finance begrijpen we als geen ander wat daar allemaal bij komt kijken. 
                  Wij staan ondernemers bij in belangrijke financiële beslissingen, met een scherpe blik, 
                  een open houding en bovenal: advies met karakter.
                </Text>
                <Text style={[pdfStyles.page2Paragraph, { fontSize: 10 }]}>
                  Met een persoonlijke benadering en diepgaande expertise helpen we middelgrote en 
                  grote bedrijven bij complexe vraagstukken op het gebied van fusies en overnames, 
                  financieringen, herstructureringen en bedrijfswaarderingen. Ons team van ervaren 
                  professionals, zelf vaak ook ondernemer, kijkt altijd met het perspectief van de klant. 
                  Niet vanuit modellen of theorie, maar met gevoel voor de praktijk, creativiteit en lef. 
                  We zijn trots op onze rol als sparringpartner en oplossingsgerichte adviseur voor meer 
                  dan 500 ondernemingen in uiteenlopende sectoren. Of het nu gaat om software, 
                  industrie, vastgoed of automotive: onze focus ligt op het realiseren van waarde en het 
                  benutten van kansen.
                </Text>
                <Text style={[pdfStyles.page2Paragraph, { fontSize: 10 }]}>
                  FBM Corporate Finance is gebouwd op mensen met karakter. Geen 
                  standaardadviseurs, maar betrokken professionals die verder kijken dan de cijfers. 
                  Graag maken we kennis en gaan we samen het gesprek aan, laagdrempelig en altijd 
                  met een goed kop koffie.
                </Text>
                
                <Text style={pdfStyles.page2Greeting}>Hartelijke groet,</Text>
                <Text style={pdfStyles.page2SignatureName}>Pieter Westland</Text>
                <Text style={pdfStyles.page2SignatureTitle}>Namens het team van FBM Corporate Finance</Text>
              </>
            )}
          </View>
        </View>
        
        {/* Portrait image centered over both columns */}
        {getPageData(2).middle_image_url && (
          <Image 
            style={pdfStyles.page2PortraitImage} 
            src={getPageData(2).middle_image_url} 
          />
        )}
        
        {/* White footer bar with logo and page number */}
        <View style={pdfStyles.page2Footer}>
          <View style={pdfStyles.page2FooterLeft}>
            {getPageData(2).footerLogo ? (
              renderLogo(getPageData(2).footerLogo, { width: 80, height: 30, objectFit: 'contain' })
            ) : (
              <> 
                <Text style={pdfStyles.page2FooterLogo}>fbm</Text>
                <Text style={pdfStyles.page2FooterText}>Corporate Finance</Text>
              </>
            )}
          </View>
          <View style={pdfStyles.page2FooterRight}>
            <View style={pdfStyles.page2DottedLine} />
            <Text style={pdfStyles.page2PageNumberText}>2</Text>
          </View>
        </View>
      </Page>

      {/* Page 3 - Calculation Results */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(3).background)}
        
        <View style={pdfStyles.content}>
          {/* Page title with blue background */}
          <View style={{ marginBottom: 30 }}>
            <View style={{
              backgroundColor: '#1e3a8a',
              padding: '12 16',
              borderRadius: 8,
              width: '50%',
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF'
              }}>Indicatieve calculatie</Text>
            </View>
          </View>
          
          {/* Main content grid */}
          <View style={{ flexDirection: 'row', gap: 30 }}>
            {/* Left column - Input data */}
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 20, borderRadius: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>Ingevoerde gegevens</Text>
              
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Omzet in het afgelopen jaar:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{getRevenueDisplay()}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Aandeel jaarlijks terugkerende omzet:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{companyData.recurringRevenuePercentageDisplay || `${companyData.recurringRevenuePercentage}%`}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Resultaat vorig boekjaar:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{formatCurrency(companyData.result2024)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Verwacht resultaat dit boekjaar:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{formatCurrency(companyData.expectedResult2025)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Investeringen:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{formatCurrency(companyData.averageYearlyInvestment)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Sector:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{companyData.sector && sectors.length > 0 ? sectors.find(s => s.id === companyData.sector)?.name || valuationResult.sector : valuationResult.sector}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Aantal (FTE) medewerkers:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{companyData.employeesDisplay || companyData.employees}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1 solid #E5E7EB' }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: 'bold' }}>Omzet via de grootste klant:</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#111827' }}>{companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</Text>
                </View>
              </View>
              
              {/* Business images - larger size to use full column width */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                {getPageData(3).image1_url && (
                  <Image 
                    style={{ width: '48%', height: 80, objectFit: 'cover' }} 
                    src={getPageData(3).image1_url}
                  />
                )}
                {getPageData(3).image2_url && (
                  <Image 
                    style={{ width: '48%', height: 80, objectFit: 'cover' }} 
                    src={getPageData(3).image2_url}
                  />
                )}
              </View>
            </View>
            
            {/* Right column - Key assumptions and results */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>Belangrijkste uitgangspunten</Text>
              
              {/* Key metrics with red color and larger font */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 15, marginBottom: 8, color: '#dc2626', fontWeight: 'bold' }}>
                  • Omzet: {formatCurrency(companyData.lastYearRevenue)}
                </Text>
                <Text style={{ fontSize: 15, marginBottom: 8, color: '#dc2626', fontWeight: 'bold' }}>
                  • EBITDA: {formatCurrency(companyData.result2024)} ({((((companyData.result2024 || 0) / (companyData.lastYearRevenue || 1)) * 100)).toFixed(1)}%)
                </Text>
                <Text style={{ fontSize: 15, marginBottom: 8, color: '#dc2626', fontWeight: 'bold' }}>
                  • Sector multiple: {valuationResult.multiple.toFixed(1)}x
                </Text>
                <Text style={{ fontSize: 15, marginBottom: 8, color: '#dc2626', fontWeight: 'bold' }}>
                  • Verwacht resultaat 2025: {formatCurrency(companyData.expectedResult2025)}
                </Text>
              </View>

              {/* Valuation Range Chart with blue colors */}
              <View style={{ marginTop: 30, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Indicatieve waardebandbreedte</Text>
                
                <View style={{ 
                  width: 350, 
                  height: 60, 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  {/* Min value */}
                  <View style={{ 
                    position: 'absolute', 
                    left: 15, 
                    top: -30 
                  }}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold' }}>
                      €{Math.round((valuationResult.minValuation || 0) / 1000000 * 10) / 10}M
                    </Text>
                  </View>
                  
                  {/* Max value */}
                  <View style={{ 
                    position: 'absolute', 
                    right: 15, 
                    top: -30 
                  }}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#1e3a8a', fontWeight: 'bold' }}>
                      €{Math.round((valuationResult.maxValuation || 0) / 1000000 * 10) / 10}M
                    </Text>
                  </View>
                  
                  {/* Current value indicator */}
                  <View style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: 20, 
                    width: 20, 
                    height: 20, 
                    backgroundColor: '#1e3a8a', 
                    borderRadius: 10,
                    transform: 'translateX(-50%)'
                  }} />
                  
                  {/* Current value text */}
                  <View style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: -30, 
                    transform: 'translateX(-50%)'
                  }}>
                    <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 'bold', color: '#1e3a8a' }}>
                      €{Math.round((valuationResult.baseValuation || 0) / 1000000 * 10) / 10}M
                    </Text>
                  </View>
                  
                  {/* Gradient bar */}
                  <View style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#3b82f6',
                    borderRadius: 30,
                    opacity: 0.8
                  }} />
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {getPageData(3).footerLogo && (
              <Image
                src={getPageData(3).footerLogo}
                style={{ width: 50, height: 25, objectFit: 'contain' }}
              />
            )}
            <Text style={{ fontSize: 10, color: '#666' }}>3</Text>
          </View>
        </View>
      </Page>

      {/* Page 4 - Market Developments */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.content}>
          {/* Page title */}
          <View style={{ marginBottom: 30 }}>
            <View style={{
              backgroundColor: '#1e3a8a',
              padding: '12 16',
              borderRadius: 8,
              width: '50%',
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF'
              }}>{getPageData(3).page_name || 'Marktontwikkelingen'}</Text>
            </View>
          </View>

          {/* Two column layout */}
          <View style={{ flexDirection: 'row', gap: 30 }}>
            <View style={{ width: '60%', paddingRight: 30 }}>
              <Text style={{ fontSize: 12, lineHeight: 1.5, textAlign: 'justify', marginBottom: 20 }}>
                Tekst op maat voor {companyData.sector || 'uw sector'}
              </Text>
              <Text style={{ fontSize: 12, lineHeight: 1.5, textAlign: 'justify' }}>
                {getPageData(3).content?.section1 || 'Content from PDF management section 1'}
              </Text>
            </View>

            <View style={{ width: '40%', alignItems: 'center' }}>
              {getPageData(3).image1_url && (
                <Image
                  src={getPageData(3).image1_url}
                  style={{ width: '100%', height: 250, objectFit: 'cover', marginBottom: 15 }}
                />
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {getPageData(3).footerLogo && (
              <Image
                src={getPageData(3).footerLogo}
                style={{ width: 50, height: 25, objectFit: 'contain' }}
              />
            )}
            <Text style={{ fontSize: 10, color: '#666' }}>4</Text>
          </View>
        </View>
      </Page>

      {/* Page 5 - Business Valuation */}
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.content}>
          {/* Page title */}
          <View style={{ marginBottom: 30 }}>
            <View style={{
              backgroundColor: '#1e3a8a',
              padding: '12 16',
              borderRadius: 8,
              width: '50%',
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF'
              }}>{getPageData(4).page_name || 'Bedrijfswaardering'}</Text>
            </View>
          </View>

          {/* Two column layout */}
          <View style={{ flexDirection: 'row', gap: 30 }}>
            <View style={{ width: '50%', paddingRight: 30 }}>
              <Text style={{ fontSize: 11, lineHeight: 1.5, textAlign: 'justify' }}>
                {getPageData(4).content?.text || 'Content will be loaded from admin panel for page 5'}
              </Text>
            </View>

            <View style={{ width: '50%', alignItems: 'center' }}>
              {getPageData(4).image1_url && (
                <Image
                  src={getPageData(4).image1_url}
                  style={{ width: '100%', height: 300, objectFit: 'cover' }}
                />
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {getPageData(4).footerLogo && (
              <Image
                src={getPageData(4).footerLogo}
                style={{ width: 50, height: 25, objectFit: 'contain' }}
              />
            )}
            <Text style={{ fontSize: 10, color: '#666' }}>5</Text>
          </View>
        </View>
      </Page>

      {/* Page 6 - The Next Step */}
      <Page size="A4" style={pdfStyles.page}>
        {/* Header with logo */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
          {getPageData(5).topLogo && (
            <Image
              src={getPageData(5).topLogo}
              style={{ width: 60, height: 30 }}
            />
          )}
        </View>

        {/* Background Image */}
        {getPageData(5).background && (
          <Image
            src={getPageData(5).background}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              zIndex: -1 
            }}
          />
        )}

        {/* Content overlay */}
        <View style={{ 
          position: 'absolute', 
          top: 150, 
          left: 40, 
          right: 40, 
          zIndex: 1 
        }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: '#FFFFFF', 
            marginBottom: 15
          }}>
            {getPageData(5).page_name || 'The next step'}
          </Text>
          
          <Text style={{ 
            fontSize: 16, 
            color: '#FFFFFF', 
            lineHeight: 1.6,
            maxWidth: '70%'
          }}>
            {getPageData(5).content?.text || 'Content will be loaded from admin panel'}
          </Text>
        </View>

        {/* Bottom contact box - shifted 15% to the right */}
        <View style={{ 
          position: 'absolute', 
          bottom: 60, 
          left: '25%',
          backgroundColor: '#FFFFFF', 
          borderRadius: 12, 
          padding: 20,
          minWidth: 300
        }}>
          <Text style={{ fontSize: 12, lineHeight: 1.5, color: '#333333' }}>
            {getPageData(5).content?.section2 || 'Contact information will be loaded from admin panel'}
          </Text>
          
          {getPageData(5).footerLogo && (
            <View style={{ marginTop: 10, alignItems: 'flex-start' }}>
              <Image
                src={getPageData(5).footerLogo}
                style={{ width: 80, height: 30, objectFit: 'contain' }}
              />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

// Export helper function for generating PDF
export const generatePDF = async (data: ValuationReportPDFProps) => {
  return pdf(<ValuationReportPDF {...data} />);
};

export default ValuationReportPDF;