import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Example static values
const totalReceived = 80;
const cowMilk = 50;
const buffaloMilk = 30;

export default function EmployeeDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      {/* <View style={styles.header}>
        <MaterialIcons name="menu" size={28} color="#222" style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>
          <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Employee Panel</Text>
        </Text>
      </View> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Total Milk Supplied Today */}
        <View style={styles.totalSuppliedBox}>
          <MaterialCommunityIcons name="cup-water" size={28} color="#2563eb" style={{ marginBottom: 2 }} />
          <Text style={styles.totalSuppliedLabel}>Total Milk I Had Today</Text>
          <Text style={styles.totalSuppliedValue}>{totalReceived} <Text style={{ fontSize: 18 }}>Litres</Text></Text>
        </View>
        {/* Milk Cards */}
        <View style={styles.milkRow}>
          <View style={styles.milkCard}>
            <MaterialCommunityIcons name="paw" size={22} color="#8b5cf6" />
            <Text style={styles.milkLabel}>Cow Milk</Text>
            <Text style={styles.milkValue}>{cowMilk} L</Text>
          </View>
          <View style={styles.milkCard}>
            <MaterialCommunityIcons name="weather-sunny" size={22} color="#facc15" />
            <Text style={styles.milkLabel}>Buffalo Milk</Text>
            <Text style={styles.milkValue}>{buffaloMilk} L</Text>
          </View>
        </View>
        {/* Dashboard Title */}
        <Text style={styles.dashboardTitle}>Employee Dashboard</Text>
        <Text style={styles.dashboardDesc}>Quick access to manage your dairy operations</Text>
        {/* Options */}
        <TouchableOpacity style={styles.optionCard}>
          <MaterialCommunityIcons name="truck-delivery" size={22} color="#2563eb" style={styles.optionIcon} />
          <Text style={styles.optionText}>Milk Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard}>
          <MaterialIcons name="person-add-alt-1" size={22} color="#f59e42" style={styles.optionIcon} />
          <Text style={styles.optionText}>Add Customers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard}>
          <MaterialCommunityIcons name="warehouse" size={22} color="#22c55e" style={styles.optionIcon} />
          <Text style={styles.optionText}>Milk Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard}>
          <FontAwesome5 name="money-check-alt" size={20} color="#60a5fa" style={styles.optionIcon} />
          <Text style={styles.optionText}>Payments</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={22} color="#2563eb" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={22} color="#64748b" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-circle" size={22} color="#64748b" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5fb',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 2,
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  totalSuppliedBox: {
    backgroundColor: '#e6f0fb',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
  },
  totalSuppliedLabel: {
    color: '#222',
    fontSize: 16,
    marginBottom: 2,
    marginTop: 2,
  },
  totalSuppliedValue: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: 2,
  },
  milkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  milkCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 4,
    elevation: 1,
    minWidth: width * 0.38,
  },
  milkLabel: {
    color: '#64748b',
    fontSize: 15,
    marginTop: 4,
  },
  milkValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  dashboardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 2,
  },
  dashboardDesc: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5fb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e7ef',
    backgroundColor: '#fff',
    paddingVertical: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 2,
    fontWeight: 'bold',
  },
});