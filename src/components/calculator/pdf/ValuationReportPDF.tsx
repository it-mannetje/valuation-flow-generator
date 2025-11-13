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
        {/* Gradient background from light gray to pale mint - using solid color approximation */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f2f8fa',
        }} />

        {/* White dot pattern at bottom */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          opacity: 0.5,
        }}>
          {[...Array(20)].map((_, i) => (
            <View key={i} style={{
              position: 'absolute',
              bottom: 20 + (i % 5) * 30,
              left: 30 + Math.floor(i / 5) * 50,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#ffffff',
            }} />
          ))}
        </View>

        {/* Background Image - Optional overlay */}
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
              opacity: 0.2,
            }}
          />
        )}
        
        {/* Two Column Layout */}
        <View style={{
          position: 'absolute',
          top: 60,
          left: 40,
          right: 40,
          bottom: 60,
          flexDirection: 'row',
          gap: 25,
        }}>
          
          {/* LEFT SIDEBAR - Ingevulde gegevens Card */}
          <View style={{ 
            width: '30%', 
            backgroundColor: '#ffffff', 
            padding: 30, 
            borderRadius: 20,
            flexDirection: 'column', 
            justifyContent: 'space-between',
            border: '1px solid #e8eef2',
          }}>
            <View>
              {/* Header with minimal line icon */}
              <View style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 25,
              }}>
                {/* Minimal line icon - document/bar chart */}
                <View style={{
                  width: 32,
                  height: 32,
                  marginBottom: 12,
                  border: '2px solid #94a3b8',
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{ 
                    width: 18, 
                    height: 22, 
                    border: '1.5px solid #94a3b8',
                    borderRadius: 2,
                  }}>
                    {/* Document lines */}
                    <View style={{ width: 10, height: 1, backgroundColor: '#94a3b8', marginTop: 5, marginLeft: 4 }} />
                    <View style={{ width: 10, height: 1, backgroundColor: '#94a3b8', marginTop: 2, marginLeft: 4 }} />
                    <View style={{ width: 6, height: 1, backgroundColor: '#94a3b8', marginTop: 2, marginLeft: 4 }} />
                  </View>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1a3b68',
                  letterSpacing: -0.2,
                }}>
                  Ingevulde gegevens
                </Text>
              </View>

              {/* Data Section - Two Column Layout */}
              <View style={{ gap: 18 }}>
                {/* OMZET */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 10, color: '#6b7c93', fontWeight: 500, letterSpacing: 0.3 }}>
                    OMZET
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#1b2b4c' }}>
                    €{Math.round(companyData.lastYearRevenue).toLocaleString('nl-NL')},-
                  </Text>
                </View>

                {/* EBITDA */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 10, color: '#6b7c93', fontWeight: 500, letterSpacing: 0.3 }}>
                    EBITDA
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#1b2b4c' }}>
                    €{Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
                  </Text>
                </View>

                {/* FTE */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 10, color: '#6b7c93', fontWeight: 500, letterSpacing: 0.3 }}>
                    FTE
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1e293b' }}>
                    {companyData.employeesDisplay || companyData.employees}
                  </Text>
                </View>

                {/* SECTOR */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 10, color: '#6b7c93', fontWeight: 500, letterSpacing: 0.3 }}>
                    SECTOR
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#1b2b4c', textAlign: 'right', maxWidth: '60%' }}>
                    {sectors.find(s => s.id === companyData.sector)?.name || companyData.sector}
                  </Text>
                </View>

                {/* MANAGEMENTSPARTICIPATIE */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 10, color: '#6b7c93', fontWeight: 500, letterSpacing: 0.3 }}>
                    MANAGEMENT
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 600, color: '#1b2b4c' }}>
                    {companyData.managementParticipation ? 'Ja' : 'Nee'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Business Meeting Image at Bottom */}
            <View style={{ marginTop: 30 }}>
              <View style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: '2px solid #ffffff',
              }}>
                {getPageData(3).image1_url ? (
                  <Image 
                    src={getPageData(3).image1_url} 
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <View style={{
                    backgroundColor: '#e0f2fe',
                    height: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#0c5ea8',
                      opacity: 0.15,
                    }} />
                    <Text style={{ fontSize: 9, color: '#64748b', textAlign: 'center' }}>
                      Business Meeting{'\n'}Professional Office Scene
                    </Text>
                  </View>
                )}
              </View>
              
              {/* FBM Logo */}
              <View style={{ marginTop: 15 }}>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: '#0c5ea8',
                  letterSpacing: 0.5,
                }}>
                  fbm Corporate Finance
                </Text>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN - Main Content Card */}
          <View style={{ 
            width: '70%', 
            backgroundColor: '#ffffff',
            padding: 25,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}>
            
            {/* Header Title */}
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 10,
            }}>
              Indicatieve calculatie
            </Text>

            {/* Intro Text */}
            <Text style={{
              fontSize: 9,
              textAlign: 'center',
              color: '#475569',
              marginBottom: 15,
              lineHeight: 1.5,
            }}>
              Op basis van de door jou ingevoerde gegevens scoort{'\n'}
              de multiple van je bedrijf <Text style={{ color: '#10b981', fontWeight: 'bold' }}>hoger</Text> dan het gemiddelde{'\n'}
              in jouw sector.
            </Text>

            {/* Large Multiple Display - Circular Badge with Gradient Effect */}
            <View style={{
              alignItems: 'center',
              marginBottom: 10,
            }}>
              <View style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: '#d1fae5',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #10b981',
              }}>
                <Text style={{
                  fontSize: 64,
                  fontWeight: 'bold',
                  color: '#10b981',
                  letterSpacing: -3,
                }}>
                  {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                </Text>
              </View>
            </View>

            {/* Subtitle */}
            <Text style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#64748b',
              marginBottom: 12,
            }}>
              Dat is de uitkomst van de FBM waardebepalingstool.
            </Text>

            {/* Dotted Separator */}
            <View style={{
              borderBottom: '1px dotted #cbd5e1',
              marginBottom: 12,
            }} />

            {/* Section Title */}
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 10,
            }}>
              Uitkomst indicatieve waarde
            </Text>

            {/* Data Grid - 2x2 */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginBottom: 10,
            }}>
              {/* Left Column */}
              <View style={{ width: '50%' }}>
                {/* EBITDA (ADJUSTED) */}
                <View style={{
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: '#f8fafc',
                  borderRadius: 6,
                }}>
                  <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Ebitda (Adjusted)
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
                  </Text>
                </View>

                {/* ONDERNEMINGSWAARDE */}
                <View style={{
                  padding: 10,
                  backgroundColor: '#f8fafc',
                  borderRadius: 6,
                }}>
                  <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Ondernemingswaarde
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')},-
                  </Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={{ width: '50%' }}>
                {/* WAARDERINGSMOMENT */}
                <View style={{
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: '#f8fafc',
                  borderRadius: 6,
                }}>
                  <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Waarderingsmoment
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e293b' }}>
                    {currentDate}
                  </Text>
                </View>

                {/* MULTIPLE OP EBITDA */}
                <View style={{
                  padding: 10,
                  backgroundColor: '#f8fafc',
                  borderRadius: 6,
                }}>
                  <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 2, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Multiple op Ebitda
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0891b2' }}>
                    {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                  </Text>
                </View>
              </View>
            </View>

            {/* Dotted Separator */}
            <View style={{
              borderBottom: '1px dotted #cbd5e1',
              marginBottom: 10,
            }} />

            {/* Bottom Text */}
            <Text style={{
              fontSize: 9,
              textAlign: 'center',
              color: '#475569',
              marginBottom: 8,
              lineHeight: 1.3,
              fontWeight: 'bold',
            }}>
              Dit brengt jouw indicatieve bedrijfswaarde{'\n'}
              op een bedrag tussen:
            </Text>

            {/* Bar Chart */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: 60,
              marginBottom: 6,
              gap: 2,
            }}>
              {Array.from({ length: 13 }, (_, i) => {
                const centerIndex = 6;
                const distanceFromCenter = Math.abs(centerIndex - i);
                const isCenter = i === centerIndex;
                
                const maxHeight = 60;
                const minHeight = 25;
                const heightRange = maxHeight - minHeight;
                const heightStep = heightRange / centerIndex;
                const barHeight = maxHeight - (distanceFromCenter * heightStep * 0.8);
                
                let backgroundColor = '#0891b2';
                if (isCenter) backgroundColor = '#14b8a6';
                else if (i === centerIndex - 1 || i === centerIndex + 1) backgroundColor = '#06b6d4';
                
                return (
                  <View key={i} style={{
                    width: 12,
                    height: barHeight,
                    backgroundColor,
                    borderRadius: 2,
                  }} />
                );
              })}
            </View>

            {/* Multiple Range Labels */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
              paddingHorizontal: 5,
            }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0891b2' }}>
                {(valuationResult.multiple - 0.5).toFixed(1)}
              </Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#14b8a6' }}>
                {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0891b2' }}>
                {(valuationResult.multiple + 0.5).toFixed(1)}
              </Text>
            </View>

            {/* Value Range */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              paddingHorizontal: 5,
            }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1e293b' }}>
                € {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')},-
              </Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}>
                <View style={{ width: 30, borderBottom: '1.5px solid #94a3b8' }} />
                <Text style={{ fontSize: 12, color: '#94a3b8' }}>⟷</Text>
                <View style={{ width: 30, borderBottom: '1.5px solid #94a3b8' }} />
              </View>

              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1e293b' }}>
                € {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')},-
              </Text>
            </View>

            {/* Disclaimer */}
            <Text style={{
              fontSize: 7,
              textAlign: 'center',
              color: '#64748b',
              lineHeight: 1.4,
              paddingHorizontal: 8,
            }}>
              Disclaimer: Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde uitgangspunten. Neem <Text style={{ color: '#0891b2', fontWeight: 'bold' }}>contact</Text> met ons op om de exacte waarde van jouw <Text style={{ color: '#0891b2', fontWeight: 'bold' }}>bedrijf</Text> te bepalen.
            </Text>
          </View>
        </View>

        {/* FBM Logo at Bottom Left */}
        <View style={{
          position: 'absolute',
          bottom: 25,
          left: 40,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#0891b2',
          }}>
            fbm
          </Text>
          <Text style={{
            fontSize: 8,
            color: '#64748b',
            fontWeight: '500',
          }}>
            Corporate Finance
          </Text>
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