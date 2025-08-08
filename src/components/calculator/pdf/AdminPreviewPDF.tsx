import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
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
  contactInfo: {
    fontSize: 11,
    marginTop: 35,
    padding: 18,
    backgroundColor: '#F8FAFC',
    border: '1 solid #E2E8F0',
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

          {/* Special handling for page 6 contact info */}
          {page.page_number === 6 && page.content?.contact_info && (
            <View style={styles.contactInfo}>
              <Text style={styles.sectionTitle}>Contact Informatie</Text>
              {page.content.contact_company && (
                <Text>Bedrijf: {page.content.contact_company}</Text>
              )}
              {page.content.contact_address && (
                <Text>Adres: {page.content.contact_address}</Text>
              )}
              {page.content.contact_phone && (
                <Text>Telefoon: {page.content.contact_phone}</Text>
              )}
              {page.content.contact_website && (
                <Text>Website: {page.content.contact_website}</Text>
              )}
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