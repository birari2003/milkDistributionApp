



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const months = [
  { label: 'January', value: 1, days: 31 },
  { label: 'February', value: 2, days: 29 },
  { label: 'March', value: 3, days: 31 },
  { label: 'April', value: 4, days: 30 },
  { label: 'May', value: 5, days: 31 },
  { label: 'June', value: 6, days: 30 },
  { label: 'July', value: 7, days: 31 },
  { label: 'August', value: 8, days: 31 },
  { label: 'September', value: 9, days: 30 },
  { label: 'October', value: 10, days: 31 },
  { label: 'November', value: 11, days: 30 },
  { label: 'December', value: 12, days: 31 },
];

export default function CustDeliveryDetails() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear] = useState(2025);
  const [customerId, setCustomerId] = useState(null);
  const [dailyMap, setDailyMap] = useState({});
  const [totals, setTotals] = useState({ cow: 0, buffalo: 0, grand: 0 });

  useEffect(() => {
    getCustomerId();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchMonthlyData();
    }
  }, [selectedMonth, customerId]);

  const getCustomerId = async () => {
    const userStr = await AsyncStorage.getItem('user');
    const user = JSON.parse(userStr);
    setCustomerId(user?.id);
  };

  const fetchMonthlyData = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/customer-monthly-milk-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, year: selectedYear, month: selectedMonth }),
      });

      const data = await res.json();
      if (data.success) {
        setDailyMap(data.daily || {});
        
        setTotals(data.totals || { cow: 0, buffalo: 0, grand: 0 });
      }
    } catch (err) {
      console.error('Milk summary fetch error:', err);
    }
  };

  const monthObj = months.find(m => m.value === selectedMonth);
  // need to manage the condition , directly pass the days
  const days = monthObj?.days || 31;
  const monthStr = String(selectedMonth).padStart(2, '0');

  const renderRow = (dateStr, row) => {
    const missing = !row;
    return (
      <View key={dateStr} style={styles.tableRow}>
        <Text style={[styles.cell, styles.border, { flex: 1.5 }, missing && styles.missing]}>{dateStr}</Text>
        <Text style={[styles.cell, styles.border, missing && styles.missing]}>
          {missing ? '-' : `${row.cow} ${row.extra > 0 ? `+${row.extra}` : ''}`}
        </Text>
        <Text style={[styles.cell, styles.border, missing && styles.missing]}>
          {missing ? '-' : row.buffalo}
        </Text>
        <Text style={[styles.cell, styles.border, { flex: 1.2 }, missing && styles.missing]}>
          {missing ? '-' : row.total.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Picker */}
      <View style={styles.monthPickerRow}>
        <Text style={styles.monthLabel}>Select Month:</Text>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(val) => setSelectedMonth(val)}
        >
          {months.map((m) => (
            <Picker.Item key={m.value} label={m.label} value={m.value} />
          ))}
        </Picker>
      </View>

      {/* Table Wrapper */}
      <View style={styles.tableWrapper}>
        {/* Sticky Header */}
        <View style={[styles.tableRow, styles.stickyHeader]}>
          <Text style={[styles.cell, styles.border, styles.header, { flex: 1.5 }]}>Date</Text>
          <Text style={[styles.cell, styles.border, styles.header]}>Cow</Text>
          <Text style={[styles.cell, styles.border, styles.header]}>Buffalo</Text>
          <Text style={[styles.cell, styles.border, styles.header, { flex: 1.2 }]}>Total</Text>
        </View>

        {/* Scrollable Body */}
        <ScrollView style={styles.scrollArea}>
          {[...Array(days)].map((_, i) => {
            const d = i + 1;
            const dateStr = `${selectedYear}-${monthStr}-${String(d).padStart(2, '0')}`;
            return renderRow(dateStr, dailyMap[dateStr]);
          })}
        </ScrollView>

        {/* Sticky Footer */}
        <View style={[styles.tableRow, styles.stickyFooter]}>
          <Text style={[styles.cell, styles.border, styles.footer, { flex: 1.5 }]}>Total</Text>
          <Text style={[styles.cell, styles.border, styles.footer]}>{totals.cow.toFixed(2)}</Text>
          <Text style={[styles.cell, styles.border, styles.footer]}>{totals.buffalo.toFixed(2)}</Text>
          <Text style={[styles.cell, styles.border, styles.footer, { flex: 1.2 }]}>
            {totals.grand.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },

  monthPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: { fontSize: 16, marginRight: 10 },
  picker: { flex: 1, height: 44 },

  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
  },

  scrollArea: {
    maxHeight: height * 0.9, // Adjust for visible space
  },

  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },

  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: 'center',
    fontSize: 14,
  },

  header: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#e0f2fe',
    fontWeight: 'bold',
  },

  stickyHeader: {
    position: 'relative',
    backgroundColor: '#f1f5f9',
    zIndex: 10,
  },

  stickyFooter: {
    backgroundColor: '#e0f2fe',
    zIndex: 10,
  },

  border: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },

  missing: {
    color: 'red',
  },
});
