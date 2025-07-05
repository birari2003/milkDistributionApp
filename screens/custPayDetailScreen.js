import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const years = ['2024', '2025'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Static customer data with unpaid months (use "Month Year" as key)
const customers = [
  {
    name: 'Shalini Mehta',
    phone: '9876543210',
    region: 'West Zone',
    unpaid: {
      'May 2025': 1230,
      'June 2025': 0,
    },
  },
  {
    name: 'Amit Kumar',
    phone: '9123456780',
    region: 'North Zone',
    unpaid: {
      'May 2025': 0,
      'June 2025': 880,
    },
  },
  {
    name: 'Priya Sharma',
    phone: '9988776655',
    region: 'East Zone',
    unpaid: {
      'May 2025': 450,
      'June 2025': 0,
    },
  },
  {
    name: 'Rahul Singh',
    phone: '9090909090',
    region: 'South Zone',
    unpaid: {
      'May 2025': 0,
      'June 2025': 0,
    },
  },
  {
    name: 'Rohit Verma',
    phone: '9985776655',
    region: 'Central Zone',
    unpaid: {
      'May 2025': 2100,
      'June 2025': 0,
    },
  },
];

export default function CustPayDetailsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(months[4]); // May
  const [selectedYear, setSelectedYear] = useState('2025');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [notifiedPhones, setNotifiedPhones] = useState([]);

  const selectedMonthYear = `${selectedMonth} ${selectedYear}`;

  // Filter customers who have not paid for the selected month and year
  const unpaidCustomers = customers.filter(
    c => c.unpaid[selectedMonthYear] && c.unpaid[selectedMonthYear] > 0
  );

  const handleNotify = (phone, monthYear) => {
    const key = phone + monthYear;
    setNotifiedPhones(prev => [...prev, key]);
    setTimeout(() => {
      setNotifiedPhones(prev => prev.filter(k => k !== key));
    }, 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Month & Year Dropdowns */}
      <View style={styles.monthRow}>
        <Text style={styles.monthLabel}>Month</Text>
        <TouchableOpacity
          style={styles.monthDropdown}
          onPress={() => setMonthDropdownOpen(open => !open)}
          activeOpacity={0.7}
        >
          <Text style={styles.monthValue}>{selectedMonth}</Text>
          <MaterialIcons
            name={monthDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={22}
            color="#2563eb"
            style={{ marginLeft: 4}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yearDropdown}
          onPress={() => setYearDropdownOpen(open => !open)}
          activeOpacity={0.7}
        >
          <Text style={styles.monthValue}>{selectedYear}</Text>
          <MaterialIcons
            name={yearDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={22}
            color="#2563eb"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
      {monthDropdownOpen && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 150 }}>
            {months.map(month => (
              <TouchableOpacity
                key={month}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedMonth(month);
                  setMonthDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedMonth === month && { color: '#2563eb', fontWeight: 'bold' },
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {yearDropdownOpen && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 150 }}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedYear(year);
                  setYearDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedYear === year && { color: '#2563eb', fontWeight: 'bold' },
                  ]}
                >
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Unpaid Customers */}
      <Text style={styles.sectionTitle}>Unpaid Customers</Text>
      {unpaidCustomers.length === 0 ? (
        <Text style={styles.noUnpaid}>No customers remained to pay for {selectedMonthYear}.</Text>
      ) : (
        <View style={styles.customerList}>
          {unpaidCustomers.map((cust, idx) => {
            const isNotified = notifiedPhones.includes(cust.phone + selectedMonthYear);
            return (
              <View key={cust.phone + idx} style={styles.customerRow}>
                <View style={styles.iconAvatar}>
                  <MaterialIcons name="person" size={28} color="#2563eb" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.custName}>{cust.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <MaterialIcons name="phone" size={14} color="#64748b" style={{ marginRight: 4 }} />
                    <Text style={styles.custPhone}>{cust.phone}</Text>
                  </View>
                  <Text style={styles.regionText}>{cust.region}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                  <Text style={styles.amountText}>₹{cust.unpaid[selectedMonthYear].toLocaleString()}</Text>
                  <TouchableOpacity
                    style={[
                      styles.notifyBtn,
                      isNotified && { backgroundColor: '#bbf7d0' }
                    ]}
                    disabled={isNotified}
                    onPress={() => handleNotify(cust.phone, selectedMonthYear)}
                  >
                    <MaterialIcons
                      name={isNotified ? 'check-circle' : 'notification-important'}
                      size={16}
                      color={isNotified ? '#22c55e' : '#ef4444'}
                    />
                    <Text style={[
                      styles.notifyText,
                      isNotified && { color: '#22c55e' }
                    ]}>
                      {isNotified ? 'Notified' : 'Notify'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    minHeight: '100%',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width > 400 ? 370 : '97%',
    marginBottom: 10,
    marginTop: 5,
  },
  monthLabel: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
    marginRight: 10,
  },
  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 100,
    marginRight: 8,
  },
  yearDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
  },
  monthValue: {
    fontSize: 15,
    color: '#22223b',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    width: width > 400 ? 370 : '97%',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: -4,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#22223b',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  noUnpaid: {
    color: '#64748b',
    fontSize: 15,
    marginTop: 20,
    alignSelf: 'center',
  },
  customerList: {
    width: width > 400 ? 370 : '97%',
    marginTop: 4,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    elevation: 1,
  },
  iconAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  custName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#22223b',
  },
  custPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  regionText: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 2,
    fontWeight: 'bold',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#f43f5e',
    marginBottom: 4,
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  notifyText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
});