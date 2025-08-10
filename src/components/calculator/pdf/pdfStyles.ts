import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  // Base page styles
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  
  // Background image covering bottom part of page
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '75%', // Cover bottom 75% of page
    objectFit: 'cover',
    zIndex: 0,
  },
  
  // White bottom section (25% of page height)
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'white',
    zIndex: 1,
  },
  
  // Content wrapper with relative positioning
  content: {
    position: 'relative',
    padding: 20,
    minHeight: '100%',
    zIndex: 2,
  },
  
  // ========== COVER PAGE STYLES ==========
  
  // Header blue section covering full width at top
  coverHeaderSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e3a8a',
    height: 80,
    zIndex: 3,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Left side header content
  headerLeftContent: {
    flexDirection: 'column',
  },
  
  // Main title in header
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  
  // Confidential text in header
  headerConfidential: {
    color: 'white',
    fontSize: 10,
    marginBottom: 5,
  },
  
  // Date in header (small red)
  headerDate: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  
  // Logo in header (top right)
  headerLogo: {
    width: 50,
    height: 50,
  },
  
  // Main content area below header
  coverMainContent: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 2,
  },
  
  // Left section with main image (60% width)
  coverImageSection: {
    width: '60%',
    height: '100%',
    padding: 0,
  },
  
  // Main cover image
  coverMainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  // Right section with company info (40% width)
  coverCompanySection: {
    width: '40%',
    backgroundColor: 'white',
    padding: 40,
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  
  // Decorative dotted line on left side of company section
  companyDecorativeLine: {
    position: 'absolute',
    left: 0,
    top: 40,
    bottom: 40,
    width: 3,
    backgroundColor: '#dc2626',
  },
  
  // Large red company name
  companyNameLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 1.2,
  },
  
  // Red date below company name
  companyDate: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'left',
    fontWeight: 'normal',
  },
  
  // ========== INNER PAGE STYLES ==========
  
  // Page header for content pages
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 20,
  },
  
  // FBM logo text
  fbmLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#1E40AF',
    padding: '12 24',
    borderRadius: 8,
    marginBottom: 30,
  },
  
  // Regular text content
  forewordText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 15,
    textAlign: 'justify',
  },
  
  // Signature text
  signatureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
  },
  
  // Page numbers
  pageNumber: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 14,
    color: '#6B7280',
  },
  
  // ========== CALCULATION PAGE STYLES ==========
  
  // Two column layout
  calculationGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  
  // Left column with gray background
  leftColumn: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
  },
  
  // Right column
  rightColumn: {
    flex: 1,
  },
  
  // Column titles
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  
  // Data rows
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1 solid #E5E7EB',
  },
  
  // Labels
  label: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  
  // Values
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    flex: 1,
  },
  
  // Highlight boxes
  highlightBox: {
    backgroundColor: '#EFF6FF',
    border: '2 solid #3B82F6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  
  // Large highlight values
  highlightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 5,
  },
  
  // Highlight labels
  highlightLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 3,
  },
  
  // Highlight subtext
  highlightSubtext: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  // Small disclaimer text
  disclaimerSmall: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
    marginTop: 15,
    fontStyle: 'italic',
  },
  
  // ========== BANDBREEDTE STYLES ==========
  
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
  
  // ========== SECTOR INFO STYLES ==========
  
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
  
  // ========== BUSINESS VALUATION STYLES ==========
  
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
  
  // ========== NEXT STEPS STYLES ==========
  
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
  
  // ========== LOGO POSITIONING ==========
  
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