import React from 'react';
import { FooterConfig } from '@/types/footer';

interface FooterPreviewProps {
  config: FooterConfig;
  logoUrl?: string;
  pageNumber?: number;
}

const FooterPreview: React.FC<FooterPreviewProps> = ({ 
  config, 
  logoUrl, 
  pageNumber = 1 
}) => {
  const renderLogo = () => {
    if (!logoUrl) return null;
    
    return (
      <img 
        src={logoUrl} 
        alt="Footer Logo"
        style={{
          maxWidth: `${config.logoMaxWidth}px`,
          maxHeight: `${config.logoMaxHeight}px`,
        }}
        className="object-contain"
      />
    );
  };

  const renderPageNumber = () => (
    <div 
      style={{
        backgroundColor: config.pageNumberStyle.backgroundColor,
        borderRadius: `${config.pageNumberStyle.borderRadius}px`,
        width: config.pageNumberStyle.width,
        height: config.pageNumberStyle.height,
        color: config.pageNumberStyle.color,
        fontSize: `${config.pageNumberStyle.fontSize}px`,
        fontWeight: config.pageNumberStyle.fontWeight,
        borderColor: config.pageNumberStyle.borderColor || 'transparent',
        borderWidth: `${config.pageNumberStyle.borderWidth || 0}px`,
        borderStyle: 'solid',
      }}
      className="flex items-center justify-center px-2"
    >
      <div 
        style={{
          width: `${config.dottedLineStyle.width}px`,
          height: `${config.dottedLineStyle.height}px`,
          backgroundColor: config.dottedLineStyle.color,
          marginRight: `${config.dottedLineStyle.marginRight}px`,
        }}
      />
      <span>{pageNumber}</span>
    </div>
  );

  return (
    <div 
      style={{
        height: config.height,
        backgroundColor: config.backgroundColor,
      }}
      className="flex items-center justify-between px-10 border border-gray-300 rounded-lg shadow-sm"
    >
      {/* Logo positioning */}
      <div 
        className={`flex ${
          config.logoPosition === 'left' ? 'justify-start' : 
          config.logoPosition === 'center' ? 'justify-center flex-1' : 
          'justify-end'
        }`}
      >
        {config.logoPosition === 'left' && renderLogo()}
      </div>

      {/* Center logo if needed */}
      {config.logoPosition === 'center' && (
        <div className="flex justify-center flex-1">
          {renderLogo()}
        </div>
      )}

      {/* Spacer for right positioning */}
      {config.pageNumberPosition === 'right' && <div className="flex-1" />}

      {/* Page number positioning */}
      <div 
        className={`flex ${
          config.pageNumberPosition === 'left' ? 'justify-start' : 
          config.pageNumberPosition === 'center' ? 'justify-center flex-1' : 
          'justify-end'
        }`}
      >
        {renderPageNumber()}
      </div>

      {/* Right logo if needed */}
      {config.logoPosition === 'right' && (
        <div className="flex justify-end">
          {renderLogo()}
        </div>
      )}
    </div>
  );
};

export default FooterPreview;