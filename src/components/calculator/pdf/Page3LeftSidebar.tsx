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
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Background dots pattern */}
      <Svg
        style={{
          position: 'absolute',
          bottom: 15,
          left: 15,
          opacity: 0.25,
        }}
        height="80"
        width="80"
      >
        {[...Array(5)].map((_, i) =>
          [...Array(5)].map((_, j) => (
            <Circle
              key={`${i}-${j}`}
              cx={j * 8}
              cy={i * 8}
              r={0.8}
              fill="#cbd5e1"
            />
          ))
        )}
      </Svg>

      {/* Connecting curved line (visual link to right panel) */}
      <Svg
        style={{
          position: 'absolute',
          right: -10,
          top: '35%',
        }}
        height="200"
        width="40"
      >
        <Line
          x1="0"
          y1="0"
          x2="40"
          y2="200"
          stroke="#e2e8f0"
          strokeWidth={1.5}
          strokeOpacity={0.6}
        />
      </Svg>

      {/* Sidebar Card */}
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e8eef2',
          padding: 25,
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '90%',
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 25,
          }}
        >
          {/* Icon (document style) */}
          <View
            style={{
              width: 32,
              height: 32,
              marginBottom: 12,
              border: '2px solid #94a3b8',
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 18,
                height: 22,
                border: '1.5px solid #94a3b8',
                borderRadius: 2,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 1,
                  backgroundColor: '#94a3b8',
                  marginTop: 5,
                  marginLeft: 4,
                }}
              />
              <View
                style={{
                  width: 10,
                  height: 1,
                  backgroundColor: '#94a3b8',
                  marginTop: 2,
                  marginLeft: 4,
                }}
              />
              <View
                style={{
                  width: 6,
                  height: 1,
                  backgroundColor: '#94a3b8',
                  marginTop: 2,
                  marginLeft: 4,
                }}
              />
            </View>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1a3b68',
              letterSpacing: -0.2,
            }}
          >
            Ingevulde gegevens
          </Text>
        </View>

        {/* Data Section */}
        <View style={{ gap: 18 }}>
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
                fontSize: 10,
                color: '#6b7c93',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              OMZET
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1b2b4c',
              }}
            >
              €
              {Math.round(companyData.lastYearRevenue).toLocaleString('nl-NL')}
              ,-
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
                fontSize: 10,
                color: '#6b7c93',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              EBITDA
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1b2b4c',
              }}
            >
              €{Math.round(estimatedEbitda).toLocaleString('nl-NL')},-
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
                fontSize: 10,
                color: '#6b7c93',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              FTE
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1b2b4c',
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
                fontSize: 10,
                color: '#6b7c93',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              SECTOR
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1b2b4c',
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
                fontSize: 10,
                color: '#6b7c93',
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              MANAGEMENT
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#1b2b4c',
              }}
            >
              {companyData.managementParticipation ? 'Ja' : 'Nee'}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={{ marginTop: 25 }}>
          <View
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '2px solid #ffffff',
            }}
          >
            {image1Url ? (
              <Image
                src={image1Url}
                style={{
                  width: '100%',
                  height: 110,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: '#e0f2fe',
                  height: 110,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#0c5ea8',
                    opacity: 0.15,
                  }}
                />
                <Text
                  style={{
                    fontSize: 9,
                    color: '#64748b',
                    textAlign: 'center',
                  }}
                >
                  Business Meeting{'\n'}Professional Office Scene
                </Text>
              </View>
            )}
          </View>

          {/* Logo */}
          <View style={{ marginTop: 15 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#0c5ea8',
                letterSpacing: 0.5,
              }}
            >
              fbm Corporate Finance
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Page3LeftSidebar;
