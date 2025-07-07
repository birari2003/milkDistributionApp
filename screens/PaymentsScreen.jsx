import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OwnerPaymentsScreen() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_expected: 0,
    total_paid: 0,
    cash_paid: 0,
    online_paid: 0,
    amount_remaining: 0,
  });

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/owner-payments-summary')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSummary(data);
        else console.warn('Failed to load summary');
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading Payment Summary...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <FontAwesome name="rupee" size={22} color="#2563eb" />
            <Text style={styles.summaryLabel}>Expected Amount</Text>
            <Text style={styles.summaryValue}>₹{summary.total_expected.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <FontAwesome name="check-circle" size={22} color="#22c55e" />
            <Text style={styles.summaryLabel}>Received</Text>
            <Text style={[styles.summaryValue, { color: '#22c55e' }]}>₹{summary.total_paid.toLocaleString()}</Text>
          </View>
          <View style={styles.receivedBreakupRow}>
            <View style={styles.receivedType}>
              <MaterialIcons name="payments" size={18} color="#2563eb" />
              <Text style={styles.receivedTypeLabel}>Cash:</Text>
              <Text style={styles.receivedTypeValue}>₹{summary.cash_paid.toLocaleString()}</Text>
            </View>
            <View style={styles.receivedType}>
              <MaterialIcons name="credit-card" size={18} color="#22c55e" />
              <Text style={styles.receivedTypeLabel}>Online:</Text>
              <Text style={styles.receivedTypeValue}>₹{summary.online_paid.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <FontAwesome name="exclamation-circle" size={22} color="#f43f5e" />
            <Text style={styles.summaryLabel}>Amount Remaining</Text>
            <Text style={[styles.summaryValue, { color: '#f43f5e' }]}>₹{summary.amount_remaining.toLocaleString()}</Text>
          </View>
        </View>

     <Text style={styles.sectionTitle}>Payments & Operations</Text>
        <Text style={styles.sectionDesc}>Quick access to manage your dairy finances</Text>

        {/* Options */}
        <View style={styles.optionsCard}>
          <TouchableOpacity style={styles.optionBtn}>
            <FontAwesome5 name="rupee-sign" size={20} color="#2563eb" style={styles.optionIcon} />
            <Text style={styles.optionText}>Update Milk Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <FontAwesome5 name="user-tie" size={20} color="#22c55e" style={styles.optionIcon} />
            <Text style={styles.optionText}>Employees Salary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <FontAwesome5 name="users" size={20} color="#f59e42" style={styles.optionIcon} />
            <Text style={styles.optionText}>Customer Pay Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <FontAwesome name="home" size={22} color="#2563eb" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <FontAwesome name="cog" size={22} color="#64748b" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <FontAwesome name="user-circle" size={22} color="#111" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    paddingTop: 38,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#dbeafe',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 18,
  },
  scroll: {
    padding: 18,
    paddingBottom: 90,
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: width > 400 ? 370 : '100%',
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  summaryLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#64748b',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 10,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    width: width > 400 ? 370 : '100%',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  optionIcon: {
    marginRight: 14,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22223b',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e0e7ef',
    height: 60,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  receivedBreakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  receivedType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receivedTypeLabel: {
    marginLeft: 6,
    fontSize: 15,
    color: '#64748b',
  },
  receivedTypeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 4,
  },
});