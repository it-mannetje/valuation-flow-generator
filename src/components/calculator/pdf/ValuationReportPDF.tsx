import React from 'react';
import { Document, Page, Text, View, Image, pdf, Svg, Path, Defs, LinearGradient, Stop } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';
import { pdfStyles } from './pdfStyles';
import PDFFooter from './PDFFooter';
import Page3Background from './Page3Background';
import { Page3LeftSidebar } from './Page3LeftSidebar';

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
        {/* Background with gradient and pattern */}
        <Page3Background backgroundImageUrl={getPageData(3).background} />
        
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
          
          {/* LEFT SIDEBAR - Component */}
          <Page3LeftSidebar
            companyData={companyData}
            estimatedEbitda={estimatedEbitda}
            sectors={sectors}
          />

          {/* Thin White Connector Line from left div center to right div */}
          <Svg 
            width="120" 
            height="20" 
            style={{
              position: 'absolute',
              left: '15%',
              top: 0,
              opacity: 0.9,
            }}
          >
            {/* Main horizontal connector line - from left div center to right div top */}
            <Path
              d="M 0 10 L 120 10"
              stroke="#ffffff"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Subtle glow effect */}
            <Path
              d="M 0 10 L 120 10"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.2"
            />
          </Svg>

          {/* RIGHT COLUMN - Main Content Card */}
          <View style={{ 
            width: '70%', 
            backgroundColor: '#ffffff',
            padding: 35,
            borderRadius: 16,
          }}>
            
            {/* Header Title */}
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              Indicatieve calculatie
            </Text>

            {/* Intro Text */}
            <Text style={{
              fontSize: 9,
              textAlign: 'center',
              color: '#475569',
              marginBottom: 20,
              lineHeight: 1.5,
            }}>
              Op basis van de door jou ingevoerde gegevens scoort{'\n'}
              de multiple van je bedrijf <Text style={{ color: '#10b981', fontWeight: 'bold' }}>hoger</Text> dan het gemiddelde{'\n'}
              in jouw sector.
            </Text>

            {/* Large Multiple Display - Simple Large Number */}
            <View style={{
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#10b981',
                letterSpacing: -4,
              }}>
                {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
              </Text>
            </View>

            {/* Subtitle */}
            <Text style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#64748b',
              marginBottom: 20,
            }}>
              Dat is de uitkomst van de FBM waardebepalingstool.
            </Text>

            {/* Dotted Separator */}
            <View style={{
              borderBottom: '1px dotted #cbd5e1',
              marginBottom: 18,
            }} />

            {/* Section Title */}
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#0891b2',
              textAlign: 'center',
              marginBottom: 16,
            }}>
              Uitkomst indicatieve waarde
            </Text>

            {/* Data Grid - 2 Column Layout */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              {/* Left Column */}
              <View style={{ width: '48%' }}>
                {/* EBITDA */}
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    EBITDA (ADJUSTED)
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
                  </Text>
                </View>
                
                {/* Ondernemingswaarde */}
                <View>
                  <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    ONDERNEMINGSWAARDE
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0891b2' }}>
                    € {Math.round(savedValuationData?.company_value || valuationResult.baseValuation).toLocaleString('nl-NL')},-
                  </Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={{ width: '48%' }}>
                {/* Waarderingsmoment */}
                <View style={{ marginBottom: 14 }}>
                  <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    WAARDERINGSMOMENT
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1b2b4c' }}>
                    {currentDate}
                  </Text>
                </View>
                
                {/* Multiple */}
                <View>
                  <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    MULTIPLE OP EBITDA
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>
                    {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                  </Text>
                </View>
              </View>
            </View>

            {/* Chart Title */}
            <Text style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#1b2b4c',
              fontWeight: 600,
              marginBottom: 12,
            }}>
              Dit brengt jouw indicatieve bedrijfswaarde{'\n'}op een bedrag tussen:
            </Text>

            {/* Bar Chart Visualization */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: 140,
              marginBottom: 8,
              gap: 3,
            }}>
              {(() => {
                const multiple = savedValuationData?.multiplier || valuationResult.multiple;
                const bars = [
                  { value: 8.1, height: 60 },
                  { value: 8.2, height: 70 },
                  { value: 8.3, height: 80 },
                  { value: 8.4, height: 90 },
                  { value: 8.5, height: 100 },
                  { value: 8.6, height: 110, highlight: true },
                  { value: 8.7, height: 100 },
                  { value: 8.8, height: 90 },
                  { value: 8.9, height: 80 },
                  { value: 9.0, height: 70 },
                  { value: 9.1, height: 60 },
                ];
                
                return bars.map((bar, i) => {
                  const isActive = Math.abs(bar.value - multiple) < 0.1;
                  return (
                    <View key={i} style={{ alignItems: 'center' }}>
                      {isActive && (
                        <Text style={{ 
                          fontSize: 9, 
                          fontWeight: 'bold', 
                          color: '#10b981',
                          marginBottom: 4,
                        }}>
                          {bar.value.toFixed(1)}
                        </Text>
                      )}
                      <View style={{
                        width: 14,
                        height: bar.height,
                        backgroundColor: isActive ? '#10b981' : '#0891b2',
                        borderRadius: 2,
                      }} />
                      <Text style={{ 
                        fontSize: 7, 
                        color: '#64748b',
                        marginTop: 4,
                      }}>
                        {bar.value.toFixed(1)}
                      </Text>
                    </View>
                  );
                });
              })()}
            </View>

            {/* Value Range with Arrow */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1b2b4c' }}>
                € {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')},-
              </Text>
              <View style={{
                width: 80,
                height: 1,
                backgroundColor: '#cbd5e1',
              }} />
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1b2b4c' }}>
                € {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')},-
              </Text>
            </View>

            {/* Disclaimer */}
            <Text style={{
              fontSize: 7,
              color: '#64748b',
              textAlign: 'center',
              lineHeight: 1.4,
              paddingTop: 10,
              borderTop: '1px solid #e2e8f0',
            }}>
              Disclaimer: Dit is een indicatieve waardering op basis van een aantal gericht aansluitende{'\n'}
              uitgangspunten. Neem contact met ons op via de website van jouw bedrijf te bepalen.
            </Text>
          </View>

          {/* Connecting Line */}
          <View style={{
            position: 'absolute',
            left: '31%',
            top: '40%',
            width: 2,
            height: 100,
            backgroundColor: '#ffffff',
            opacity: 0.6,
            borderRadius: 1,
          }} />

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