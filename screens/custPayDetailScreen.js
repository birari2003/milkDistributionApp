import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const years = ['2024', '2025'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CustPayDetailsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [notifiedPhones, setNotifiedPhones] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

  const selectedMonthIndex = months.indexOf(selectedMonth) + 1; // for API (1-based month)

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const fetchPayments = async () => {
            const enriched = await Promise.all(
              data.customers.map(async (cust) => {
                try {
                  const res = await fetch('http://192.168.43.175:3000/api/customer-payment-summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customer_id: cust.id,
                      year: parseInt(selectedYear),
                      month: selectedMonthIndex
                    })
                  });

                  const pay = await res.json();

                  return {
                    ...cust,
                    amount: pay.total_due || 0,
                    region: cust.area || 'N/A',
                  };
                } catch (err) {
                  console.error(err);
                  return { ...cust, amount: 0, region: cust.area || 'N/A' };
                }
              })
            );

            setAllCustomers(enriched);
          };

          fetchPayments();
        }
      });
  }, [selectedMonth, selectedYear]);

  const unpaidCustomers = allCustomers.filter(c => c.amount > 0);

  const handleNotify = (phone) => {
    const key = phone + selectedMonth + selectedYear;
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
        >
          <Text style={styles.monthValue}>{selectedMonth}</Text>
          <MaterialIcons name={monthDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={22} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.yearDropdown}
          onPress={() => setYearDropdownOpen(open => !open)}
        >
          <Text style={styles.monthValue}>{selectedYear}</Text>
          <MaterialIcons name={yearDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'} size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {monthDropdownOpen && (
        <View style={styles.dropdownList}>
          {months.map(month => (
            <TouchableOpacity
              key={month}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedMonth(month);
                setMonthDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{month}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {yearDropdownOpen && (
        <View style={styles.dropdownList}>
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedYear(year);
                setYearDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{year}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Unpaid Customer List */}
      <Text style={styles.sectionTitle}>Unpaid Customers</Text>
      {unpaidCustomers.length === 0 ? (
        <Text style={styles.noUnpaid}>No customers unpaid for {selectedMonth} {selectedYear}.</Text>
      ) : (
        unpaidCustomers.map((cust, idx) => {
          const key = cust.phone + selectedMonth + selectedYear;
          const isNotified = notifiedPhones.includes(key);

          return (
            <View key={idx} style={styles.customerRow}>
              <View style={styles.iconAvatar}>
                <MaterialIcons name="person" size={28} color="#2563eb" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.custName}>{cust.name}</Text>
                <Text style={styles.custPhone}>{cust.phone}</Text>
                {/* <Text style={styles.regionText}>{cust.region}</Text> */}
              </View>
              <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                <Text style={styles.amountText}>₹{cust.amount.toLocaleString()}</Text>
                <TouchableOpacity
                  style={[
                    styles.notifyBtn,
                    isNotified && { backgroundColor: '#bbf7d0' }
                  ]}
                  disabled={isNotified}
                  onPress={() => handleNotify(cust.phone)}
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
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  monthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  monthLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  monthDropdown: {
    borderWidth: 1, borderColor: '#cbd5e1',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center'
  },
  yearDropdown: {
    borderWidth: 1, borderColor: '#cbd5e1', marginLeft: 10,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center'
  },
  monthValue: { fontSize: 14, color: '#2563eb' },
  dropdownList: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1',
    marginTop: 2, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10
  },
  dropdownItem: { paddingVertical: 6 },
  dropdownItemText: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  noUnpaid: { fontSize: 14, color: '#64748b' },
  customerRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    padding: 10, borderRadius: 8, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, elevation: 1
  },
  iconAvatar: {
    backgroundColor: '#e0f2fe', borderRadius: 30,
    padding: 8, justifyContent: 'center', alignItems: 'center'
  },
  custName: { fontWeight: 'bold', fontSize: 15 },
  custPhone: { color: '#64748b', fontSize: 13 },
  regionText: { color: '#22c55e', fontSize: 12 },
  amountText: { fontWeight: 'bold', fontSize: 15, color: '#f43f5e' },
  notifyBtn: {
    marginTop: 6, backgroundColor: '#fee2e2', paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 4
  },
  notifyText: { fontSize: 12, color: '#ef4444', marginLeft: 4 }
});