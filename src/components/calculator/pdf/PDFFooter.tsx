import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { StyleSheet } from '@react-pdf/renderer';

interface FooterConfig {
  height: string;
  backgroundColor: string;
  logoPosition: 'left' | 'center' | 'right';
  logoMaxWidth: number;
  logoMaxHeight: number;
  pageNumberPosition: 'left' | 'center' | 'right';
  pageNumberStyle: {
    backgroundColor: string;
    borderRadius: number;
    width: string;
    height: string;
    color: string;
    fontSize: number;
    fontWeight: string;
  };
  dottedLineStyle: {
    color: string;
    width: number;
    height: number;
    marginRight: number;
  };
}

interface PDFFooterProps {
  pageNumber: number;
  logoUrl?: string;
  config: FooterConfig;
  isEnabled?: boolean;
}

const createFooterStyles = (config: FooterConfig) => StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: config.height,
    backgroundColor: config.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  logoContainer: {
    flex: config.logoPosition === 'center' ? 1 : 0,
    alignItems: config.logoPosition === 'left' ? 'flex-start' : config.logoPosition === 'center' ? 'center' : 'flex-end',
  },
  logo: {
    maxWidth: config.logoMaxWidth,
    maxHeight: config.logoMaxHeight,
  },
  pageNumberContainer: {
    flex: config.pageNumberPosition === 'center' ? 1 : 0,
    alignItems: config.pageNumberPosition === 'left' ? 'flex-start' : config.pageNumberPosition === 'center' ? 'center' : 'flex-end',
    flexDirection: 'row',
  },
  pageNumberBox: {
    backgroundColor: config.pageNumberStyle.backgroundColor,
    borderRadius: config.pageNumberStyle.borderRadius,
    width: config.pageNumberStyle.width,
    height: config.pageNumberStyle.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dottedLine: {
    width: config.dottedLineStyle.width,
    height: config.dottedLineStyle.height,
    backgroundColor: config.dottedLineStyle.color,
    marginRight: config.dottedLineStyle.marginRight,
  },
  pageNumberText: {
    color: config.pageNumberStyle.color === '#374151' ? '#374151' : config.pageNumberStyle.color,
    fontSize: config.pageNumberStyle.fontSize,
    fontWeight: config.pageNumberStyle.fontWeight === 'bold' ? 700 : 400,
  },
  spacer: {
    flex: 1,
  },
});

const PDFFooter: React.FC<PDFFooterProps> = ({ 
  pageNumber, 
  logoUrl, 
  config, 
  isEnabled = true 
}) => {
  console.log(`🦶 PDFFooter called for page ${pageNumber}, isEnabled: ${isEnabled}`);
  console.log(`🦶 PDFFooter config:`, config);
  console.log(`🦶 PDFFooter logoUrl:`, logoUrl);
  
  if (!isEnabled) {
    console.log(`🦶 PDFFooter disabled for page ${pageNumber}`);
    return null;
  }

  const styles = createFooterStyles(config);

  const renderLogo = () => {
    console.log(`🖼️ Rendering logo for page ${pageNumber}, logoUrl:`, logoUrl);
    if (!logoUrl) {
      console.log(`❌ No logoUrl provided for page ${pageNumber}`);
      return null;
    }
    
    try {
      console.log(`✅ Successfully rendering logo for page ${pageNumber}`);
      return (
        <View style={styles.logoContainer}>
          <Image src={logoUrl} style={styles.logo} />
        </View>
      );
    } catch (error) {
      console.warn('❌ Failed to load footer logo:', logoUrl, error);
      return null;
    }
  };

  const renderPageNumber = () => (
    <View style={styles.pageNumberContainer}>
      <View style={styles.pageNumberBox}>
        <View style={styles.dottedLine} />
        <Text style={styles.pageNumberText}>{pageNumber}</Text>
      </View>
    </View>
  );

  console.log(`🎨 Footer layout for page ${pageNumber}: logoPosition=${config.logoPosition}, pageNumberPosition=${config.pageNumberPosition}`);
  
  return (
    <View style={styles.footer}>
      {/* Left side - logo or spacer */}
      {config.logoPosition === 'left' ? (
        renderLogo()
      ) : config.pageNumberPosition === 'left' ? (
        renderPageNumber()
      ) : (
        <View style={styles.spacer} />
      )}
      
      {/* Center - logo if centered */}
      {config.logoPosition === 'center' && renderLogo()}
      
      {/* Right side - page number or spacer */}
      {config.pageNumberPosition === 'right' ? (
        renderPageNumber()
      ) : config.logoPosition === 'right' ? (
        renderLogo()
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

export default PDFFooter;