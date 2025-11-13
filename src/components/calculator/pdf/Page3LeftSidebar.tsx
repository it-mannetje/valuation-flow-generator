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
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '60%',
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
          {/* Icon (document style) */}
          <View
            style={{
              width: 48,
              height: 48,
              marginBottom: 14,
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 24,
                height: 28,
                border: '2px solid #64748b',
                borderRadius: 3,
                backgroundColor: '#ffffff',
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 1.5,
                  backgroundColor: '#64748b',
                  marginTop: 6,
                  marginLeft: 5,
                }}
              />
              <View
                style={{
                  width: 14,
                  height: 1.5,
                  backgroundColor: '#64748b',
                  marginTop: 3,
                  marginLeft: 5,
                }}
              />
              <View
                style={{
                  width: 10,
                  height: 1.5,
                  backgroundColor: '#64748b',
                  marginTop: 3,
                  marginLeft: 5,
                }}
              />
            </View>
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
        <View style={{ gap: 12 }}>
          {/* OMZET */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              OMZET
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              € {Math.round(companyData.lastYearRevenue).toLocaleString('nl-NL')},-
            </Text>
          </View>

          {/* EBITDA */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              EBITDA
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              € {Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
            </Text>
          </View>

          {/* FTE */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              FTE
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              {companyData.employeesDisplay || companyData.employees}
            </Text>
          </View>

          {/* SECTOR */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              SECTOR
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
                textAlign: 'right',
                maxWidth: '60%',
              }}
            >
              {sectors.find((s) => s.id === companyData.sector)?.name ||
                companyData.sector}
            </Text>
          </View>

          {/* MANAGEMENTPARTICIPATIE */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              MANAGEMENTPARTICIPATIE
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1e293b',
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
