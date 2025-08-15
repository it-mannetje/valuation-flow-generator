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
    color: config.pageNumberStyle.color,
    fontSize: config.pageNumberStyle.fontSize,
    fontWeight: config.pageNumberStyle.fontWeight,
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
  if (!isEnabled) return null;

  const styles = createFooterStyles(config);

  const renderLogo = () => {
    if (!logoUrl) return null;
    
    try {
      return (
        <View style={styles.logoContainer}>
          <Image src={logoUrl} style={styles.logo} />
        </View>
      );
    } catch (error) {
      console.warn('Failed to load footer logo:', logoUrl, error);
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

  return (
    <View style={styles.footer}>
      {config.logoPosition === 'left' && renderLogo()}
      {config.logoPosition === 'center' && <View style={styles.spacer} />}
      {config.logoPosition === 'center' && renderLogo()}
      {config.pageNumberPosition === 'center' && <View style={styles.spacer} />}
      {config.pageNumberPosition === 'right' && <View style={styles.spacer} />}
      {renderPageNumber()}
    </View>
  );
};

export default PDFFooter;