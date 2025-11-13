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
        
      </Page>

      {/* Page 3 - Calculation Results - Complete Redesign */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        {/* Background Image - Full Page */}
        {getPageData(3).background && (
          <Image 
            src={getPageData(3).background} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        
        {/* Two Column Layout */}
        <View style={{
          position: 'absolute',
          top: 70,
          left: 50,
          right: 50,
          bottom: 50,
          flexDirection: 'row',
          gap: 30,
        }}>
          
          {/* LEFT COLUMN - Main Content */}
          <View style={{ width: '70%', paddingRight: 20 }}>
            
            {/* Header Title */}
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 15,
            }}>
              Indicatieve calculatie
            </Text>

            {/* Intro Text */}
            <Text style={{
              fontSize: 9,
              textAlign: 'center',
              color: '#1f2937',
              marginBottom: 12,
              lineHeight: 1.4,
            }}>
              Op basis van de door jou ingevoerde gegevens scoort{'\n'}
              de multiple van je bedrijf <Text style={{ color: '#10b981', fontWeight: 'bold' }}>hoger</Text> dan het gemiddelde{'\n'}
              in jouw sector.
            </Text>

            {/* Large Multiple Display */}
            <View style={{
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <View style={{
                paddingVertical: 15,
                paddingHorizontal: 50,
                backgroundColor: '#f0fdf4',
                borderRadius: 8,
              }}>
                <Text style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  color: '#10b981',
                  letterSpacing: -2,
                }}>
                  {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                </Text>
              </View>
            </View>

            {/* Subtitle */}
            <Text style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#1f2937',
              marginBottom: 12,
            }}>
              Dat is de uitkomst van de FBM waardebepalingstool.
            </Text>

            {/* Dotted Separator */}
            <View style={{
              borderBottom: '1px dotted #9ca3af',
              marginBottom: 12,
            }} />

            {/* Section Title */}
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Uitkomst indicatieve waarde
            </Text>

            {/* Data Grid - 2x2 */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 12,
            }}>
              {/* Left Column */}
              <View style={{ width: '50%' }}>
                {/* EBITDA (ADJUSTED) */}
                <View style={{
                  padding: 8,
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 7, color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
                    Ebitda (Adjusted)
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
                  </Text>
                </View>

                {/* ONDERNEMINGSWAARDE */}
                <View style={{
                  padding: 8,
                }}>
                  <Text style={{ fontSize: 7, color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
                    Ondernemingswaarde
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')},-
                  </Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={{ width: '50%' }}>
                {/* WAARDERINGSMOMENT */}
                <View style={{
                  padding: 8,
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 7, color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
                    Waarderingsmoment
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#000000' }}>
                    {currentDate}
                  </Text>
                </View>

                {/* MULTIPLE OP EBITDA */}
                <View style={{
                  padding: 8,
                }}>
                  <Text style={{ fontSize: 7, color: '#6b7280', marginBottom: 2, textTransform: 'uppercase' }}>
                    Multiple op Ebitda
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0891b2' }}>
                    {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                  </Text>
                </View>
              </View>
            </View>

            {/* Dotted Separator */}
            <View style={{
              borderBottom: '1px dotted #9ca3af',
              marginBottom: 12,
            }} />

            {/* Bottom Text */}
            <Text style={{
              fontSize: 9,
              textAlign: 'center',
              color: '#1f2937',
              marginBottom: 10,
              lineHeight: 1.3,
            }}>
              Dit brengt jouw indicatieve bedrijfswaarde{'\n'}
              op een bedrag tussen:
            </Text>

            {/* Bar Chart - Matching Design */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: 70,
              marginBottom: 8,
              gap: 2,
            }}>
              {/* Generate 13 bars with gradient pattern */}
              {Array.from({ length: 13 }, (_, i) => {
                const centerIndex = 6;
                const distanceFromCenter = Math.abs(centerIndex - i);
                const isCenter = i === centerIndex;
                
                // Calculate height - center is tallest, gradually decrease towards edges
                const maxHeight = 70;
                const minHeight = 30;
                const heightRange = maxHeight - minHeight;
                const heightStep = heightRange / centerIndex;
                const barHeight = maxHeight - (distanceFromCenter * heightStep * 0.8);
                
                // Color gradient from blue to green in center
                const isNearCenter = distanceFromCenter <= 2;
                let backgroundColor = '#0891b2'; // Blue
                if (isCenter) backgroundColor = '#10b981'; // Green
                else if (i === centerIndex - 1 || i === centerIndex + 1) backgroundColor = '#0d9488'; // Teal
                
                return (
                  <View key={i} style={{
                    width: 14,
                    height: barHeight,
                    backgroundColor,
                    borderRadius: 1,
                  }} />
                );
              })}
            </View>

            {/* Multiple Range Labels */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 5,
            }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0891b2' }}>
                {(valuationResult.multiple - 0.5).toFixed(1)}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#10b981' }}>
                {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0891b2' }}>
                {(valuationResult.multiple + 0.5).toFixed(1)}
              </Text>
            </View>

            {/* Value Range */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              paddingHorizontal: 5,
            }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                € {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')},-
              </Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <View style={{ width: 35, borderBottom: '1.5px solid #9ca3af' }} />
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>⟷</Text>
                <View style={{ width: 35, borderBottom: '1.5px solid #9ca3af' }} />
              </View>

              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                € {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')},-
              </Text>
            </View>

            {/* Disclaimer */}
            <Text style={{
              fontSize: 7,
              textAlign: 'center',
              color: '#6b7280',
              lineHeight: 1.3,
              paddingHorizontal: 10,
            }}>
              Disclaimer: Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde{'\n'}
              uitgangspunten. Neem <Text style={{ color: '#0891b2', fontWeight: 'bold' }}>contact</Text> met ons op om de exacte waarde van jouw <Text style={{ color: '#0891b2', fontWeight: 'bold' }}>bedrijf</Text> te bepalen.
            </Text>

          </View>

          {/* RIGHT COLUMN - Ingevulde gegevens */}
          <View style={{ width: '30%', backgroundColor: '#f5f5f0', padding: 20, borderRadius: 8 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#0891b2',
              marginBottom: 20,
            }}>
              Ingevulde gegevens
            </Text>

            {/* OMZET */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase' }}>
                Omzet
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>
                € {Math.round(companyData.lastYearRevenue).toLocaleString('nl-NL')},-
              </Text>
            </View>

            {/* EBITDA */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase' }}>
                Ebitda
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>
                € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
              </Text>
            </View>

            {/* FTE */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase' }}>
                Fte
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>
                {companyData.employeesDisplay || companyData.employees}
              </Text>
            </View>

            {/* SECTOR */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase' }}>
                Sector
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>
                {sectors.find(s => s.id === companyData.sector)?.name || companyData.sector}
              </Text>
            </View>

            {/* MANAGEMENTSPARTICIPATIE */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase' }}>
                Managementsparticipatie
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>
                {companyData.managementParticipation ? 'Ja' : 'Nee'}
              </Text>
            </View>

            {/* Image Section */}
            {getPageData(3).image1_url && (
              <View style={{ 
                marginTop: 'auto',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <Image 
                  src={getPageData(3).image1_url} 
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                  }}
                />
              </View>
            )}
          </View>
        </View>
        
      </Page>

      {/* Page 4 - Market Developments - Data OVER Background Image */}
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        
        {/* Background Image - Full Page */}
        {getPageData(4).background && (
          <Image 
            src={getPageData(4).background} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        
        {/* Content Overlay - Sector Information */}
        {companyData.sector && sectors.length > 0 && (() => {
          const sectorConfig = sectors.find(s => s.id === companyData.sector);
          return (
            <View style={{
              position: 'absolute',
              top: 120,
              left: 80,
              right: 80,
            }}>
              {/* White content box matching design */}
              <View style={{
                backgroundColor: '#FFFFFF',
                padding: 30,
                borderRadius: 8,
              }}>
                {/* Header Text - First textblock (blue, large, bold) */}
                {sectorConfig?.headerText && (
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#3B82F6',
                    marginBottom: 20,
                    lineHeight: 1.4,
                  }}>
                    {sectorConfig.headerText}
                  </Text>
                )}

                {/* Description - Second textblock (bold black) */}
                {sectorConfig?.description && (
                  <Text style={{
                    fontSize: 10,
                    lineHeight: 1.6,
                    color: '#000000',
                    marginBottom: 16,
                    fontWeight: 'bold',
                  }}>
                    {sectorConfig.description}
                  </Text>
                )}

                {/* Sector Specific Text - Third textblock (regular black) */}
                {sectorConfig?.text && (
                  <Text style={{
                    fontSize: 10,
                    lineHeight: 1.6,
                    color: '#000000',
                  }}>
                    {sectorConfig.text}
                  </Text>
                )}
              </View>
            </View>
          );
        })()}
        
      </Page>

      {/* Page 5 - Final Cover Page (formerly Page 6) */}
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