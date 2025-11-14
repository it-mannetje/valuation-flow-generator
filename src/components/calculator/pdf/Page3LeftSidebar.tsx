import React from 'react';
import { View, Text, Image, Svg, Circle, Line } from '@react-pdf/renderer';
import { CompanyData, SectorConfig } from '@/types/calculator';

interface Page3LeftSidebarProps {
  companyData: CompanyData;
  estimatedEbitda: number;
  sectors: SectorConfig[];
  image1Url?: string | null;
}

const Page3LeftSidebar: React.FC<Page3LeftSidebarProps> = ({
  companyData,
  estimatedEbitda,
  sectors,
  image1Url,
}) => {
  return (
    <View
      style={{
        width: '30%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: 28,
        paddingTop: 24,
        position: 'relative',
        flexDirection: 'column',
        height: '50%',
        justifyContent: 'flex-start',
      }}
    >
        {/* Header */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {/* Icon - Data/Info style */}
          <View
            style={{
              width: 56,
              height: 56,
              marginBottom: 16,
              backgroundColor: '#3b82f6',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width="28" height="28" viewBox="0 0 24 24">
              <Circle
                cx="12"
                cy="12"
                r="2"
                fill="white"
                opacity="0.9"
              />
              <Line
                x1="12"
                y1="5"
                x2="12"
                y2="10"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
              <Line
                x1="12"
                y1="14"
                x2="12"
                y2="19"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </Svg>
          </View>

          <Text
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1e293b',
              letterSpacing: -0.3,
            }}
          >
            Ingevulde gegevens
          </Text>
        </View>

        {/* Data Section */}
        <View style={{ gap: 16 }}>
          {/* OMZET */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              OMZET
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center',
              }}
            >
              € {Math.round(companyData.lastYearRevenue).toLocaleString('nl-NL')},-
            </Text>
          </View>

          {/* EBITDA */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              EBITDA
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center',
              }}
            >
              € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
            </Text>
          </View>

          {/* FTE */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              FTE
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center',
              }}
            >
              {companyData.employeesDisplay || companyData.employees}
            </Text>
          </View>

          {/* SECTOR */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              SECTOR
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center',
              }}
            >
              {sectors.find((s) => s.id === companyData.sector)?.name ||
                companyData.sector}
            </Text>
          </View>

          {/* MANAGEMENTPARTICIPATIE */}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              MANAGEMENTPARTICIPATIE
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'center',
              }}
            >
              {companyData.managementParticipation ? 'JA' : 'NEE'}
            </Text>
          </View>
        </View>

    </View>
  );
};

export default Page3LeftSidebar;
