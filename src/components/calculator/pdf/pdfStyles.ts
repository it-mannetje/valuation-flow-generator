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
  
  // Header white section covering full width at top
  coverHeaderSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    height: 80,
    zIndex: 3,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Left side header content (now horizontal layout)
  headerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  
  // Main title in header - white text with dark blue background
  headerTitle: {
    color: 'white',
    backgroundColor: '#1e3a8a',
    fontSize: 18,
    fontWeight: 'bold',
    padding: '8 16',
    borderRadius: 8,
  },
  
  // Confidential text in header (next to title) - light blue and bold
  headerConfidential: {
    color: '#60a5fa',
    fontSize: 10,
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
    zIndex: 2,
  },
  
  // Full width image section
  coverImageSection: {
    width: '100%',
    height: '100%',
    padding: 0,
    position: 'relative',
  },
  
  // Main cover image (full width)
  coverMainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  // Company info positioned in white area of background image (moved left)
  coverCompanySection: {
    position: 'absolute',
    right: 80,
    bottom: 30,
    width: 440,
    backgroundColor: 'transparent',
    padding: 30,
    justifyContent: 'center',
  },
  
  // Decorative dotted line on left side of company section
  companyDecorativeLine: {
    position: 'absolute',
    left: 0,
    top: 40,
    bottom: 40,
    width: 2,
    borderLeft: '2 dotted #3b82f6',
    backgroundColor: 'transparent',
  },
  
  // Large red company name (ensures single line)
  companyNameLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 1,
    overflow: 'hidden',
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

  // ========== PAGE 2 SPECIFIC STYLES ==========
  
  // Full page layout for page 2 (no padding, full width/height)
  page2Layout: {
    flexDirection: 'row',
    height: '100%',
    position: 'relative',
    padding: 0,
    backgroundColor: 'white',
  },
  
  // Left column with main image (50% width)
  page2LeftColumn: {
    width: '50%',
    position: 'relative',
    height: '100%',
  },
  
  // Main image in left column (90% height to leave space for footer and portrait)
  page2MainImage: {
    width: '100%',
    height: '90%',
    objectFit: 'cover',
  },
  
  // Right column with text content (50% width)
  page2RightColumn: {
    width: '50%',
    padding: '60px 40px 100px 40px',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'white',
  },
  
  // Voorwoord title styling
  page2Title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 30,
    textAlign: 'left',
  },
  
  // Text content paragraphs - smaller font to fit better
  page2Paragraph: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'justify',
  },
  
  // Greeting text
  page2Greeting: {
    fontSize: 7,
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  
  // Signature name
  page2SignatureName: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  
  // Signature title
  page2SignatureTitle: {
    fontSize: 7,
    color: '#6B7280',
  },
  
  // Portrait image positioned at bottom center over both columns
  page2PortraitImage: {
    position: 'absolute',
    width: 120,
    height: 140,
    objectFit: 'cover',
    left: '50%',
    bottom: 80, // Above footer in middle between sections
    marginLeft: -60, // Half of width to center
    zIndex: 10,
    borderRadius: 4,
  },
  
  // White footer bar spanning full width
  page2Footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 5,
    borderTop: '1 solid #E5E7EB',
  },
  
  // Footer left section with logo
  page2FooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // FBM logo
  page2FooterLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginRight: 8,
  },
  
  // Corporate Finance text
  page2FooterText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  
  // Footer right section with page number
  page2FooterRight: {
    alignItems: 'center',
  },
  
  // Page number with dotted line
  page2PageNumber: {
    position: 'absolute',
    top: 30,
    right: 40,
    alignItems: 'center',
  },
  
  // Dotted line above page number
  page2DottedLine: {
    width: 50,
    height: 1,
    borderTop: '1 dotted #6B7280',
    marginBottom: 10,
  },
  
  // Page number text
  page2PageNumberText: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
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
  
  // ========== PAGE 3 STYLES - EXACT LAYOUT ==========
  
  // Page 3 content wrapper with exact margins: top 20mm, bottom 15mm, left/right 15mm
  page3Content: {
    paddingTop: '56.69', // 20mm converted to points
    paddingBottom: '42.52', // 15mm converted to points
    paddingLeft: '42.52', // 15mm converted to points
    paddingRight: '42.52', // 15mm converted to points
    flex: 1,
    borderRadius: 0,
  },
  
  // Header bar - full width, height 25mm, white background with blue section
  page3Header: {
    backgroundColor: '#ffffff',
    height: '70.87', // 25mm converted to points
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: '-56.69', // Compensate for content padding
    marginLeft: '-42.52',
    marginRight: '-42.52',
    borderRadius: 0,
  },
  
  // Section badge "3." - 28x28px circle, borderRadius 14px
  page3HeaderNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#009FE3',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  page3Number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  
  page3HeaderTitle: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  
  page3Title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009FE3',
  },
  
  // Two columns layout - each 50% width
  page3MainContent: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 40,
    borderRadius: 0,
  },
  
  page3LeftColumn: {
    width: '50%',
    paddingRight: 20,
    borderRadius: 0,
  },
  
  page3RightColumn: {
    width: '50%',
    paddingLeft: 20,
    borderRadius: 0,
  },
  
  // Column titles - blue bold 14pt
  page3ColumnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009FE3',
    marginBottom: 15,
    borderRadius: 0,
  },
  
  // Data list - 10 rows in table form
  page3DataList: {
    marginBottom: 20,
    borderRadius: 0,
  },
  
  page3DataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 0,
  },
  
  page3Label: {
    fontSize: 10,
    color: '#333333',
    flex: 1,
  },
  
  page3Value: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 10,
  },
  
  // Four metrics blocks in 2x2 grid
  page3MetricsContainer: {
    marginBottom: 15,
    borderRadius: 0,
  },
  
  page3MetricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  
  page3MetricBox: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '48%',
    minHeight: 50,
    borderRadius: 12,
  },
  
  page3MetricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009FE3',
    marginBottom: 2,
  },
  
  page3MetricValueRed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 2,
  },
  
  page3MetricLabel: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
  },
  
  page3MultiplierContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  
  page3MultiplierValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  
  page3MultiplierText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  
  // Disclaimer text - dark grey 9pt
  page3Disclaimer: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 15,
    lineHeight: 1.3,
    borderRadius: 0,
  },
  
  // Chart section
  page3ChartContainer: {
    marginTop: 10,
    borderRadius: 0,
  },
  
  page3ChartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009FE3',
    marginBottom: 15,
    borderRadius: 0,
  },
  
  page3Chart: {
    height: 100,
    position: 'relative',
    borderRadius: 0,
  },
  
  page3ChartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 80,
    borderRadius: 0,
  },
  
  page3ChartBar1: {
    alignItems: 'center',
    flex: 1,
    borderRadius: 0,
  },
  
  page3ChartBar2: {
    alignItems: 'center',
    flex: 1,
    borderRadius: 0,
  },
  
  page3ChartBar3: {
    alignItems: 'center',
    flex: 1,
    borderRadius: 0,
  },
  
  page3Bar1: {
    width: 30,
    height: 40,
    backgroundColor: '#009FE3',
    marginBottom: 8,
    borderRadius: 4,
  },

  page3Bar2: {
    width: 30,
    height: 55,
    backgroundColor: '#009FE3',
    marginBottom: 8,
    borderRadius: 4,
  },

  page3Bar3: {
    width: 30,
    height: 70,
    backgroundColor: '#009FE3',
    marginBottom: 8,
    borderRadius: 4,
  },
  
  page3BarValue: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  page3ChartBaseline: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E6E6E6',
    borderRadius: 0,
  },
  
  // Two square images (70x70mm each) under left column
  page3Images: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    borderRadius: 0,
  },
  
  page3Image: {
    width: '198.43', // 70mm converted to points
    height: '198.43', // 70mm converted to points  
    borderRadius: 8,
    objectFit: 'cover',
  },
  
  // Footer - spans full width
  page3Footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    borderTop: '1 solid #E6E6E6',
    borderRadius: 0,
  },
  
  page3FooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 0,
  },
  
  page3FooterLogo: {
    width: '70.87', // 25mm converted to points
    height: 'auto',
    borderRadius: 0,
  },
  
  page3FooterLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009FE3',
    marginRight: 8,
    borderRadius: 0,
  },
  
  page3FooterText: {
    fontSize: 12,
    color: '#009FE3',
  },
  
  page3FooterRight: {
    alignItems: 'center',
    borderRadius: 0,
  },
  
  page3FooterDots: {
    width: 40,
    height: 1,
    borderTop: '1 dotted #333333',
    marginBottom: 8,
    borderRadius: 0,
  },
  
  page3FooterPageNumber: {
    fontSize: 8,
    color: '#333333',
    fontWeight: 'normal',
  },

  // ========== PAGE 4 STYLES ==========
  
  // Page 4 header
  page4Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  
  page4HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  
  page4Number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  page4HeaderTitle: {
    backgroundColor: '#1e3a8a', // Dark blue background
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '50%', // Maximum width to middle of page
  },
  
  page4Title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Main content layout
  page4MainContent: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 40,
    marginBottom: 80,
  },
  
  page4LeftColumn: {
    width: '50%',
    paddingRight: 30,
  },
  
  page4RightColumn: {
    width: '50%',
    paddingLeft: 30,
    alignItems: 'center',
  },
  
  page4ContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  
  page4ContentText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'justify',
  },
  
  page4MainImage: {
    width: 350, // Larger image
    height: 300, // Larger image
    borderRadius: 12,
    objectFit: 'cover',
  },
  
  page4ImageCaption: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  
  // Footer
  page4Footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    borderTop: '1 solid #E5E7EB',
  },
  
  page4FooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  page4FooterLogo: {
    width: 100,
    height: 40,
  },
  
  page4FooterLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginRight: 8,
  },
  
  page4FooterText: {
    fontSize: 14,
    color: '#2563EB',
  },
  
  page4FooterRight: {
    alignItems: 'center',
  },
  
  page4FooterDots: {
    width: 40,
    height: 1,
    borderTop: '1 dotted #6B7280',
    marginBottom: 8,
  },
  
  page4FooterPageNumber: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  // ========== PAGE 5 STYLES ==========
  
  // Page 5 header
  page5Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  
  page5HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  
  page5Number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
  page5HeaderTitle: {
    backgroundColor: '#1e3a8a', // Dark blue background
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '50%', // Maximum width to middle of page
  },
  
  page5Title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Main content layout
  page5MainContent: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 40,
    marginBottom: 80,
  },
  
  page5LeftColumn: {
    width: '50%', // 50% width as requested
    paddingRight: 30,
  },
  
  page5RightColumn: {
    width: '50%', // Adjust to match left column
    paddingLeft: 30,
  },
  
  page5ContentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 20,
  },
  
  page5ContentText: {
    fontSize: 12, // Smaller font to fit all text
    lineHeight: 1.4, // Tighter line height
    color: '#374151',
    marginBottom: 12,
    textAlign: 'justify',
  },
  
  // Company logos grid
  page5LogosGrid: {
    flexDirection: 'column',
    gap: 20,
  },
  
  page5LogoRow: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
  },
  
  page5LogoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  page5LogoLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  
  page5LogoImage: {
    width: 80,
    height: 40,
    objectFit: 'contain',
    marginBottom: 8,
  },
  
  page5LogoSubtext: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
  },
  
  page5LogoBlueSide: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#2563EB',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  
  // Footer
  page5Footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    borderTop: '1 solid #E5E7EB',
  },
  
  page5FooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  page5FooterLogo: {
    width: 100,
    height: 40,
  },
  
  page5FooterLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginRight: 8,
  },
  
  page5FooterText: {
    fontSize: 14,
    color: '#2563EB',
  },
  
  page5FooterRight: {
    alignItems: 'center',
  },
  
  page5FooterDots: {
    width: 40,
    height: 1,
    borderTop: '1 dotted #6B7280',
    marginBottom: 8,
  },
  
  page5FooterPageNumber: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  // ========== PAGE 6 STYLES ==========
  
  // Background and overlay
  page6Background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  
  page6BackgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  page6BlueOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(37, 99, 235, 0.85)', // Blue overlay with transparency
    zIndex: 1,
  },
  
  // Logo container
  page6LogoContainer: {
    position: 'absolute',
    top: 40,
    left: 40,
    zIndex: 3,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  page6Logo: {
    width: 100,
    height: 50,
  },
  
  page6LogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  
  page6LogoSubtext: {
    fontSize: 12,
    color: 'white',
  },
  
  // Main content
  page6MainContent: {
    position: 'absolute',
    left: 40,
    top: '40%',
    zIndex: 3,
    width: '50%',
  },
  
  page6Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  
  page6Subtitle: {
    fontSize: 16,
    color: 'white',
    lineHeight: 1.6,
    marginBottom: 30,
  },
  
  // Contact box - shifted 15% to the right
  page6ContactBox: {
    position: 'absolute',
    bottom: 40,
    left: 120, // Shifted 15% to the right (was 40)
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    zIndex: 3,
    borderLeft: '4 solid #2563EB',
    width: 250,
  },
  
  page6ContactTitle: {
    fontSize: 12,
    color: '#2563EB',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  
  page6ContactWebsite: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  // Page 6 header styles
  page6Header: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },

  page6HeaderLogo: {
    alignItems: 'flex-end',
  },

  // Page 6 content text style
  page6ContentText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 1.6,
    marginTop: 10,
  },

  // Page 6 footer logo container
  page6FooterLogoContainer: {
    marginTop: 15,
    alignItems: 'center',
  },

  page6FooterLogo: {
    width: 60,
    height: 30,
  },
});