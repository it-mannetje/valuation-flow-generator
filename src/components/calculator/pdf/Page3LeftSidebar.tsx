import React from "react";
import { View, Text, Image, Circle, Svg, Line } from "@react-pdf/renderer";
import { CompanyData, SectorConfig } from "@/types/calculator";
import sidebarImage from "@/assets/sidebar-business.jpg";

interface Page3LeftSidebarProps {
  companyData: CompanyData;
  estimatedEbitda: number;
  sectors: SectorConfig[];
}

export const Page3LeftSidebar: React.FC<Page3LeftSidebarProps> = ({
  companyData,
  estimatedEbitda,
  sectors,
}) => {
  return (
    <View
      style={{
        width: "30%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 32,
        marginTop:32
      }}
    > <View
      style={{
        height: "30%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 32,
        marginTop:32
      }}
    >
      {/* Top Content Section - White Box */}
      <View style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 20,
        backgroundColor: "#ffffff",
        padding: 24,
        borderRadius: 16,
      }}>
        {/* Header with Icon */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
        {/* Modern Info Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: "#0281BD",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
            <Line x1="12" y1="8" x2="12" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <Line x1="12" y1="11" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#0281BD",
            textAlign: "center",
          }}
        >
          Ingevulde gegevens
        </Text>
      </View>

      {/* Separator Line */}
      <View
        style={{
          height: 2,
          backgroundColor: "#e2e8f0",
          width: "100%",
        }}
      />

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

      {/* Image Section at Bottom - Separate */}
      <View
        style={{
          width: "100%",
        }}
      >
        <Image
          src={sidebarImage}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 16,
            objectFit: "cover",
          }}
        />
      </View>
    </View>
  );
};
