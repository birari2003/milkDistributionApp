import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OwnerUpdatePriceScreen() {
  const [prevCow, setPrevCow] = useState(50);
  const [prevBuffalo, setPrevBuffalo] = useState(60);

  const [cowRate, setCowRate] = useState(prevCow.toString());
  const [buffaloRate, setBuffaloRate] = useState(prevBuffalo.toString());
  const [updated, setUpdated] = useState(false);

  const [updatedCow, setUpdatedCow] = useState(null);
  const [updatedBuffalo, setUpdatedBuffalo] = useState(null);

  const handleUpdate = () => {
    const cow = Number(cowRate);
    const buffalo = Number(buffaloRate);
    setPrevCow(cow);
    setPrevBuffalo(buffalo);
    setUpdatedCow(cow);
    setUpdatedBuffalo(buffalo);
    setUpdated(true);
    setTimeout(() => setUpdated(false), 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     {/* Back Arrow using FontAwesome5 */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation && navigation.navigate('ownerpay')}
      >
        <FontAwesome5 name="arrow-left" size={20} color="#2563eb" />
        <Text style={styles.backText}> Back</Text>
      </TouchableOpacity>

      {/* Previous Rates */}
      <View style={styles.prevRateCard}>
        <Text style={styles.prevRateTitle}>
          <MaterialIcons name="history" size={18} color="#1e40af" /> Previous Rates
        </Text>
        <View style={styles.prevRateRow}>
          <MaterialCommunityIcons name="cow" size={20} color="#1e40af" style={styles.icon} />
          <Text style={styles.prevRateLabel}>Cow Milk</Text>
          <Text style={styles.prevRateValue}>₹{prevCow}/L</Text>
        </View>
        <View style={styles.prevRateRow}>
          <MaterialCommunityIcons name="water" size={20} color="#1e40af" style={styles.icon} />
          <Text style={styles.prevRateLabel}>Buffalo Milk</Text>
          <Text style={styles.prevRateValue}>₹{prevBuffalo}/L</Text>
        </View>
      </View>

      {/* Rate Update Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          <MaterialIcons name="edit" size={18} color="#3b82f6" /> Set Rate per Liter
        </Text>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="cow" size={22} color="#3b82f6" style={styles.icon} />
          <Text style={styles.inputLabel}>Cow Milk</Text>
          <TextInput
            style={styles.inputBoxSmall}
            keyboardType="numeric"
            value={cowRate}
            onChangeText={setCowRate}
            maxLength={3}
          />
          <Text style={styles.unit}>₹/L</Text>
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="water" size={22} color="#3b82f6" style={styles.icon} />
          <Text style={styles.inputLabel}>Buffalo Milk</Text>
          <TextInput
            style={styles.inputBoxSmall}
            keyboardType="numeric"
            value={buffaloRate}
            onChangeText={setBuffaloRate}
            maxLength={3}
          />
          <Text style={styles.unit}>₹/L</Text>
        </View>
        <TouchableOpacity
          style={[styles.updateBtn, updated && styles.updateBtnGreen]}
          onPress={handleUpdate}
        >
          <MaterialIcons name="done" size={18} color="#fff" />
          <Text style={styles.updateBtnText}>Update Rate</Text>
        </TouchableOpacity>

        {updated && (
          <View style={styles.successMsg}>
            <MaterialIcons name="check-circle" size={18} color="#22c55e" />
            <Text style={styles.successText}>Rates updated successfully!</Text>
          </View>
        )}
      </View>

      {/* Updated Rates */}
      {(updatedCow !== null && updatedBuffalo !== null) && (
        <View style={styles.updatedCard}>
          <Text style={styles.updatedTitle}>
            <MaterialIcons name="trending-up" size={18} color="#16a34a" /> Updated Rates
          </Text>
          <View style={styles.prevRateRow}>
            <MaterialCommunityIcons name="cow" size={20} color="#16a34a" style={styles.icon} />
            <Text style={styles.prevRateLabel}>Cow Milk</Text>
            <Text style={styles.updatedValue}>₹{updatedCow}/L</Text>
          </View>
          <View style={styles.prevRateRow}>
            <MaterialCommunityIcons name="water" size={20} color="#16a34a" style={styles.icon} />
            <Text style={styles.prevRateLabel}>Buffalo Milk</Text>
            <Text style={styles.updatedValue}>₹{updatedBuffalo}/L</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  backText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    minHeight: '100%',
  },
  icon: {
    marginRight: 6,
  },
  prevRateCard: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 16,
    width: width > 400 ? 340 : '95%',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#bae6fd',
    elevation: 2,
  },
  prevRateTitle: {
    fontWeight: 'bold',
    color: '#1e40af',
    fontSize: 16,
    marginBottom: 8,
  },
  prevRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  prevRateLabel: {
    fontSize: 14,
    color: '#334155',
    marginRight: 6,
    flex: 1,
  },
  prevRateValue: {
    fontSize: 15,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: width > 400 ? 340 : '95%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    marginBottom: 18,
  },
  formTitle: {
    fontWeight: 'bold',
    color: '#3b82f6',
    fontSize: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    color: '#334155',
    marginRight: 6,
    width: 80,
  },
  inputBoxSmall: {
    width: 140,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    color: '#0f172a',
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginRight: 6,
    textAlign: 'center',
  },
  unit: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  updateBtnGreen: {
    backgroundColor: '#22c55e',
  },
  updateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  successMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  successText: {
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  updatedCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    width: width > 400 ? 340 : '95%',
    borderWidth: 1,
    borderColor: '#86efac',
    elevation: 2,
    marginTop: 10,
  },
  updatedTitle: {
    fontWeight: 'bold',
    color: '#16a34a',
    fontSize: 16,
    marginBottom: 8,
  },
  updatedValue: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: 'bold',
  },
});