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

      {/* Page 3 - Calculation Results - Redesigned Layout */}
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
        
        {/* Content Overlay - Absolutely Positioned */}
        <View style={{
          position: 'absolute',
          top: 80,
          left: 50,
          right: 50,
        }}>

          {/* Two Column Layout */}
          <View style={{
            flexDirection: 'row',
            gap: 20,
            marginBottom: 18,
          }}>
            
            {/* LEFT COLUMN - Multiple Indicator */}
            <View style={{
              width: '45%',
            }}>
              
              {/* Multiple Gauge Visual */}
              <View style={{
                marginTop: 25,
                marginBottom: 15,
              }}>
                {/* Scale Line */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    {(valuationResult.multiple - 0.5).toFixed(1)}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    {(valuationResult.multiple + 0.5).toFixed(1)}
                  </Text>
                </View>
                
                {/* Horizontal Line */}
                <View style={{
                  height: 2,
                  backgroundColor: '#d1d5db',
                  marginBottom: 15,
                  position: 'relative',
                }} />
                
                {/* Center Multiple Value - Highlighted */}
                <View style={{
                  alignItems: 'center',
                  marginTop: -25,
                }}>
                  <View style={{
                    backgroundColor: '#1e3a8a',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 4,
                  }}>
                    <Text style={{
                      fontSize: 28,
                      fontWeight: 'bold',
                      color: '#ffffff',
                    }}>
                      {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x
                    </Text>
                  </View>
                </View>
                
                {/* Multiple Range Labels */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                  <View>
                    <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 2 }}>
                      Low
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937' }}>
                      {(valuationResult.multiple - 0.5).toFixed(1)}x
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 2 }}>
                      High
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937' }}>
                      {(valuationResult.multiple + 0.5).toFixed(1)}x
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN - Data Fields */}
            <View style={{
              width: '55%',
            }}>
              
              {/* Data Fields Container */}
              <View style={{ gap: 6 }}>
                
                {/* OMZET */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    OMZET
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    {savedValuationData?.revenue_range_display || companyData.lastYearRevenueDisplay || 'Niet ingevuld'}
                  </Text>
                </View>

                {/* EBITDA */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    EBITDA (ADJUSTED)
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    € {Math.round(estimatedEbitda).toLocaleString('nl-NL')}
                  </Text>
                </View>

                {/* ONDERNEMINGSWAARDE - MOST PROMINENT */}
                <View style={{
                  backgroundColor: '#1e3a8a',
                  padding: 10,
                  borderRadius: 4,
                  marginVertical: 2,
                }}>
                  <Text style={{ fontSize: 8, color: '#e5e7eb', marginBottom: 2 }}>
                    ONDERNEMINGSWAARDE
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>
                    € {Math.round(valuationResult.baseValuation).toLocaleString('nl-NL')}
                  </Text>
                </View>

                {/* WAARDERINGSMOMENT */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    WAARDERINGSMOMENT
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    {currentDate}
                  </Text>
                </View>

                {/* MULTIPLE OP EBITDA */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    MULTIPLE OP EBITDA
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    {savedValuationData?.multiplier?.toFixed(1) || valuationResult.multiple.toFixed(1)}x EBITDA
                  </Text>
                </View>

                {/* FTE */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    FTE
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    {companyData.employeesDisplay || companyData.employees}
                  </Text>
                </View>

                {/* SECTOR */}
                <View style={{
                  backgroundColor: '#f8f9fa',
                  padding: 8,
                  borderRadius: 4,
                }}>
                  <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>
                    SECTOR
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000000' }}>
                    {companyData.sector && sectors.length > 0 
                      ? sectors.find(s => s.id === companyData.sector)?.name || valuationResult.sector 
                      : valuationResult.sector}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Section - Value Range */}
          <View style={{
            backgroundColor: '#1e3a8a',
            padding: 16,
            borderRadius: 6,
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: 0.5,
            }}>
              € {Math.round(valuationResult.minValuation).toLocaleString('nl-NL')} - € {Math.round(valuationResult.maxValuation).toLocaleString('nl-NL')}
            </Text>
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
              top: 100,
              left: 60,
              right: 60,
              bottom: 60,
            }}>
              {/* Sector Name */}
              <Text style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#1e3a8a',
                marginBottom: 20,
              }}>
                {sectorConfig?.name || ''}
              </Text>

              {/* Sector Description */}
              {sectorConfig?.description && (
                <Text style={{
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: '#1f2937',
                  marginBottom: 20,
                }}>
                  {sectorConfig.description}
                </Text>
              )}

              {/* Sector Specific Text */}
              {sectorConfig?.text && (
                <Text style={{
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: '#1f2937',
                }}>
                  {sectorConfig.text}
                </Text>
              )}
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