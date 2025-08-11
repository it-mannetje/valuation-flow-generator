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
            <Text style={pdfStyles.headerDate}>{currentDate}</Text>
          </View>
          {/* Logo in header */}
          {renderLogo(getPageData(1).topLogo, pdfStyles.headerLogo)}
        </View>
        
        {/* Main content area with image and company info */}
        <View style={pdfStyles.coverMainContent}>
          {/* Left section - Main image (60% width) */}
          <View style={pdfStyles.coverImageSection}>
            {getPageData(1).background && (
              <Image 
                style={pdfStyles.coverMainImage} 
                src={getPageData(1).background} 
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
        {/* Top logo */}
        {renderLogo(getPageData(2).topLogo, [
          pdfStyles.topLogo,
          { 
            left: getPageData(2).topLogoPosition === 'center' ? '45%' : 
                  getPageData(2).topLogoPosition === 'right' ? 'auto' : 20,
            right: getPageData(2).topLogoPosition === 'right' ? 20 : 'auto'
          }
        ])}
        
        {/* Header */}
        <View style={[pdfStyles.pageHeader, { margin: 20, marginBottom: 0 }]}>
          <Text style={pdfStyles.fbmLogo}>fbm</Text>
        </View>
        
        {/* Main content area with two columns */}
        <View style={pdfStyles.page2Layout}>
          {/* Left column - Main image (60%) */}
          <View style={pdfStyles.page2LeftColumn}>
            {getPageData(2).background && (
              <Image 
                style={pdfStyles.page2MainImage} 
                src={getPageData(2).background} 
              />
            )}
          </View>
          
          {/* Right column - Text content and portrait (40%) */}
          <View style={pdfStyles.page2RightColumn}>
            <View style={pdfStyles.page2TextContent}>
              {getPageData(2).content ? (
                renderContentSections(getPageData(2).content)
              ) : (
                <>
                  <Text style={pdfStyles.sectionTitle}>Voorwoord</Text>
                  <Text style={pdfStyles.placeholderText}>PLACEHOLDER tekst 1 foreword</Text>
                </>
              )}
            </View>
            
            {/* Portrait image at bottom right */}
            {getPageData(2).middle_image_url && (
              <Image 
                style={pdfStyles.page2PortraitImage} 
                src={getPageData(2).middle_image_url} 
              />
            )}
          </View>
        </View>
        
        {/* White footer */}
        <View style={pdfStyles.page2Footer}>
          {/* Footer logo on left */}
          {renderLogo(getPageData(2).footerLogo, pdfStyles.page2FooterLogo)}
          
          {/* Page number box on right */}
          <View style={pdfStyles.page2PageNumberBox}>
            <Text style={pdfStyles.page2PageNumberText}>2</Text>
          </View>
        </View>
      </Page>

      {/* Page 3 - Calculation Results */}
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        {renderBackgroundImage(getPageData(3).background)}
        
         {renderLogo(getPageData(3).topLogo, [
           pdfStyles.topLogo,
           { 
             left: getPageData(3).topLogoPosition === 'center' ? '45%' : 
                   getPageData(3).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(3).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={pdfStyles.content}>
          <View style={pdfStyles.pageHeader}>
            <Text style={pdfStyles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={[pdfStyles.sectionTitle, { backgroundColor: '#1E40AF', color: 'white', padding: '10 20', borderRadius: 6 }]}>
            Ingevoerde gegevens en uitkomst berekening
          </Text>
          
          <View style={pdfStyles.calculationGrid}>
            <View style={pdfStyles.leftColumn}>
              <Text style={pdfStyles.columnTitle}>Ingevoerde gegevens</Text>
              
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Omzet in het afgelopen jaar</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.lastYearRevenue)}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Aantal partijen terugkerende omzet</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{companyData.recurringRevenuePercentageDisplay || `${companyData.recurringRevenuePercentage}%`}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Resultaat vorig boekjaar</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.result2024)}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Verwacht resultaat dit boekjaar</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.expectedResult2025)}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Verlies in de afgelopen 3 jaar</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{companyData.wasLossmaking ? 'Ja' : 'Nee'}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Vooruitzichten</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{companyData.prospects}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Gemiddelde investering per jaar</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.averageYearlyInvestment)}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Sector</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{valuationResult.sector}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Aantal FTE medewerkers</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{companyData.employeesDisplay || companyData.employees}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Omzet via de grootste klant</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>{companyData.largestCustomerPercentageDisplay || companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</Text>
              </View>
              <View style={pdfStyles.dataRow}>
                <Text style={pdfStyles.label}>Schattingmethode</Text>
                <Text style={[pdfStyles.value, { color: '#DC2626' }]}>EBITDA multiplier</Text>
              </View>
            </View>
            
            <View style={pdfStyles.rightColumn}>
              <Text style={pdfStyles.columnTitle}>Uitkomst berekening</Text>
              
              <View style={pdfStyles.highlightBox}>
                <Text style={pdfStyles.highlightValue}>{formatCurrency(valuationResult.baseValuation)}</Text>
                <Text style={pdfStyles.highlightLabel}>Geschatte waarde</Text>
                <Text style={pdfStyles.highlightSubtext}>Gebaseerd op EBITDA multiplier</Text>
              </View>
              
              <View style={pdfStyles.highlightBox}>
                <Text style={pdfStyles.highlightValue}>{formatCurrency(estimatedEbitda)}</Text>
                <Text style={pdfStyles.highlightLabel}>Geschatte EBITDA</Text>
                <Text style={pdfStyles.highlightSubtext}>Gemiddelde van resultaten 2024 en verwacht 2025</Text>
              </View>
              
              <View style={pdfStyles.highlightBox}>
                <Text style={pdfStyles.highlightValue}>{valuationResult.multiple.toFixed(1)}x</Text>
                <Text style={pdfStyles.highlightLabel}>Gehanteerde multiplier</Text>
                <Text style={pdfStyles.highlightSubtext}>Gebaseerd op sector en bedrijfsprofiel</Text>
              </View>
              
              <Text style={pdfStyles.disclaimerSmall}>
                Deze berekening is gebaseerd op de door u ingevoerde gegevens en algemene marktgegevens. 
                De werkelijke waarde kan afwijken door specifieke bedrijfs- en marktomstandigheden.
              </Text>
              
              <View style={pdfStyles.bandbreedte}>
                <Text style={pdfStyles.bandbreedteTitle}>Bandbreedte</Text>
                <View style={pdfStyles.bandbreedteRow}>
                  <View style={pdfStyles.bandbreedteBox}>
                    <Text style={pdfStyles.bandbreedteValue}>{formatCurrency(valuationResult.minValuation)}</Text>
                    <Text style={pdfStyles.label}>Minimum</Text>
                  </View>
                  <View style={pdfStyles.bandbreedteBox}>
                    <Text style={pdfStyles.bandbreedteValue}>{formatCurrency(valuationResult.maxValuation)}</Text>
                    <Text style={pdfStyles.label}>Maximum</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
           {renderLogo(getPageData(3).footerLogo, [
             pdfStyles.footerLogo,
             { 
               left: getPageData(3).footerLogoPosition === 'center' ? '45%' : 
                     getPageData(3).footerLogoPosition === 'right' ? 'auto' : 20,
               right: getPageData(3).footerLogoPosition === 'right' ? 20 : 'auto'
             }
           ])}
          
          <Text style={pdfStyles.pageNumber}>3</Text>
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