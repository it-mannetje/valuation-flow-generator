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
    backgroundColor: '#172342',
    fontSize: 18,
    fontWeight: 'bold',
    padding: '8 16',
    borderRadius: 8,
  },
  
  // Confidential text in header (next to title) - light blue and bold
  headerConfidential: {
    color: '#0281BD',
    fontSize: 10,
    fontWeight: 'bold',
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
    borderLeft: '2 dotted #0281BD',
    backgroundColor: 'transparent',
  },
  
  // Large red company name (ensures single line)
  companyNameLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EE0000',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 1,
    overflow: 'hidden',
  },
  
  // Red date below company name
  companyDate: {
    fontSize: 14,
    color: '#EE0000',
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
  
  // Left column with main image (45% width)
  page2LeftColumn: {
    width: '45%',
    position: 'relative',
    height: '90%', // Changed to 90%
    padding: 0,
  },
  
  // Main image in left column (90% height)
  page2MainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  // Right column with text content (55% width)
  page2RightColumn: {
    width: '55%',
    padding: '40px 40px 100px 40px',
    flexDirection: 'column',
    height: '90%', // Changed to 90%
    backgroundColor: 'white',
  },
  
  // Page title styling - dark blue
  page2Title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172342',
    marginBottom: 20,
    textAlign: 'left',
  },
  
  // Page 4 title styling - dark blue
  page4Title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172342',
    marginBottom: 15,
    textAlign: 'left',
  },
 
  // Page 4 header title styling - white text
  page4HeaderTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  
  // Page 5 header text - dark blue with header font size
  page5HeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172342',
    marginBottom: 15,
    textAlign: 'left',
  },

  // Page 5 new layout styles
  page5NewMainContainer: {
    flexDirection: 'row',
    height: '100%',
    padding: 20,
  },

  // Left section - 55% width
  page5NewLeftSection: {
    width: '55%',
    paddingRight: 20,
    flexDirection: 'column',
  },

  // Right section - 45% width
  page5NewRightSection: {
    width: '45%',
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section 1 heading style - dark blue, larger font
  page5Section1Heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172342', // Dark blue
    lineHeight: 1.4,
    marginBottom: 20,
    marginTop: 20,
  },

  // Section 2 text - normal paragraph
  page5Section2Text: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#374151',
    textAlign: 'justify',
  },

  // Section image in right column
  page5SectionImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '80%',
    objectFit: 'contain',
  },
  
  // Text content paragraphs - dark grey, font-size 10px
  page2TextContent: {
    fontSize: 10, // Changed from 12 to 10px
    lineHeight: 1.5,
    color: '#4b5563', // Dark grey
    textAlign: 'justify' as const,
    marginBottom: 10,
  },

  headerLogo: {
    position: 'absolute' as const,
    top: 15,
    right: 25,
    width: 60,
    height: 40,
    objectFit: 'contain' as const,
  },

  page2Paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    color: '#4b5563', // Dark grey
    textAlign: 'justify' as const,
    marginBottom: 10,
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
    height: 56.69, // Changed to match footer template height
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 15, // Higher z-index to ensure visibility
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
    color: '#0281BD',
    marginRight: 8,
  },
  
  // Corporate Finance text
  page2FooterText: {
    fontSize: 14,
    color: '#0281BD',
  },
  
  // Footer right section with page number
  page2FooterRight: {
    flexDirection: 'row',
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
    width: 2,
    height: 20,
    backgroundColor: '#0281BD',
    marginRight: 10,
  },
  
  // Page number text
  page2PageNumberText: {
    fontSize: 18,
    color: '#0281BD',
    fontWeight: 'bold',
  },
  
  // FBM logo text
  fbmLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0281BD',
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#15375f',
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
    border: '2 solid #0281BD',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  
  // Large highlight values
  highlightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EE0000',
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
    color: '#EE0000',
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
    color: '#EE0000',
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
    backgroundColor: '#15375f',
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
    color: '#EE0000',
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
    color: '#0281BD',
    marginBottom: 3,
  },
  
  websiteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0281BD',
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
  
  // ========== PAGE 3 STYLES ==========
  
  // Page 3 header
  page3Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  page3HeaderLeft: {
    width: 40,
    height: 40,
    backgroundColor: '#0281BD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  page3PageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  page3HeaderCenter: {
    backgroundColor: '#172342', // Dark blue background
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: '50%', // Maximum width to middle of page
  },

  page3PageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  page3HeaderRight: {
    flex: 1,
    marginLeft: 20,
  },

  page3HeaderText: {
    fontSize: 14,
    color: '#374151',
  },

  page3Number: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  page3HeaderNumber: {
    width: 40,
    height: 40,
    backgroundColor: '#0281BD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  page3HeaderTitle: {
    backgroundColor: '#172342', // Dark blue background
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: '50%', // Maximum width to middle of page
  },

  page3Title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Main content layout
  page3MainContent: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 80, // Increased margin to ensure footer visibility
  },
  
  page3LeftColumn: {
    width: '45%',
    paddingRight: 15, // Reduced padding
  },
  
  page3RightColumn: {
    width: '45%',
    paddingLeft: 15, // Reduced padding
  },
  
  page3Separator: {
    width: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8, // Reduced margin
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  
  page3ColumnTitle: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    color: '#172342', // Dark blue
    marginBottom: 14, // Changed to 14px as requested
    textDecoration: 'underline',
  },
  
  // Data list styles
  page3DataList: {
    marginBottom: 15, // Reduced margin
  },
  
  page3DataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    borderBottom: '0.5 solid #F3F4F6',
  },
  
  page3Label: {
    fontSize: 9, // Reduced font size
    color: '#374151',
    flex: 1,
  },
  
  page3Value: {
    fontSize: 9, // Reduced font size
    color: '#EE0000',
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 10,
  },
  
  // Images section
  page3Images: {
    flexDirection: 'row',
    gap: 8, // Reduced gap
    marginTop: 8, // Reduced margin
  },
  
  page3Image: {
    width: '100%', // Full width of left section
    height: 100, // Larger size
    borderRadius: 6,
    objectFit: 'cover',
  },
  
  // Metrics section - 2x2 grid layout
  page3MetricsContainer: {
    marginBottom: 12,
  },
  
  page3MetricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  
  page3MetricBox: {
    backgroundColor: '#F8FAFC',
    padding: 8, // Reduced padding
    borderRadius: 6,
    alignItems: 'center',
    width: '48%', // Two boxes per row
    minHeight: 60, // Consistent height
  },
  
  page3MetricBoxLarge: {
    backgroundColor: '#F8FAFC',
    padding: 10, // Reduced padding
    borderRadius: 6,
    alignItems: 'center',
    width: '100%', // Full width for large box
    marginTop: 8,
  },
  
  page3MetricValue: {
    fontSize: 20, // Larger font size
    fontWeight: 'bold',
    color: '#EE0000', // Red color
    marginBottom: 3,
  },
  
  page3MetricValueLarge: {
    fontSize: 22, // Reduced font size
    fontWeight: 'bold',
    color: '#EE0000',
    marginBottom: 3, // Reduced margin
  },
  
  page3MetricLabel: {
    fontSize: 10, // Reduced font size
    color: '#374151',
    marginBottom: 2,
    textAlign: 'center',
  },
  
  page3MetricLabelLarge: {
    fontSize: 12, // Reduced font size
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 3, // Reduced margin
  },
  
  page3MetricDate: {
    fontSize: 10, // Reduced font size
    color: '#EE0000',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  
  page3MetricSubtext: {
    fontSize: 8, // Reduced font size
    color: '#6B7280',
    textAlign: 'center',
  },
  
  page3MultiplierContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  
  page3MultiplierValue: {
    fontSize: 16, // Reduced font size
    fontWeight: 'bold',
    color: '#EE0000',
  },
  
  page3MultiplierText: {
    fontSize: 12, // Reduced font size
    color: '#0281BD',
  },
  
  // Disclaimer
  page3Disclaimer: {
    fontSize: 8, // Reduced font size
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10, // Reduced margin
    lineHeight: 1.2, // Reduced line height
    fontStyle: 'italic',
  },

  // Dark blue dotted line after disclaimer
  page3DisclaimerDottedLine: {
    borderTopWidth: 2,
    borderTopColor: '#172342',
    borderStyle: 'dotted',
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
  
  // Chart section
  page3ChartContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12, // Reduced padding
    borderRadius: 8,
  },

  // Spacing after "Indicatieve bandbreedte" title  
  page3SpacingAfterTitle: {
    height: 15,
  },
  
  page3ChartTitle: {
    fontSize: 12, // Reduced font size
    fontWeight: 'bold',
    color: '#0281BD',
    marginBottom: 10, // Reduced margin
    textAlign: 'center',
  },
  
  page3Chart: {
    height: 120, // Larger height
    position: 'relative',
  },
  
  page3ChartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80, // Reduced height
    paddingHorizontal: 10,
    borderBottomWidth: 3, // Added thick dark blue line under bars
    borderBottomColor: '#172342',
  },
  
  page3ChartBar1: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  page3ChartBar2: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  page3ChartBar3: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  page3Bar1: {
    width: 40,
    height: 50,
    backgroundColor: '#0281BD', // Blue color matching design
    marginBottom: 8,
    borderRadius: 2,
  },

  page3Bar2: {
    width: 40,
    height: 65,
    backgroundColor: '#BCE9FF', // Lighter blue
    marginBottom: 8,
    borderRadius: 2,
  },

  page3Bar3: {
    width: 40,
    height: 80,
    backgroundColor: '#15375f', // Darker blue
    marginBottom: 8,
    borderRadius: 2,
  },
  
  page3BarValue: {
    fontSize: 12, // Increased from 8 to 12
    color: '#EE0000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  page3ChartBaseline: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#9CA3AF',
  },
  
  // Results grid for 2x2 layout
  page3ResultsGrid: {
    flexDirection: 'column',
    marginTop: 20,
  },
  
  page3GridRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  page3GridBlock: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 8,
    borderLeft: '3 solid #3B82F6',
    alignItems: 'center',
  },
  
  page3GridLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  page3GridValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  
  // Page 3 footer dotted line
  page3DottedLine: {
    width: 40,
    height: 1,
    borderTop: '1 dotted #6B7280',
    marginBottom: 8,
  },
  
  page3PageNumberText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  
  // Footer
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
    borderTop: '1 solid #E5E7EB',
  },
  
  page3FooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  page3FooterLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginRight: 8,
  },
  
  page3FooterText: {
    fontSize: 12,
    color: '#2563EB',
  },
  
  page3FooterRight: {
    alignItems: 'center',
  },
  
  page3FooterDots: {
    width: 40,
    height: 1,
    borderTop: '1 dotted #6B7280',
    marginBottom: 8,
  },
  
  page3FooterPageNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  // ========== PAGE 4 STYLES ==========
  
  // Page 4 header
  page4Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingTop: 24, // 0.8cm top margin
    marginLeft: 42, // 1.5cm left margin
  },
  
  page4HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: '#0281BD',
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
    backgroundColor: '#172342', // Dark blue background
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '50%', // Maximum width to middle of page
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
    paddingTop: 56, // 2cm down for right image
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
    paddingTop: 24, // 0.8cm top margin
    marginLeft: 42, // 1.5cm left margin
  },
  
  page5HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: '#0281BD',
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
    backgroundColor: '#172342', // Dark blue background
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
    fontSize: 12, // Keep at 12px
    lineHeight: 1.4, // Tighter line height
    color: '#4b5563', // Changed to dark gray
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

  // Page 6 new styles for full background layout
  page6FullBackground: {
    position: 'absolute',
    top: '10%', // 10% header space
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '90%',
  },
  
  page6FullBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  page6TitleOverlay: {
    position: 'absolute',
    top: '12%',
    left: 40,
    right: 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    zIndex: 10,
  },
  
  page6WhiteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#172342',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  page6Section1Text: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  
  page6BottomText: {
    position: 'absolute',
    bottom: 60,
    left: '25%', // 25% left margin
    right: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 6,
  },
  
  page6Section2Text: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.4,
  },

  // Add missing styles for the requested changes
  page3HorizontalDottedLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#172342', // Dark blue
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 1,
  },

  page3FooterLogoImage: {
    width: 50,
    height: 30,
    objectFit: 'contain',
  },

  page4HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 24, // 0.8cm top margin
    marginLeft: 20, // 0.7cm left margin (changed from 1.5cm)
  },

  page4Content: {
    flex: 1,
    paddingHorizontal: 40,
  },

  page4ImageMoved: {
    width: 350,
    height: 300,
    borderRadius: 12,
    objectFit: 'cover',
    marginTop: 56, // 2cm down
  },

  page4RightSection: {
    width: '50%',
    paddingLeft: 30,
    alignItems: 'center',
  },

  page5HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 24, // 0.8cm top margin
    marginLeft: 20, // 0.7cm left margin (changed from 1.5cm)
  },

  page5FooterLogoImage: {
    width: 50,
    height: 30,
    objectFit: 'contain',
  },

  page5PageNumberBoxWider: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20, // Wider than original
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 70, // Wider than original
    alignItems: 'center',
    justifyContent: 'center',
  },
});