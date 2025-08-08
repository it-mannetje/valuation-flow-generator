import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer';
import { CompanyData, ContactData, ValuationResult } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculator';

// Placeholder for images - replace with actual image URLs when available
const coverBackground = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjI0Ij5Db3ZlciBCYWNrZ3JvdW5kPC90ZXh0Pgo8L3N2Zz4K';
const fbmLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUU0MEFGIiByeD0iMTAiLz4KPHR5cGUgdGV4dC1hbmNob3I9Im1pZGRsZSIgeD0iNDAiIHk9IjQ1IiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCI+ZmJtPC90ZXh0Pgo8L3N2Zz4K';

// Register a font if needed
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    position: 'relative',
    minHeight: '100%',
    padding: 0,
  },
  coverBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: '2 solid #E5E7EB',
  },
  coverHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  coverHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#1E40AF',
    padding: '8 16',
    borderRadius: 8,
    marginRight: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  confidential: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  fbmLogo: {
    width: 80,
    height: 80,
  },
  coverTitle: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  companyNameCover: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20 40',
    borderRadius: 10,
  },
  dateCover: {
    fontSize: 18,
    color: '#DC2626',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10 20',
    borderRadius: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#1E40AF',
    color: '#ffffff',
    padding: '10 20',
    borderRadius: 5,
    marginBottom: 20,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'justify',
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1 solid #E5E7EB',
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  highlightBox: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    border: '2 solid #3B82F6',
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 10,
  },
  highlightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
  },
  rangeText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 8,
    border: '1 solid #F59E0B',
    marginTop: 30,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#92400E',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTop: '1 solid #E5E7EB',
  },
  footerText: {
    fontSize: 10,
    color: '#6B7280',
  },
  contactInfo: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 11,
    color: '#ffffff',
    lineHeight: 1.6,
    marginBottom: 15,
  },
  contactDetails: {
    marginTop: 15,
  },
  contactDetailText: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 3,
  }
});

interface ValuationReportPDFProps {
  companyData: CompanyData;
  contactData: ContactData;
  valuationResult: ValuationResult;
}

const ValuationReportPDF: React.FC<ValuationReportPDFProps> = ({
  companyData,
  contactData,
  valuationResult
}) => {
  const estimatedEbitda = (companyData.result2024 + companyData.expectedResult2025) / 2;
  const currentDate = new Date().toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" orientation="landscape" style={styles.coverPage}>
        <Image src={coverBackground} style={styles.coverBackground} />
        <View style={styles.coverOverlay} />
        
        <View style={styles.coverHeader}>
          <View style={styles.coverHeaderLeft}>
            <Text style={styles.reportTitle}>Rapport waardebepaling</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
          <Text style={styles.confidential}>STRICTLY CONFIDENTIAL</Text>
        </View>
        
        <View style={styles.coverTitle}>
          <Text style={styles.companyNameCover}>[{contactData.companyName}]</Text>
          <Text style={styles.dateCover}>[{currentDate}]</Text>
        </View>
        
        <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
          <Image src={fbmLogo} style={styles.fbmLogo} />
        </View>
      </Page>

      {/* Foreword Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>fbm</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voorwoord</Text>
          
          <Text style={styles.text}>
            Ondernemers bezitten een, relatief gesproken, vaak zeer belangrijke bezit onder h
            hun bedrijf. Corporate Finance begeleidt we al jaren onder andere bij zakelijke bij
            waardering van het bedrijf tot aan de verkoop van de onderneming. Vanuit onze
            kennis komen we regelmatig vragen tegen waarbij men meer inzicht wil berekenen
            waarde van een onderneming. Overigens kan een bedrijfswaarding ook interessant
            zijn tegen financiering en financiele gebeurtenissen. Dit alles heeft ons gebracht
            deze interessante belastingskenner.
          </Text>
          
          <Text style={styles.text}>
            Een afgedreven toebehoren breg en daargemene aspecten hebben van ondergeveren op de
            waardering van de onderneming. Denk dan aan bedrijf/waardering, marktkoers,
            financidering, bestuursvoordeling en beste financiele rekeringen. Ons team van experts
            uitgebreide boekhouding ervaren mensen. Leds heeft met het perspectief van de beurs
            naar een onderneming in ontwikkeling. Het bereik van de vragen kan daarbij breed
            zijn of als dit onderneming wordt geëvalueerd.
            
            We zijn trots op onze dit een aangewezen positie en opgevogen ristiche adviseur over meer
            dan 500 ondernemers verschillende voorkomende. Of het nu gaat om bestemseling,
            bedrijfswatering, fusie of acquisitie, onze klant kan rekenen op de inzet van ons
            ervaren team. 
          </Text>
          
          <Text style={styles.text}>
            UNU Corporate Finance is gehouden aan een indicatieve van het bedrijf. Voor een
            standaardwaarbeheren, niet berekenen gebaseerd deze exacte lijken dan de cijfers.
            Graag maken we keens en geen als we samen het gebruik van legaliteitsregels en afwolf
            de complete bedrijfswadering naar een niveau brengen.
          </Text>
          
          <Text style={styles.text}>Hertelijke groet,</Text>
          <Text style={styles.boldText}>
            Pieter Waerland{'\n'}
            Namens het team van FBM Corporate Finance
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>2</Text>
        </View>
      </Page>

      {/* Calculation Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>fbm</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Indicatieve calculatie</Text>
          
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridTitle}>Ingevoerde gegevens</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Omzet in het afgelopen jaar</Text>
                <Text style={styles.value}>{formatCurrency(companyData.lastYearRevenue)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Resultaat vorig boekjaar</Text>
                <Text style={styles.value}>{formatCurrency(companyData.result2024)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Verwacht resultaat dit boekjaar</Text>
                <Text style={styles.value}>{formatCurrency(companyData.expectedResult2025)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Verlies in de afgelopen 3 jaar</Text>
                <Text style={styles.value}>{companyData.wasLossmaking ? 'Ja' : 'Nee'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Vooruitzichten</Text>
                <Text style={[styles.value, { color: companyData.prospects === 'negatief' ? '#DC2626' : companyData.prospects === 'positief' ? '#059669' : '#F59E0B' }]}>
                  {companyData.prospects}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Gemiddelde investering per jaar</Text>
                <Text style={styles.value}>{formatCurrency(companyData.averageYearlyInvestment)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Sector</Text>
                <Text style={styles.value}>{valuationResult.sector}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Aantal FTE medewerkers</Text>
                <Text style={styles.value}>{companyData.employeesDisplay || companyData.employees}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Omzet via de grootste klant</Text>
                <Text style={styles.value}>{companyData.largestClientDependencyDisplay || `${companyData.largestClientDependency}%`}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Afhankelijkheid van grootste toeleverancier</Text>
                <Text style={styles.value}>{companyData.largestSupplierRisk}</Text>
              </View>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={styles.gridTitle}>Belangrijkste uitgangspunten</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>€ {Math.round(estimatedEbitda / 1000)},500</Text>
                <Text style={styles.rangeText}>EBITDA (Adjusted)</Text>
                <Text style={styles.rangeText}>{currentDate}</Text>
                <Text style={styles.rangeText}>Waarderingsmoment</Text>
              </View>
              
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>€ {Math.round(valuationResult.baseValuation / 1000)},000</Text>
                <Text style={styles.rangeText}>Ondernemingswaarde</Text>
                <Text style={styles.boldText}>{valuationResult.multiple.toFixed(1)} x EBITDA</Text>
                <Text style={styles.rangeText}>Multiple en EBITDA</Text>
              </View>
              
              <Text style={styles.text}>
                Dit is een indicatieve waardering op basis van een aantal gestandaardiseerde uitgangspunten.
                Neem contact met ons op de exacte waarde van jouw bedrijf te bepalen.
              </Text>
            </View>
          </View>
          
          <Text style={styles.boldText}>Indicatieve bandbreedte</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.highlightValue}>€ {Math.round(valuationResult.minValuation / 1000)},750</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.highlightValue}>€ {Math.round(valuationResult.baseValuation / 1000)},000</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.highlightValue}>€ {Math.round(valuationResult.maxValuation / 1000)},250</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>3</Text>
        </View>
      </Page>

      {/* Sector Information Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>fbm</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Overnames in de {valuationResult.sector} Sector</Text>
          
          <Text style={styles.boldText}>
            De overnamesmarkt in de Nederlandse {valuationResult.sector.toLowerCase()}-sector 
            is in 2025 voorspoedig en volop in beweging...
          </Text>
          
          <Text style={styles.text}>
            Het aantal transacties blijft toenemen en de waarderingen van succesvolle bedrijven echter
            overnames. Zowel strategische kopers als private equity-partijen tonen
            belangstelling, innovatieverhoudingsveld en gestationeerde teams. Vooral bedrijven met
            terugkerende inkomsten, een duidelijk nichtemarkt en technologische voorsprong
            blijven succesvol.
          </Text>
          
          <Text style={styles.text}>
            Hoewel het aantal gegadelde lists is gedaald, blijft de totale dealactiviteit staan bij
            een significant mogelijk van 2024. De waarderingen zijn over het algemeen hoog,
            met name voor winstgevende IT-bedrijven in grootfactorgebonden zoals managed
            services, softwareontwikkeling en data-analyse. De aankomende kopers zijn
            gehollandeerd naar overname bovenden en algemeen betekenend afbonden voor
            autonome trend.
          </Text>
          
          <Text style={styles.text}>
            Consolidatie is zichtbaar in onder andere IT consulting, infrastructuur en security,
            waar grotere spelers kleinere gespecialiseerde bedrijven integreren. Private equity
            blijft een belangrijke factor en tech-strategieën, waarmee portfoliobedrijven hun
            marktaandeel vergroten. De verwachting is dat deze trend zich de rest van het jaar zal
            voortzetten.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>4</Text>
        </View>
      </Page>

      {/* Business Valuation Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>fbm</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Bedrijfswaardering</Text>
          
          <Text style={styles.boldText}>Essentieel voor elke groeifase en strategische keuze.</Text>
          
          <Text style={styles.text}>
            Veel bedrijf doek in een van de boekjef verkapgen af koop of de koms kan en onder beeff af
            de tegen. Zeker dan is een bedrijfswaatdering zowelcertus als geeft af nomin in hersteh
            voeden ten koze.
          </Text>
          
          <Text style={styles.text}>
            Maar naast bedrijfsverkoof of winmee dag er ook op en andere situaties waarbij een
            waardering is verkweren, zo als bedrijf een bedrijfs kunnen zijn.
          </Text>
          
          <Text style={styles.text}>
            Het gaat ja duidelijk inzicht in welke factoren waarden bepalen zijn van namelijke cruciale
            componenten waarbij we bedrijfsmake belegenhantig hebben oed ondernemers of ook van uit
            onverbloofd hebben onderneming. U steun verstreven zijn wezenlijk onstructuzed en
            praktische bakdew ondernemingen.
          </Text>
          
          <Text style={styles.text}>
            Bedrijfswaerdering is een vak apart. Door en jaren waardexpeculatuegen op allen
            sterenslaart tussen Valuup aan de KBM Europe of FMA Business School en an de
            Register Valuators (RV) aangesloten bij de branch/organisatie het Nederlands Instituut voor
            Register Valuators (NIRV).
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>5</Text>
        </View>
      </Page>

      {/* Next Steps Page */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>fbm</Text>
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>The next step</Text>
          
          <Text style={styles.contactText}>
            Bent u op zoek naar een goede adviseur die adviseert, prakach en realisten is en de
            beste oplossing kan formuleren in het verkoper van uw bedrijf? Of wilt u een
            professionele waardering laten maken van jouw bedrijf? Uitgenodigd door een
            madewerken/financiële of financieringsopdrode?
          </Text>
          
          <Text style={styles.contactText}>
            Neem dan contact met ons op. Wij helpen u graag.
          </Text>
          
          <View style={styles.contactDetails}>
            <Text style={styles.contactDetailText}>FBM Corporate Finance</Text>
            <Text style={styles.contactDetailText}>Hoest Suit 62</Text>
            <Text style={styles.contactDetailText}>3439 MK Nieuwegein</Text>
            <Text style={styles.contactDetailText}>Telefon: 030 - 605 22 22</Text>
            <Text style={styles.contactDetailText}>+31 6 1088 4566</Text>
            <Text style={styles.contactDetailText}>KvK: 30207504</Text>
          </View>
          
          <Text style={styles.contactText}>www.fbm.nl</Text>
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Belangrijke Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Deze waardering is een indicatie gebaseerd op bedrijfsresultaten en sectorgemiddelden. 
            De werkelijke waarde van uw bedrijf kan afwijken door factoren zoals marktpositie, 
            groeiperspectieven, activa, schulden en marktontwikkelingen. Voor een definitieve 
            waardering adviseren wij een professionele due diligence.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>6</Text>
        </View>
      </Page>
    </Document>
  );
};

export const generatePDF = async (
  companyData: CompanyData,
  contactData: ContactData,
  valuationResult: ValuationResult
) => {
  const blob = await pdf(
    <ValuationReportPDF 
      companyData={companyData}
      contactData={contactData}
      valuationResult={valuationResult}
    />
  ).toBlob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bedrijfswaardering-${contactData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default ValuationReportPDF;