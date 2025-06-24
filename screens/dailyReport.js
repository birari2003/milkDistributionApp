import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RegionWise from '../components/RigionWise';
const staticData = {
  distribution: { total: 320, cow: 200, buffalo: 120 },
  returned: { total: 20, cow: 12, buffalo: 8 },
  tomorrow: { total: 350, cow: 220, buffalo: 130 },
  regions: [
    {
      name: 'North',
      cow: 60,
      buffalo: 30,
      returnedCow: 3,
      returnedBuffalo: 2,
      employees: [
        { name: 'Amit', phone: '9876543210', cow: 30, buffalo: 15, returnedCow: 1, returnedBuffalo: 1 },
        { name: 'Ravi', phone: '9876501234', cow: 30, buffalo: 15, returnedCow: 2, returnedBuffalo: 1 },
      ],
    },
    {
      name: 'South',
      cow: 80,
      buffalo: 40,
      returnedCow: 4,
      returnedBuffalo: 3,
      employees: [
        { name: 'Priya', phone: '9123456789', cow: 40, buffalo: 20, returnedCow: 2, returnedBuffalo: 1 },
        { name: 'Suman', phone: '9123409876', cow: 40, buffalo: 20, returnedCow: 2, returnedBuffalo: 2 },
      ],
    },
    {
      name: 'East',
      cow: 60,
      buffalo: 25,
      returnedCow: 2,
      returnedBuffalo: 2,
      employees: [
        { name: 'Sunil', phone: '9001234567', cow: 30, buffalo: 12, returnedCow: 1, returnedBuffalo: 1 },
        { name: 'Meena', phone: '9007654321', cow: 30, buffalo: 13, returnedCow: 1, returnedBuffalo: 1 },
      ],
    },
    
    {
      name: 'West',
      cow: 20,
      buffalo: 25,
      returnedCow: 1,
      returnedBuffalo: 3,
      employees: [
        { name: 'Rakesh', phone: '9012345678', cow: 10, buffalo: 12, returnedCow: 0, returnedBuffalo: 2 },
        { name: 'Seema', phone: '9012987654', cow: 10, buffalo: 13, returnedCow: 1, returnedBuffalo: 1 },
      ],
    },
  ],
};

export default function OwnerInventory() {
  const [regionModal, setRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const { width, height } = useWindowDimensions();
  const modalWidth = width > 600 ? width * 0.7 : width * 0.95;
  const modalHeight = height * 0.8;

  const openRegion = (region) => {
    setSelectedRegion(region);
    setRegionModal(true);
  };

  const MilkTypeBox = ({ label, value, color, borderColor, bgColor }) => {
    const emojiMap = {
      "Cow Milk": "🐄",
      "Buffalo Milk": "🐃",
    };

    return (
      <View
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 12,
          paddingVertical: 20,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          width: 180,
          marginHorizontal: 8,
        }}
      >
        <Text style={{ fontSize: 40, marginBottom: 8 }}>
          {emojiMap[label] || '🥛'}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color, textAlign: 'center' }}>
          {label}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color, marginTop: 4 }}>
          {value}L
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBar}>
          <MaterialCommunityIcons name="cup-water" size={28} color="#2563eb" />
          <Text style={styles.headerTitle}>Milk Inventory</Text>
        </View>

        {/* Distributed Milk */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleBlack}>
            <MaterialCommunityIcons name="calendar-today" size={20} color="#2563eb" /> Cow and Buffalo
          </Text>
          <Text style={styles.totalLiters}>{staticData.distribution.total} Liters</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <MilkTypeBox
              label="Cow Milk"
              value={staticData.distribution.cow}
              color="#22c55e"
              borderColor="#22c55e"
              bgColor="#f0fdf4"
            />
            <MilkTypeBox
              label="Buffalo Milk"
              value={staticData.distribution.buffalo}
              color="#3b82f6"
              borderColor="#3b82f6"
              bgColor="#eff6ff"
            />
          </View>
        </View>

        {/* Returned Milk */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleBlack}>
            <MaterialCommunityIcons name="undo" size={20} color="#2563eb" /> Received
          </Text>
          <Text style={styles.totalLiters}>{staticData.returned.total} Liters</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <MilkTypeBox
              label="Cow Milk"
              value={staticData.returned.cow}
              color="#22c55e"
              borderColor="#22c55e"
              bgColor="#f0fdf4"
            />
            <MilkTypeBox
              label="Buffalo Milk"
              value={staticData.returned.buffalo}
              color="#facc15"
              borderColor="#facc15"
              bgColor="#fefce8"
            />
          </View>
        </View>

        {/* Tomorrow Milk */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleBlack}>
            <MaterialCommunityIcons name="calendar" size={20} color="#2563eb" /> Tomorrow
          </Text>
          <Text style={styles.totalLiters}>{staticData.tomorrow.total} Liters</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <MilkTypeBox
              label="Cow Milk"
              value={staticData.tomorrow.cow}
              color="#22c55e"
              borderColor="#22c55e"
              bgColor="#f0fdf4"
            />
            <MilkTypeBox
              label="Buffalo Milk"
              value={staticData.tomorrow.buffalo}
              color="#facc15"
              borderColor="#facc15"
              bgColor="#fefce8"
            />
          </View>
        </View>

        {/* Region Wise */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.regionBtn}
            onPress={() => setRegionModal(true)}
          >
            <MaterialCommunityIcons name="map" size={22} color="#2563eb" />
            <Text style={styles.regionBtnText}>Region Wise</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Region Modal */}
      <RegionWise
        visible={regionModal}
        onClose={() => {
          setRegionModal(false);
          setSelectedRegion(null);
        }}
        data={staticData}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        openRegion={openRegion}
        styles={styles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 12,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 8,
  },
  sectionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitleBlack: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  totalLiters: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  regionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  regionBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
});
