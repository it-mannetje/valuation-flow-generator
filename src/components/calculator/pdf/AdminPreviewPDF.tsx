import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';
import { pdfStyles } from './pdfStyles';

interface PDFPage {
  id: string;
  page_number: number;
  page_name: string;
  background_image_url?: string;
  logo_image_url?: string;
  top_logo_url?: string;
  top_logo_position?: string;
  footer_logo_url?: string;
  footer_logo_position?: string;
  content: any;
  created_at: string;
  updated_at: string;
}

interface AdminPreviewPDFProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
  pages: PDFPage[];
  sectors: SectorConfig[];
}

const AdminPreviewPDF: React.FC<AdminPreviewPDFProps> = ({ 
  companyData, 
  contactData, 
  valuationResult, 
  pages,
  sectors 
}) => {
  const currentDate = new Date().toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Helper function to render images safely
  const renderBackgroundImage = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    try {
      return <Image src={imageUrl} style={pdfStyles.backgroundImage} />;
    } catch (error) {
      console.warn('Failed to load background image:', imageUrl, error);
      return null;
    }
  };

  const renderLogo = (logoUrl: string | null, logoStyle: any) => {
    if (!logoUrl) return null;
    try {
      return <Image src={logoUrl} style={logoStyle} />;
    } catch (error) {
      console.warn('Failed to load logo:', logoUrl, error);
      return null;
    }
  };

  // Helper function to render content sections
  const renderContentSections = (content: any, page: PDFPage) => {
    if (!content || !Array.isArray(content)) return null;
    
    try {
      return content.map((section: any, index: number) => {
        if (!section || typeof section !== 'object') return null;
        
        let sectionText = section.text || '';
        
        // Replace sector-specific placeholders for sector information page
        if (page.page_number === 4 && companyData.sector) {
          const sectorConfig = sectors.find(s => s.id === companyData.sector);
          if (sectorConfig && sectionText.includes('{{sector_text}}')) {
            sectionText = sectionText.replace('{{sector_text}}', sectorConfig.text);
          }
          if (sectorConfig && sectionText.includes('{{sector_name}}')) {
            sectionText = sectionText.replace('{{sector_name}}', sectorConfig.name);
          }
          if (sectorConfig && sectionText.includes('{{sector_multiple}}')) {
            sectionText = sectionText.replace('{{sector_multiple}}', sectorConfig.multiple.toString());
          }
        }
        
        // Replace general placeholders with actual sector data from database
        if (companyData.sector && sectors.length > 0) {
          const sectorConfig = sectors.find(s => s.id === companyData.sector);
          if (sectorConfig) {
            sectionText = sectionText.replace(/\{\{sector_text\}\}/g, sectorConfig.text || '');
            sectionText = sectionText.replace(/\{\{sector_name\}\}/g, sectorConfig.name || '');
            sectionText = sectionText.replace(/\{\{sector_multiple\}\}/g, sectorConfig.multiple?.toString() || '');
          }
        }
        
        switch (section.type) {
          case 'heading':
            return <Text key={index} style={pdfStyles.sectionTitle}>{sectionText}</Text>;
          case 'paragraph':
            // Use page 2 specific styles for page 2
            if (page.page_number === 2) {
              return <Text key={index} style={pdfStyles.page2Paragraph}>{sectionText}</Text>;
            }
            return <Text key={index} style={pdfStyles.forewordText}>{sectionText}</Text>;
          case 'list':
            if (page.page_number === 2) {
              return <Text key={index} style={pdfStyles.page2Paragraph}>• {sectionText}</Text>;
            }
            return <Text key={index} style={pdfStyles.forewordText}>• {sectionText}</Text>;
          default:
            if (page.page_number === 2) {
              return <Text key={index} style={pdfStyles.page2Paragraph}>{sectionText}</Text>;
            }
            return <Text key={index} style={pdfStyles.forewordText}>{sectionText}</Text>;
        }
      }).filter(Boolean);
    } catch (error) {
      console.error('Error rendering content sections:', error);
      return (
        <Text style={pdfStyles.forewordText}>Error rendering content</Text>
      );
    }
  };

  return (
    <Document>
      {pages.map((page) => {
        // Cover page gets special layout
        if (page.page_number === 1) {
          return (
            <Page key={page.id} size="A4" orientation="portrait" style={pdfStyles.page}>
              {/* Main content area with image only */}
              <View style={pdfStyles.coverMainContent}>
                {/* Full width image */}
                <View style={pdfStyles.coverImageSection}>
                  {page.background_image_url && (
                    <Image 
                      style={pdfStyles.coverMainImage} 
                      src={page.background_image_url} 
                    />
                  )}
                </View>
              </View>
            </Page>
          );
        }

        // Page 2 - Foreword with special layout
        if (page.page_number === 2) {
          return (
            <Page key={page.id} size="A4" orientation="portrait" style={pdfStyles.page}>
              {/* Full width image only */}
              <View style={pdfStyles.page2Layout}>
                {/* Full width image */}
                <View style={pdfStyles.page2LeftColumn}>
                  {page.background_image_url ? (
                    <Image 
                      style={pdfStyles.page2MainImage} 
                      src={page.background_image_url} 
                    />
                  ) : (
                    <Image 
                      style={pdfStyles.page2MainImage} 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
                    />
                  )}
                </View>
              </View>
            </Page>
          );
        }

        // Page 3 - Calculation Results with special layout
        if (page.page_number === 3) {
          const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('nl-NL', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(amount);
          };

          const estimatedEBITDA = Math.round(valuationResult.baseValuation / valuationResult.multiple);

          return (
            <Page key={page.id} size="A4" orientation="portrait" style={pdfStyles.page}>
              {page.background_image_url && renderBackgroundImage(page.background_image_url)}
              
              <View style={pdfStyles.content}>
                {/* Main content area with two columns */}
                <View style={pdfStyles.page3MainContent}>
                  {/* Left column - Input data */}
                  <View style={pdfStyles.page3LeftColumn}>
                    <Text style={pdfStyles.page3ColumnTitle}>Ingevoerde gegevens</Text>
                    
                    <View style={pdfStyles.page3DataList}>
                      <View style={pdfStyles.page3DataRow}>
                        <Text style={pdfStyles.page3Label}>Omzet in het afgelopen jaar</Text>
                        <Text style={pdfStyles.page3Value}>{formatCurrency(companyData.lastYearRevenue)}</Text>
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
                        <Text style={pdfStyles.page3Label}>Aantal werknemers</Text>
                        <Text style={pdfStyles.page3Value}>{companyData.employees}</Text>
                      </View>
                      <View style={pdfStyles.page3DataRow}>
                        <Text style={pdfStyles.page3Label}>Sector</Text>
                        <Text style={pdfStyles.page3Value}>{sectors.find(s => s.id === companyData.sector)?.name || companyData.sector}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Right column - Results in 2x2 grid */}
                  <View style={pdfStyles.page3RightColumn}>
                    <Text style={pdfStyles.page3ColumnTitle}>Resultaat</Text>
                    
                    {/* 2x2 Grid layout */}
                    <View style={pdfStyles.page3ResultsGrid}>
                      {/* Row 1 */}
                      <View style={pdfStyles.page3GridRow}>
                        {/* EBITDA block */}
                        <View style={pdfStyles.page3GridBlock}>
                          <Text style={pdfStyles.page3GridLabel}>Geschatte EBITDA</Text>
                          <Text style={pdfStyles.page3GridValue}>{formatCurrency(estimatedEBITDA)}</Text>
                        </View>
                        
                        {/* Date block */}
                        <View style={pdfStyles.page3GridBlock}>
                          <Text style={pdfStyles.page3GridLabel}>Datum berekening</Text>
                          <Text style={pdfStyles.page3GridValue}>{currentDate}</Text>
                        </View>
                      </View>
                      
                      {/* Row 2 */}
                      <View style={pdfStyles.page3GridRow}>
                        {/* Enterprise Value block */}
                        <View style={pdfStyles.page3GridBlock}>
                          <Text style={pdfStyles.page3GridLabel}>Ondernemingswaarde</Text>
                          <Text style={pdfStyles.page3GridValue}>{formatCurrency(valuationResult.baseValuation)}</Text>
                        </View>
                        
                        {/* Multiplier block */}
                        <View style={pdfStyles.page3GridBlock}>
                          <Text style={pdfStyles.page3GridLabel}>Multiplier</Text>
                          <Text style={pdfStyles.page3GridValue}>{valuationResult.multiple}x</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              
            </Page>
          );
        }

        // Regular pages (4+)
        // Skip page 5
        if (page.page_number === 5) {
          return null;
        }

        return (
          <Page key={page.id} size="A4" orientation="portrait" style={pdfStyles.page}>
            {/* Background Image */}
            {renderBackgroundImage(page.background_image_url)}

            <View style={pdfStyles.content}>
              {/* Page Content */}
              {page.content?.content && renderContentSections(page.content.content, page)}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default AdminPreviewPDF;