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
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 28,
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
            marginBottom: 30,
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
        <View style={{ gap: 20 }}>
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

        {/* Bottom Section */}
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {image1Url ? (
              <Image
                src={image1Url}
                style={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: '#dbeafe',
                  height: 120,
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
                    backgroundColor: '#3b82f6',
                    opacity: 0.1,
                  }}
                />
                <Text
                  style={{
                    fontSize: 8,
                    color: '#64748b',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  Business Meeting{'\n'}Professional Office{'\n'}Scene
                </Text>
              </View>
            )}
          </View>

          {/* Logo */}
          <View style={{ marginTop: 18 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#0c5ea8',
                letterSpacing: 0.3,
              }}
            >
              fbm Corpo-
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#0c5ea8',
                letterSpacing: 0.3,
                marginTop: -2,
              }}
            >
              rate Finance
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Page3LeftSidebar;
