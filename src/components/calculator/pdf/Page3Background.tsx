import React from 'react';
import { View, Image } from '@react-pdf/renderer';

interface Page3BackgroundProps {
  backgroundImageUrl?: string | null;
}

const Page3Background: React.FC<Page3BackgroundProps> = ({ backgroundImageUrl }) => {
  return (
    <>
      {/* Light gray-green background matching reference design */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#e8ede8',
      }} />

      {/* White dot pattern at bottom */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        opacity: 0.5,
      }}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={{
            position: 'absolute',
            bottom: 20 + (i % 5) * 30,
            left: 30 + Math.floor(i / 5) * 50,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
          }} />
        ))}
      </View>

      {/* Background Image - Optional overlay */}
      {backgroundImageUrl && (
        <Image 
          src={backgroundImageUrl} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.2,
          }}
        />
      )}
    </>
  );
};

export default Page3Background;
