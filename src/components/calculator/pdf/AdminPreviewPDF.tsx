import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult, SectorConfig } from '@/types/calculator';

// Use default fonts - no custom font registration needed

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
    padding: 50,
    minHeight: '100%',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  header: {
    fontSize: 28,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 35,
    textAlign: 'center',
    color: '#666666',
  },
  topLogoContainer: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 50,
    height: 60,
    zIndex: 10,
  },
  topLogoLeft: {
    alignItems: 'flex-start',
  },
  topLogoCenter: {
    alignItems: 'center',
  },
  topLogoRight: {
    alignItems: 'flex-end',
  },
  topLogo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },
  footerLogoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    height: 40,
    zIndex: 10,
  },
  footerLogoLeft: {
    alignItems: 'flex-start',
  },
  footerLogoCenter: {
    alignItems: 'center',
  },
  footerLogoRight: {
    alignItems: 'flex-end',
  },
  footerLogo: {
    width: 80,
    height: 30,
    objectFit: 'contain',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 18,
    borderBottom: '2 solid #1E40AF',
    paddingBottom: 8,
  },
  paragraph: {
    marginBottom: 15,
    textAlign: 'justify',
    lineHeight: 1.7,
    fontSize: 13,
  },
  list: {
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 10,
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 35,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

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
            return (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{sectionText}</Text>
              </View>
            );
          case 'paragraph':
            return (
              <View key={index} style={styles.section}>
                <Text style={styles.paragraph}>{sectionText}</Text>
              </View>
            );
          case 'list':
            return (
              <View key={index} style={[styles.section, styles.list]}>
                <Text style={styles.listItem}>• {sectionText}</Text>
              </View>
            );
          default:
            return (
              <View key={index} style={styles.section}>
                <Text style={styles.paragraph}>{sectionText}</Text>
              </View>
            );
        }
      }).filter(Boolean);
    } catch (error) {
      console.error('Error rendering content sections:', error);
      return (
        <View style={styles.section}>
          <Text style={styles.paragraph}>Error rendering content</Text>
        </View>
      );
    }
  };

  return (
    <Document>
      {pages.map((page) => (
        <Page key={page.id} size="A4" orientation="landscape" style={styles.page}>
          {/* Background Image */}
          {page.background_image_url && (
            <Image src={page.background_image_url} style={styles.backgroundImage} />
          )}

          {/* Top Logo */}
          {page.top_logo_url && (
            <View style={[
              styles.topLogoContainer,
              page.top_logo_position === 'center' ? styles.topLogoCenter :
              page.top_logo_position === 'right' ? styles.topLogoRight : styles.topLogoLeft
            ]}>
              <Image src={page.top_logo_url} style={styles.topLogo} />
            </View>
          )}

          {/* Page Title */}
          {page.content?.title && (
            <Text style={styles.header}>
              {page.content.title}
            </Text>
          )}

          {/* Subtitle for cover page */}
          {page.page_number === 1 && page.content?.subtitle && (
            <Text style={styles.subtitle}>
              {page.content.subtitle}
            </Text>
          )}

          {/* Page Content */}
          {page.content?.content && (
            <View>
              {renderContentSections(page.content.content, page)}
            </View>
          )}

          {/* Footer Logo */}
          {page.footer_logo_url && (
            <View style={[
              styles.footerLogoContainer,
              page.footer_logo_position === 'center' ? styles.footerLogoCenter :
              page.footer_logo_position === 'right' ? styles.footerLogoRight : styles.footerLogoLeft
            ]}>
              <Image src={page.footer_logo_url} style={styles.footerLogo} />
            </View>
          )}

          {/* Footer */}
          <Text style={styles.footer}>
            Pagina {page.page_number} - {page.page_name}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default AdminPreviewPDF;