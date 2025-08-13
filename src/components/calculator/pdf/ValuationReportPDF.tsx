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
    console.log(`Getting page data for page ${pageNumber}:`, page);
    const pageData = {
      background: page?.background_image_url || null,
      topLogo: page?.top_logo_url || null,
      topLogoPosition: page?.top_logo_position || 'left',
      footerLogo: page?.footer_logo_url || null,
      footerLogoPosition: page?.footer_logo_position || 'left',
      middle_image_url: page?.middle_image_url || null,
      logo_image_url: page?.logo_image_url || null,
      image1_url: page?.image1_url || null,
      image2_url: page?.image2_url || null,
      content: page?.content?.content || null
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

  return (
    <Document>
      {/* Page 1 - Cover */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {/* Blue header section */}
        <View style={pdfStyles.coverHeaderSection}>
          <View style={pdfStyles.headerLeftContent}>
            <Text style={pdfStyles.headerTitle}>Rapport waardebepaling</Text>
            <Text style={pdfStyles.headerConfidential}>STRICTLY CONFIDENTIAL</Text>
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
          
          {/* Right column - Text content (50%) */}
          <View style={pdfStyles.page2RightColumn}>
            <Text style={pdfStyles.page2Title}>Voorwoord</Text>
            
            {getPageData(2).content ? (
              renderContentSections(getPageData(2).content)
            ) : (
              <>
                <Text style={pdfStyles.page2Paragraph}>
                  Ondernemen is kansen zien, risico's inschatten en soms moeilijke keuzes maken. Bij 
                  FBM Corporate Finance begrijpen we als geen ander wat daar allemaal bij komt kijken. 
                  Wij staan ondernemers bij in belangrijke financiële beslissingen, met een scherpe blik, 
                  een open houding en bovenal: advies met karakter.
                </Text>
                <Text style={pdfStyles.page2Paragraph}>
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
                <Text style={pdfStyles.page2Paragraph}>
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
        <Image 
          style={pdfStyles.page2PortraitImage} 
          src={getPageData(2).middle_image_url || getPageData(2).logo_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=180"} 
        />
        
        {/* White footer bar with logo and page number */}
        <View style={pdfStyles.page2Footer}>
          <View style={pdfStyles.page2FooterLeft}>
            {renderLogo(getPageData(2).footerLogo, [pdfStyles.headerLogo, { width: 80, height: 30 }]) || (
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
                  <Text style={pdfStyles.page3Value}>{companyData.lastYearRevenueDisplay || formatCurrency(companyData.lastYearRevenue)}</Text>
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
                  <Text style={pdfStyles.page3Value}>{formatCurrency(companyData.averageYearlyInvestment)}</Text>
                </View>
                <View style={pdfStyles.page3DataRow}>
                  <Text style={pdfStyles.page3Label}>Sector</Text>
                  <Text style={pdfStyles.page3Value}>{valuationResult.sector}</Text>
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
                <Image 
                  style={pdfStyles.page3Image} 
                  src={getPageData(3).image1_url || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=400&h=250"}
                />
                <Image 
                  style={pdfStyles.page3Image} 
                  src={getPageData(3).image2_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=250"}
                />
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
                    <Text style={pdfStyles.page3MetricValue}>{formatCurrency(estimatedEbitda)}</Text>
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
                    <Text style={pdfStyles.page3MetricValue}>{formatCurrency(valuationResult.baseValuation)}</Text>
                    <Text style={pdfStyles.page3MetricLabel}>Ondernemingswaarde</Text>
                  </View>
                  <View style={pdfStyles.page3MetricBox}>
                    <View style={pdfStyles.page3MultiplierContainer}>
                      <Text style={pdfStyles.page3MultiplierValue}>{valuationResult.multiple.toFixed(1)}</Text>
                      <Text style={pdfStyles.page3MultiplierText}> x EBITDA</Text>
                    </View>
                    <Text style={pdfStyles.page3MetricLabel}>Multiple op EBITDA</Text>
                  </View>
                </View>
              </View>
              
              {/* Disclaimer text */}
              <Text style={pdfStyles.page3Disclaimer}>
                Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde uitgangspunten.{'\n'}
                Neem contact met ons op om de exacte waarde van jouw bedrijf te bepalen.
              </Text>
              
              {/* Bandwidth chart */}
              <View style={pdfStyles.page3ChartContainer}>
                <Text style={pdfStyles.page3ChartTitle}>Indicatieve bandbreedte</Text>
                
                <View style={pdfStyles.page3Chart}>
                  {/* Chart bars */}
                  <View style={pdfStyles.page3ChartBars}>
                    <View style={pdfStyles.page3ChartBar1}>
                      <View style={pdfStyles.page3Bar1} />
                      <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.minValuation / 1000).toLocaleString()}</Text>
                    </View>
                    <View style={pdfStyles.page3ChartBar2}>
                      <View style={pdfStyles.page3Bar2} />
                      <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.baseValuation / 1000).toLocaleString()}</Text>
                    </View>
                    <View style={pdfStyles.page3ChartBar3}>
                      <View style={pdfStyles.page3Bar3} />
                      <Text style={pdfStyles.page3BarValue}>€ {Math.round(valuationResult.maxValuation / 1000).toLocaleString()}</Text>
                    </View>
                  </View>
                  
                  {/* Chart baseline */}
                  <View style={pdfStyles.page3ChartBaseline} />
                </View>
              </View>
            </View>
          </View>
          
          {/* Footer */}
          <View style={pdfStyles.page3Footer}>
            <View style={pdfStyles.page3FooterLeft}>
              <Text style={pdfStyles.page3FooterLogo}>fbm</Text>
              <Text style={pdfStyles.page3FooterText}>Corporate Finance</Text>
            </View>
            <View style={pdfStyles.page3FooterRight}>
              <View style={pdfStyles.page3FooterDots} />
              <Text style={pdfStyles.page3FooterPageNumber}>3</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Page 4 - Sector Information */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(4).background)}
        
         {renderLogo(getPageData(4).topLogo, [
           pdfStyles.topLogo,
           { 
             left: getPageData(4).topLogoPosition === 'center' ? '45%' : 
                   getPageData(4).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(4).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={pdfStyles.content}>
          <View style={pdfStyles.pageHeader}>
            <Text style={pdfStyles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={pdfStyles.sectionTitle}>Sector informatie</Text>
          
          <View style={pdfStyles.sectorContent}>
            {getPageData(4).content ? (
              renderContentSections(getPageData(4).content)
            ) : (
              <>
                {getSectorText() ? (
                  <Text style={pdfStyles.sectorText}>{getSectorText()}</Text>
                ) : (
                  <Text style={pdfStyles.placeholderText}>PLACEHOLDER tekst 1 sector information</Text>
                )}
                <Text style={pdfStyles.placeholderText}>PLACEHOLDER tekst 2 sector information</Text>
              </>
            )}
          </View>
          
           {renderLogo(getPageData(4).footerLogo, [
             pdfStyles.footerLogo,
             { 
               left: getPageData(4).footerLogoPosition === 'center' ? '45%' : 
                     getPageData(4).footerLogoPosition === 'right' ? 'auto' : 20,
               right: getPageData(4).footerLogoPosition === 'right' ? 20 : 'auto'
             }
           ])}
          
          <Text style={pdfStyles.pageNumber}>4</Text>
        </View>
      </Page>

      {/* Page 5 - Business Valuation */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(5).background)}
        
         {renderLogo(getPageData(5).topLogo, [
           pdfStyles.topLogo,
           { 
             left: getPageData(5).topLogoPosition === 'center' ? '45%' : 
                   getPageData(5).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(5).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={pdfStyles.content}>
          <View style={pdfStyles.pageHeader}>
            <Text style={pdfStyles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={pdfStyles.sectionTitle}>Waardebepalingen binnen bedrijfsovernames</Text>
          
          <View style={pdfStyles.businessContent}>
            {getPageData(5).content ? (
              renderContentSections(getPageData(5).content)
            ) : (
              <>
                <Text style={pdfStyles.businessSubtitle}>Wat betekent een waardebepaling voor uw bedrijf?</Text>
                <Text style={pdfStyles.businessText}>
                  Een waardebepaling geeft inzicht in de potentiële marktwaarde van uw bedrijf. Dit is essentieel voor:
                </Text>
                
                <Text style={pdfStyles.businessText}>
                  • Strategische beslissingen over verkoop of overname{'\n'}
                  • Financieringsaanvragen{'\n'}
                  • Successieplanning{'\n'}
                  • Investeringsbeslissingen
                </Text>
                
                <Text style={pdfStyles.businessSubtitle}>Factoren die de waarde beïnvloeden</Text>
                <Text style={pdfStyles.businessText}>
                  De waarde van uw bedrijf wordt bepaald door diverse factoren zoals financiële prestaties, 
                  marktpositie, groeimogelijkheden, afhankelijkheden en de algemene marktomstandigheden in uw sector.
                </Text>
                
                <Text style={pdfStyles.placeholderText}>PLACEHOLDER tekst 1 business valuation</Text>
              </>
            )}
          </View>
          
           {renderLogo(getPageData(5).footerLogo, [
             pdfStyles.footerLogo,
             { 
               left: getPageData(5).footerLogoPosition === 'center' ? '45%' : 
                     getPageData(5).footerLogoPosition === 'right' ? 'auto' : 20,
               right: getPageData(5).footerLogoPosition === 'right' ? 20 : 'auto'
             }
           ])}
          
          <Text style={pdfStyles.pageNumber}>5</Text>
        </View>
      </Page>

      {/* Page 6 - Next Steps */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(6).background)}
        
         {renderLogo(getPageData(6).topLogo, [
           pdfStyles.topLogo,
           { 
             left: getPageData(6).topLogoPosition === 'center' ? '45%' : 
                   getPageData(6).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(6).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={pdfStyles.content}>
          <View style={pdfStyles.pageHeader}>
            <Text style={pdfStyles.fbmLogo}>fbm</Text>
          </View>
          
          <View style={pdfStyles.nextStepsContent}>
            <Text style={pdfStyles.nextStepsTitle}>Volgende stappen</Text>
            <Text style={pdfStyles.nextStepsSubtitle}>Wilt u meer weten?</Text>
            
            <Text style={pdfStyles.businessText}>
              Deze waardebepaling biedt een eerste indicatie van de waarde van uw bedrijf. Voor een meer 
              uitgebreide analyse en begeleiding bij een eventuele verkoop of overname, kunt u contact met ons opnemen.
            </Text>
            
            <Text style={pdfStyles.businessText}>
              Onze ervaren adviseurs helpen u graag bij het realiseren van uw doelstellingen.
            </Text>
            
            <View style={pdfStyles.contactInfo}>
              <Text style={pdfStyles.contactText}>FBM Corporate Finance</Text>
              <Text style={pdfStyles.contactText}>Telefoon: +31 (0)20 123 4567</Text>
              <Text style={pdfStyles.contactText}>E-mail: info@fbmcorporatefinance.nl</Text>
              <Text style={pdfStyles.websiteText}>www.fbmcorporatefinance.nl</Text>
            </View>
            
            <Text style={pdfStyles.placeholderText}>PLACEHOLDER tekst 2 next pdfStyles</Text>
          </View>
          
           {renderLogo(getPageData(6).footerLogo, [
             pdfStyles.footerLogo,
             { 
               left: getPageData(6).footerLogoPosition === 'center' ? '45%' : 
                     getPageData(6).footerLogoPosition === 'right' ? 'auto' : 20,
               right: getPageData(6).footerLogoPosition === 'right' ? 20 : 'auto'
             }
           ])}
          
          <Text style={pdfStyles.pageNumber}>6</Text>
        </View>
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
  sectors?: SectorConfig[]
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