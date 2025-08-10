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
            return <Text key={index} style={pdfStyles.forewordText}>{sectionText}</Text>;
          case 'list':
            return <Text key={index} style={pdfStyles.forewordText}>• {sectionText}</Text>;
          default:
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
            <Page key={page.id} size="A4" orientation="landscape" style={pdfStyles.page}>
              {/* Blue header section */}
              <View style={pdfStyles.coverHeaderSection}>
                <View style={pdfStyles.headerLeftContent}>
                  <Text style={pdfStyles.headerTitle}>Rapport waardebepaling</Text>
                  <Text style={pdfStyles.headerConfidential}>STRICTLY CONFIDENTIAL</Text>
                  <Text style={pdfStyles.headerDate}>{currentDate}</Text>
                </View>
                {/* Logo in header */}
                {page.top_logo_url && renderLogo(page.top_logo_url, pdfStyles.headerLogo)}
              </View>
              
              {/* Main content area with image and company info */}
              <View style={pdfStyles.coverMainContent}>
                {/* Left section - Main image (60% width) */}
                <View style={pdfStyles.coverImageSection}>
                  {page.background_image_url && (
                    <Image 
                      style={pdfStyles.coverMainImage} 
                      src={page.background_image_url} 
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
          );
        }

        // Regular pages
        return (
          <Page key={page.id} size="A4" orientation="landscape" style={pdfStyles.page}>
            {/* Background Image */}
            {renderBackgroundImage(page.background_image_url)}

            {/* Top Logo */}
            {page.top_logo_url && renderLogo(page.top_logo_url, [
              pdfStyles.topLogo,
              { 
                left: page.top_logo_position === 'center' ? '45%' : 
                      page.top_logo_position === 'right' ? 'auto' : 20,
                right: page.top_logo_position === 'right' ? 20 : 'auto'
              }
            ])}

            <View style={pdfStyles.content}>
              <View style={pdfStyles.pageHeader}>
                <Text style={pdfStyles.fbmLogo}>fbm</Text>
              </View>

              {/* Page Content */}
              {page.content?.content && renderContentSections(page.content.content, page)}

              {/* Footer Logo */}
              {page.footer_logo_url && renderLogo(page.footer_logo_url, [
                pdfStyles.footerLogo,
                { 
                  left: page.footer_logo_position === 'center' ? '45%' : 
                        page.footer_logo_position === 'right' ? 'auto' : 20,
                  right: page.footer_logo_position === 'right' ? 20 : 'auto'
                }
              ])}

              <Text style={pdfStyles.pageNumber}>{page.page_number}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default AdminPreviewPDF;