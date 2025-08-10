import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    objectFit: 'cover',
    zIndex: -1, // Ensure background stays behind content
  },
  content: {
    position: 'relative',
    padding: 0,
    minHeight: '100%',
  },
  // Page 1 - Cover styles
  coverHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportBadge: {
    backgroundColor: '#1E40AF',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '8 16',
    borderRadius: 6,
  },
  dateSmall: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  confidentialText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  logoTopRight: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 120,
    height: 80,
  },
  centerTitle: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    width: 400,
    marginLeft: -200,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20 40',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  dateCenter: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '10 20',
    borderRadius: 4,
    width: '100%',
  },
  // Page 2 - Foreword styles
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 20,
  },
  fbmLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1E40AF',
    padding: '12 24',
    borderRadius: 8,
    marginBottom: 30,
  },
  forewordText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 15,
    textAlign: 'justify',
  },
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 14,
    color: '#6B7280',
  },
  // Page 3 - Calculation styles
  calculationGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  leftColumn: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
  },
  rightColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1 solid #E5E7EB',
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    flex: 1,
  },
  highlightBox: {
    backgroundColor: '#EFF6FF',
    border: '2 solid #3B82F6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  highlightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 5,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 3,
  },
  highlightSubtext: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  disclaimerSmall: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
    marginTop: 15,
    fontStyle: 'italic',
  },
  bandbreedte: {
    marginTop: 30,
  },
  bandbreedteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  bandbreedteRow: {
    flexDirection: 'row',
    gap: 20,
  },
  bandbreedteBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bandbreedteValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  // Page 4 - Sector info styles
  sectorContent: {
    marginTop: 20,
  },
  sectorText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 15,
    textAlign: 'justify',
  },
  placeholderText: {
    fontSize: 12,
    color: '#DC2626',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  // Page 5 - Business valuation styles
  businessContent: {
    marginTop: 20,
  },
  businessText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 15,
    textAlign: 'justify',
  },
  businessSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  // Page 6 - Next steps styles
  nextStepsContent: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    padding: 30,
    marginTop: 40,
    marginBottom: 40,
  },
  nextStepsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  nextStepsSubtitle: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 30,
  },
  contactInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
  },
  contactText: {
    fontSize: 12,
    color: '#1E40AF',
    marginBottom: 3,
  },
  websiteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginTop: 10,
  },
  // Image positioning
  topLogo: {
    position: 'absolute',
    top: 20,
    width: 100,
    height: 40,
  },
  footerLogo: {
    position: 'absolute',
    bottom: 60,
    width: 80,
    height: 30,
  },
});

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
      return <Image src={imageUrl} style={styles.backgroundImage} />;
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
      sectionText = sectionText.replace(/PLACEHOLDER tekst 2 next steps/g, '');
      sectionText = sectionText.replace(/{{company_name}}/g, contactData.companyName || '');
      
      switch (section.type) {
        case 'heading':
          return <Text key={index} style={styles.sectionTitle}>{sectionText}</Text>;
        case 'paragraph':
          return <Text key={index} style={styles.forewordText}>{sectionText}</Text>;
        default:
          return <Text key={index} style={styles.forewordText}>{sectionText}</Text>;
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
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(1).background)}
        
        {renderLogo(getPageData(1).topLogo, styles.logoTopRight)}
        
        <View style={styles.coverHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.reportBadge}>Rapport waardebepaling</Text>
            <Text style={styles.dateSmall}>{currentDate}</Text>
          </View>
          <Text style={styles.confidentialText}>STRICTLY CONFIDENTIAL</Text>
        </View>
        
        <View style={styles.centerTitle}>
          <Text style={styles.companyName}>{contactData.companyName}</Text>
          <Text style={styles.dateCenter}>[{currentDate}]</Text>
        </View>
        
        {renderLogo(getPageData(1).footerLogo, [
          styles.footerLogo,
          { 
            left: getPageData(1).footerLogoPosition === 'center' ? '45%' : 
                  getPageData(1).footerLogoPosition === 'right' ? 'auto' : 20,
            right: getPageData(1).footerLogoPosition === 'right' ? 20 : 'auto'
          }
        ])}
      </Page>

      {/* Page 2 - Foreword */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(2).background)}
        
         {renderLogo(getPageData(2).topLogo, [
           styles.topLogo,
           { 
             left: getPageData(2).topLogoPosition === 'center' ? '45%' : 
                   getPageData(2).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(2).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.fbmLogo}>fbm</Text>
          </View>
          
          {getPageData(2).content ? (
            renderContentSections(getPageData(2).content)
          ) : (
            <>
              <Text style={styles.sectionTitle}>Voorwoord</Text>
              <Text style={styles.placeholderText}>PLACEHOLDER tekst 1 foreword</Text>
            </>
          )}
        </View>
        
         {renderLogo(getPageData(2).footerLogo, [
           styles.footerLogo,
           { 
             left: getPageData(2).footerLogoPosition === 'center' ? '45%' : 
                   getPageData(2).footerLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(2).footerLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Page 3 - Calculation */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(3).background)}
        
         {renderLogo(getPageData(3).topLogo, [
           styles.topLogo,
           { 
             left: getPageData(3).topLogoPosition === 'center' ? '45%' : 
                   getPageData(3).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(3).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { backgroundColor: '#1E40AF', color: 'white', padding: '10 20', borderRadius: 6 }]}>
            3. Indicatieve calculatie
          </Text>
          
          <View style={styles.calculationGrid}>
            <View style={styles.leftColumn}>
              <Text style={styles.columnTitle}>Ingevoerde gegevens</Text>
              
              <View style={styles.dataRow}>
                <Text style={styles.label}>Omzet in het afgelopen jaar</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.lastYearRevenue)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Aantal partijen terugkerende omzet</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.recurringRevenuePercentageDisplay || `${companyData.recurringRevenuePercentage}%`}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Resultaat vorig boekjaar</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.result2024)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Verwacht resultaat dit boekjaar</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.expectedResult2025)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Verlies in de afgelopen 3 jaar</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.wasLossmaking ? 'Ja' : 'Nee'}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Vooruitzichten</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.prospects}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Gemiddelde investering per jaar</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{formatCurrency(companyData.averageYearlyInvestment)}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Sector</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{valuationResult.sector}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Aantal FTE medewerkers</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.employeesDisplay || companyData.employees}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Omzet via de grootste klant</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Afhankelijkheid van grootste toeleverancier</Text>
                <Text style={[styles.value, { color: '#DC2626' }]}>{companyData.largestSupplierRisk}</Text>
              </View>
            </View>
            
            <View style={styles.rightColumn}>
              <Text style={styles.columnTitle}>Belangrijkste uitgangspunten</Text>
              
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>{formatCurrency(estimatedEbitda)}</Text>
                <Text style={styles.highlightLabel}>EBITDA (Adjusted)</Text>
                <Text style={styles.highlightSubtext}>{currentDate}</Text>
                <Text style={styles.highlightSubtext}>Waarderingsmoment</Text>
              </View>
              
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>{formatCurrency(valuationResult.baseValuation)}</Text>
                <Text style={styles.highlightLabel}>Ondernemingswaarde</Text>
                <Text style={[styles.highlightLabel, { fontWeight: 'bold' }]}>{valuationResult.multiple.toFixed(1)} x EBITDA</Text>
                <Text style={styles.highlightSubtext}>Multiple op EBITDA</Text>
              </View>
              
              <Text style={styles.disclaimerSmall}>
                Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde uitgangspunten.
                Neem contact met ons op de exacte waarde van jouw bedrijf te bepalen.
              </Text>
            </View>
          </View>
          
          <View style={styles.bandbreedte}>
            <Text style={styles.bandbreedteTitle}>Indicatieve bandbreedte</Text>
            <View style={styles.bandbreedteRow}>
              <View style={styles.bandbreedteBox}>
                <Text style={styles.bandbreedteValue}>{formatCurrency(valuationResult.minValuation)}</Text>
              </View>
              <View style={styles.bandbreedteBox}>
                <Text style={styles.bandbreedteValue}>{formatCurrency(valuationResult.baseValuation)}</Text>
              </View>
              <View style={styles.bandbreedteBox}>
                <Text style={styles.bandbreedteValue}>{formatCurrency(valuationResult.maxValuation)}</Text>
              </View>
            </View>
          </View>
        </View>
        
         {renderLogo(getPageData(3).footerLogo, [
           styles.footerLogo,
           { 
             left: getPageData(3).footerLogoPosition === 'center' ? '45%' : 
                   getPageData(3).footerLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(3).footerLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <Text style={styles.pageNumber}>3</Text>
      </Page>

      {/* Page 4 - Sector Info */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(4).background)}
        
         {renderLogo(getPageData(4).topLogo, [
           styles.topLogo,
           { 
             left: getPageData(4).topLogoPosition === 'center' ? '45%' : 
                   getPageData(4).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(4).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { backgroundColor: '#1E40AF', color: 'white', padding: '10 20', borderRadius: 6 }]}>
            4. Overnames in de sector..
          </Text>
          
          <View style={styles.sectorContent}>
            {getPageData(4).content ? (
              renderContentSections(getPageData(4).content)
            ) : (
              <>
                <Text style={styles.placeholderText}>PLACEHOLDER tekst 1 sector information</Text>
                <Text style={styles.placeholderText}>PLACEHOLDER tekst 2 sector information</Text>
                {getSectorText() && (
                  <Text style={styles.sectorText}>{getSectorText()}</Text>
                )}
              </>
            )}
          </View>
        </View>
        
         {renderLogo(getPageData(4).footerLogo, [
           styles.footerLogo,
           { 
             left: getPageData(4).footerLogoPosition === 'center' ? '45%' : 
                   getPageData(4).footerLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(4).footerLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <Text style={styles.pageNumber}>4</Text>
      </Page>

      {/* Page 5 - Business Valuation */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(5).background)}
        
         {renderLogo(getPageData(5).topLogo, [
           styles.topLogo,
           { 
             left: getPageData(5).topLogoPosition === 'center' ? '45%' : 
                   getPageData(5).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(5).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.fbmLogo}>fbm</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { backgroundColor: '#1E40AF', color: 'white', padding: '10 20', borderRadius: 6 }]}>
            5. Bedrijfswaardering
          </Text>
          
          <View style={styles.businessContent}>
            {getPageData(5).content ? (
              renderContentSections(getPageData(5).content)
            ) : (
              <Text style={styles.placeholderText}>PLACEHOLDER tekst 1 business valuation</Text>
            )}
          </View>
        </View>
        
         {renderLogo(getPageData(5).footerLogo, [
           styles.footerLogo,
           { 
             left: getPageData(5).footerLogoPosition === 'center' ? '45%' : 
                   getPageData(5).footerLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(5).footerLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <Text style={styles.pageNumber}>5</Text>
      </Page>

      {/* Page 6 - Next Steps */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {renderBackgroundImage(getPageData(6).background)}
        
         {renderLogo(getPageData(6).topLogo, [
           styles.topLogo,
           { 
             left: getPageData(6).topLogoPosition === 'center' ? '45%' : 
                   getPageData(6).topLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(6).topLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <View style={styles.content}>
          <View style={styles.pageHeader}>
            <Text style={styles.fbmLogo}>fbm</Text>
          </View>
          
          <View style={styles.nextStepsContent}>
            <Text style={styles.nextStepsTitle}>The next step</Text>
            <Text style={styles.nextStepsSubtitle}>A real impact begins with a single step</Text>
            
            <View style={styles.contactInfo}>
              {getPageData(6).content ? (
                renderContentSections(getPageData(6).content)
              ) : (
                <>
                  <Text style={styles.placeholderText}>PLACEHOLDER tekst 2 next steps</Text>
                  <Text style={styles.websiteText}>➤ www.fbm.nl</Text>
                </>
              )}
            </View>
          </View>
        </View>
        
         {renderLogo(getPageData(6).footerLogo, [
           styles.footerLogo,
           { 
             left: getPageData(6).footerLogoPosition === 'center' ? '45%' : 
                   getPageData(6).footerLogoPosition === 'right' ? 'auto' : 20,
             right: getPageData(6).footerLogoPosition === 'right' ? 20 : 'auto'
           }
         ])}
        
        <Text style={styles.pageNumber}>6</Text>
      </Page>
    </Document>
  );
};

export const generatePDF = async (
  companyData: CompanyData,
  contactData: ContactData,
  valuationResult: ValuationResult,
  pages: any[] = [],
  sectors: SectorConfig[] = []
) => {
  const { pdf } = await import('@react-pdf/renderer');
  
  const blob = await pdf(
    <ValuationReportPDF 
      companyData={companyData}
      contactData={contactData}
      valuationResult={valuationResult}
      pages={pages}
      sectors={sectors}
    />
  ).toBlob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bedrijfswaardering-${contactData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default ValuationReportPDF;