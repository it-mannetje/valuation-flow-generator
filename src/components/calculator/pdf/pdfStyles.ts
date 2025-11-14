import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  // Base page styles - A4 portrait, no margins/padding
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
    margin: 0,
    size: "A4",
    fontFamily: "Helvetica",
    position: "relative",
    width: "100%",
    height: "100%",
  },

  // Background image for pages 1, 2, and 5 - full page, no margins
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    zIndex: 0,
  },

  // Single content section for all pages
  content: {
    position: "relative",
    padding: 0,
    margin: 0,
    minHeight: "100%",
    zIndex: 2,
  },

  // ========== PAGE 1 & 2 LEGACY STYLES (for AdminPreviewPDF compatibility) ==========
  
  coverMainContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  coverImageSection: {
    width: "100%",
    height: "100%",
    padding: 0,
    position: "relative",
  },

  coverMainImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  page2Layout: {
    flexDirection: "row",
    height: "100%",
    position: "relative",
    padding: 0,
  },

  page2LeftColumn: {
    width: "100%",
    height: "100%",
    padding: 0,
  },

  page2MainImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172342",
    marginBottom: 15,
  },

  forewordText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },

  page2Paragraph: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },

  page3ResultsGrid: {
    flexDirection: "column",
    marginTop: 20,
  },

  page3GridRow: {
    flexDirection: "row",
    marginBottom: 15,
  },

  page3GridBlock: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 8,
    borderLeft: "3 solid #3B82F6",
    alignItems: "center",
  },

  page3GridLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },

  page3GridValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },

  page3MetricsContainer: {
    marginBottom: 12,
  },

  page3HorizontalDottedLine: {
    borderTopWidth: 2,
    borderTopColor: "#172342",
    borderStyle: "dotted",
    marginVertical: 16,
    width: "100%",
  },

  page3ChartContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
  },

  page3SpacingAfterTitle: {
    height: 15,
  },

  page3Chart: {
    height: 120,
    position: "relative",
  },

  page4SectorNameBlue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0281BD",
    marginBottom: 15,
    textAlign: "left",
  },

  page6FullBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  page6FullBackgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  page6BottomText: {
    position: "absolute",
    bottom: 60,
    left: 40,
    right: 40,
    zIndex: 2,
  },

  page6Section2Text: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },

  // ========== PAGE 3 STYLES (Calculation Results) ==========
  
  page3Header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  page3HeaderNumber: {
    width: 40,
    height: 40,
    backgroundColor: "#0281BD",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  page3Number: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  page3HeaderTitle: {
    backgroundColor: "#172342",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: "50%",
  },

  page3Title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  page3MainContent: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 40,
    marginBottom: 80,
  },

  page3LeftColumn: {
    width: "45%",
    paddingRight: 15,
  },

  page3RightColumn: {
    width: "45%",
    paddingLeft: 15,
  },

  page3Separator: {
    width: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "#9CA3AF",
  },

  page3ColumnTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#172342",
    marginBottom: 14,
    textDecoration: "underline",
  },

  page3DataList: {
    marginBottom: 15,
  },

  page3DataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    borderBottom: "0.5 solid #F3F4F6",
  },

  page3Label: {
    fontSize: 9,
    color: "#374151",
    flex: 1,
  },

  page3Value: {
    fontSize: 9,
    color: "#EE0000",
    fontWeight: "bold",
    textAlign: "right",
    marginLeft: 10,
  },

  page3Images: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 5,
  },

  page3Image: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    objectFit: "cover",
  },

  page3MetricsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    justifyContent: "space-between",
  },

  page3MetricBox: {
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    width: "48%",
    minHeight: 60,
  },

  page3MetricBoxLarge: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },

  page3MetricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EE0000",
    marginBottom: 3,
  },

  page3MetricValueLarge: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EE0000",
    marginBottom: 3,
  },

  page3MetricLabel: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 2,
    textAlign: "center",
  },

  page3MetricLabelLarge: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "bold",
    marginBottom: 3,
  },

  page3MetricDate: {
    fontSize: 10,
    color: "#EE0000",
    fontWeight: "bold",
    marginBottom: 2,
  },

  page3MetricSubtext: {
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },

  page3MultiplierContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },

  page3MultiplierValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EE0000",
  },

  page3MultiplierText: {
    fontSize: 12,
    color: "#0281BD",
  },

  page3Disclaimer: {
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 1.2,
    fontStyle: "italic",
  },

  page3DisclaimerDottedLine: {
    borderTopWidth: 2,
    borderTopColor: "#172342",
    borderStyle: "dotted",
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
  },

  page3ChartTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0281BD",
    marginBottom: 10,
    textAlign: "center",
  },

  page3ChartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#172342",
  },

  page3ChartBar1: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },

  page3ChartBar2: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },

  page3ChartBar3: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },

  page3Bar1: {
    width: 40,
    height: 50,
    backgroundColor: "#0281BD",
    marginBottom: 8,
    borderRadius: 2,
  },

  page3Bar2: {
    width: 40,
    height: 65,
    backgroundColor: "#BCE9FF",
    marginBottom: 8,
    borderRadius: 2,
  },

  page3Bar3: {
    width: 40,
    height: 80,
    backgroundColor: "#15375f",
    marginBottom: 8,
    borderRadius: 2,
  },

  page3BarValue: {
    fontSize: 10,
    color: "#EE0000",
    fontWeight: "bold",
    textAlign: "center",
  },

  page3Footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    borderTop: "1 solid #E5E7EB",
  },

  page3FooterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  page3FooterLogo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
    marginRight: 8,
  },

  page3FooterText: {
    fontSize: 12,
    color: "#2563EB",
  },

  page3FooterRight: {
    alignItems: "center",
  },

  page3FooterDots: {
    width: 40,
    height: 1,
    borderTop: "1 dotted #6B7280",
    marginBottom: 8,
  },

  page3FooterPageNumber: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "bold",
  },

  // ========== PAGE 4 STYLES ==========
  
  page4Header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  page4HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: "#0281BD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  page4Number: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  page4HeaderTitle: {
    backgroundColor: "#172342",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: "50%",
  },

  page4HeaderTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "left",
  },

  page4MainContent: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 40,
    marginBottom: 80,
  },

  page4LeftColumn: {
    width: "50%",
    paddingRight: 30,
  },

  page4RightColumn: {
    width: "50%",
    paddingLeft: 30,
    alignItems: "center",
    paddingTop: 56,
  },

  page4Title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#172342",
    marginBottom: 15,
    textAlign: "left",
  },

  page4ContentText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },

  page4SectionImage: {
    width: "100%",
    height: "auto",
    maxHeight: "70%",
    objectFit: "contain",
  },

  page4Footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    borderTop: "1 solid #E5E7EB",
  },

  page4FooterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  page4FooterLogo: {
    width: 100,
    height: 40,
  },

  page4FooterLogoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginRight: 8,
  },

  page4FooterText: {
    fontSize: 14,
    color: "#2563EB",
  },

  page4FooterRight: {
    alignItems: "center",
  },

  page4FooterDots: {
    width: 40,
    height: 1,
    borderTop: "1 dotted #6B7280",
    marginBottom: 8,
  },

  page4FooterPageNumber: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "bold",
  },

  // ========== PAGE 6 STYLES ==========
  
  page6Header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  page6HeaderNumber: {
    width: 50,
    height: 50,
    backgroundColor: "#0281BD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },

  page6Number: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  page6HeaderTitle: {
    backgroundColor: "#172342",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: "50%",
  },

  page6HeaderTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  page6MainContent: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 40,
    marginBottom: 80,
  },

  page6LeftColumn: {
    width: "50%",
    paddingRight: 30,
  },

  page6RightColumn: {
    width: "50%",
    paddingLeft: 30,
    alignItems: "center",
    paddingTop: 56,
  },

  page6Title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 20,
  },

  page6ContentText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#374151",
    marginBottom: 12,
    textAlign: "justify",
  },

  page6SectionImage: {
    width: "100%",
    height: "auto",
    maxHeight: "70%",
    objectFit: "contain",
  },

  page6Footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    borderTop: "1 solid #E5E7EB",
  },

  page6FooterLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  page6FooterLogo: {
    width: 100,
    height: 40,
  },

  page6FooterLogoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginRight: 8,
  },

  page6FooterText: {
    fontSize: 14,
    color: "#2563EB",
  },

  page6FooterRight: {
    alignItems: "center",
  },

  page6FooterDots: {
    width: 40,
    height: 1,
    borderTop: "1 dotted #6B7280",
    marginBottom: 8,
  },

  page6FooterPageNumber: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "bold",
  },

  // ========== FOOTER COMPONENTS ==========
  
  footerLogo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
});



.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  min-height: 100vh;
  position: relative;
}

.left-panel {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
}

.panel-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
}

.monitor-icon {
  width: 48px;
  height: 48px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #9e9e9e;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  margin: 0;
  text-align: center;
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.data-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.data-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.data-label {
  font-size: 11px;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.data-value {
  font-size: 18px;
  font-weight: 700;
  color: #1976d2;
  line-height: 1.4;
}

.data-value.highlight {
  color: #1976d2;
  font-weight: 700;
}

.left-image-section {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.business-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.fbm-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 20px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 6px;
  position: relative;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-fbm {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
  line-height: 1.2;
}

.logo-finance {
  font-size: 12px;
  font-weight: 400;
  color: #757575;
  line-height: 1.2;
}