import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';

const ReportSubmit = ({ customer }) => {
  const [gotTodayCow, setGotTodayCow] = useState(false);
  const [gotTodayBuffalo, setGotTodayBuffalo] = useState(false);
  const [willGetTomorrowCow, setWillGetTomorrowCow] = useState(false);
  const [willGetTomorrowBuffalo, setWillGetTomorrowBuffalo] = useState(false);
  const [extraToday, setExtraToday] = useState('');
  const [extraTomorrow, setExtraTomorrow] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.43.175:3000/api/milk-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          got_today_cow: gotTodayCow,
          got_today_buffalo: gotTodayBuffalo,
          will_get_tomorrow_cow: willGetTomorrowCow,
          will_get_tomorrow_buffalo: willGetTomorrowBuffalo,
          extra_today: parseFloat(extraToday || 0),
          extra_tomorrow: parseFloat(extraTomorrow || 0),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', 'Failed to submit report');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error while submitting report');
    }
  };

  return (
    <View style={styles.reportBox}>
      <Text style={styles.label}>Got milk today?</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={gotTodayCow} onValueChange={setGotTodayCow} />
        <Text style={styles.checkboxLabel}>Cow</Text>
        <Checkbox value={gotTodayBuffalo} onValueChange={setGotTodayBuffalo} style={{ marginLeft: 20 }} />
        <Text style={styles.checkboxLabel}>Buffalo</Text>
      </View>

      <TextInput
        placeholder="Extra today (L)"
        keyboardType="numeric"
        style={styles.input}
        value={extraToday}
        onChangeText={setExtraToday}
      />

      <Text style={styles.label}>Will get tomorrow?</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={willGetTomorrowCow} onValueChange={setWillGetTomorrowCow} />
        <Text style={styles.checkboxLabel}>Cow</Text>
        <Checkbox value={willGetTomorrowBuffalo} onValueChange={setWillGetTomorrowBuffalo} style={{ marginLeft: 20 }} />
        <Text style={styles.checkboxLabel}>Buffalo</Text>
      </View>

      <TextInput
        placeholder="Extra tomorrow (L)"
        keyboardType="numeric"
        style={styles.input}
        value={extraTomorrow}
        onChangeText={setExtraTomorrow}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>

      {submitted && (
        <Text style={styles.submittedText}>Information Submitted...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reportBox: {
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 6,
    height: 40,
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 8,
  },
  submitBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submittedText: {
    marginTop: 6,
    fontSize: 14,
    color: 'green',
    fontWeight: '600',
  },
});

export default ReportSubmit;
