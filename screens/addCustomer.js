import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

const genderColors = {
  Male: '#2563eb',
  Female: '#f472b6',
  Other: '#a21caf',
};

const milkColors = {
  cow: '#22c55e',
  buffalo: '#a21caf',
};

export default function AddCustomerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    gender: '',
    address: '',
    cowMilk: '',
    password: '',
    buffaloMilk: '',
    delivery_time: '',
  });
  const [customers, setCustomers] = useState([]);
  const [EMPLOYEE, setEMPLOYEE] = useState(null);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const fetchEmployeeData = async () => {
    const emp = await AsyncStorage.getItem('employee');
    if (emp) {
      const parsed = JSON.parse(emp);
      setEMPLOYEE(parsed);
      fetchCustomers(parsed);
    }
  };

  useEffect(() => {
    const fetchEmployeeAndCustomers = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user'); // or 'employee' if you store with that key
        const user = JSON.parse(userStr);

        if (!user?.id) {
          alert('Employee ID not found');
          return;
        }

        setEMPLOYEE(user); // Store full employee object if needed

        // Now fetch customers under this employee
        const res = await fetch(`http://192.168.43.175:3000/api/customers?employee_id=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setCustomers(data.customers);
        } else {
          alert('Failed to load customers');
        }
      } catch (err) {
        console.error('Error fetching employee/customers:', err);
        alert('Something went wrong');
      }
    };

    fetchEmployeeAndCustomers();
  }, []);


  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const handleAddCustomer = async () => {
    if (!EMPLOYEE) return;

    if (!form.name || !form.mobile || !form.gender || !form.delivery_time || !form.password) {
      return Alert.alert('All required fields must be filled!');
    }

    const milk_category =
      form.cowMilk && form.buffaloMilk
        ? 'both'
        : form.cowMilk
          ? 'cow'
          : form.buffaloMilk
            ? 'buffalo'
            : '';

    if (!milk_category) return alert('Please enter milk quantity');

    const daily_milk_needed =
      parseFloat(form.cowMilk || 0) + parseFloat(form.buffaloMilk || 0);

    try {
      const res = await fetch('http://192.168.43.175:3000/api/add-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.mobile,
          gender: form.gender.toLowerCase(),
          address: form.address,
          area_id: EMPLOYEE.area_id,
          employee_assigned: EMPLOYEE.id,
          daily_milk_needed,
          milk_category,
          password: form.password,
          delivery_time: form.delivery_time,
        }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Customer added!');
        setForm({
          name: '',
          mobile: '',
          gender: '',
          address: '',
          password: '',
          cowMilk: '',
          buffaloMilk: '',
          delivery_time: '',
        });
        setModalVisible(false);
        fetchCustomers(EMPLOYEE);
      } else {
        Alert.alert('Failed:', data.message || 'Unknown error');
      }
    } catch (e) {
      Alert.alert('Server error');
    }
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerIconBox}>
        <MaterialCommunityIcons
          name="account"
          size={32}
          color={genderColors[item.gender] || '#a21caf'}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerMobile}>
          <MaterialCommunityIcons name="phone" size={15} color="#60a5fa" />{' '}
          {item.phone}
        </Text>
        <Text style={styles.customerAddress}>{item.address}</Text>
        <Text style={styles.customerRegion}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#a21caf" />{' '}
          {item.area_name}
        </Text>
        <Text style={styles.customerAddress}>
          ⏰ Delivery: {item.delivery_time}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <MaterialCommunityIcons name="account-plus" size={28} color="#2563eb" />
        <Text style={styles.headerTitle}>Add Customer</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Add Customer</Text>
      </TouchableOpacity>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomer}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Add Customer</Text>
              {/* Name */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="account" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.inputBox, { color: '#2563eb', flex: 1 }]}
                  placeholder="Name"
                  placeholderTextColor="#2563eb"
                  value={form.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>
              {/* Mobile */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="phone" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.inputBox, { color: '#2563eb', flex: 1 }]}
                  placeholder="Mobile No"
                  placeholderTextColor="#2563eb"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={form.mobile}
                  onChangeText={(text) => handleChange('mobile', text)}
                />
              </View>
              {/* Password */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="lock" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.inputBox, { color: '#2563eb', flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#2563eb"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(text) => handleChange('password', text)}
                />
              </View>
              {/* Gender */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="gender-male-female" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <View style={[styles.genderRow, { flex: 1 }]}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                      onPress={() => handleChange('gender', g)}
                    >
                      <Text style={form.gender === g ? styles.genderTextActive : [styles.genderText, { color: genderColors[g] }]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Address */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="home" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.inputBox, { color: '#2563eb', flex: 1 }]}
                  placeholder="Address"
                  placeholderTextColor="#2563eb"
                  value={form.address}
                  onChangeText={(text) => handleChange('address', text)}
                />
              </View>
              {/* Delivery Time Dropdown */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="clock" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TouchableOpacity
                  style={[styles.inputBox, { flex: 1 }]}
                  onPress={() => {
                    const next = form.delivery_time === 'morning' ? 'evening' : 'morning';
                    handleChange('delivery_time', next);
                  }}
                >
                  <Text style={{ color: '#2563eb' }}>
                    {form.delivery_time ? form.delivery_time.charAt(0).toUpperCase() + form.delivery_time.slice(1) : 'Select Delivery Time'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Cow & Buffalo Milk */}
              <View style={[styles.inputGroup, { flexDirection: 'row', gap: 10 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: '#2563eb' }]}>Cow Milk (L/day)</Text>
                  <TextInput
                    style={[styles.inputBox, { color: '#2563eb' }]}
                    placeholder="Cow"
                    placeholderTextColor="#2563eb"
                    keyboardType="numeric"
                    value={form.cowMilk}
                    onChangeText={(text) => handleChange('cowMilk', text)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: '#2563eb' }]}>Buffalo Milk (L/day)</Text>
                  <TextInput
                    style={[styles.inputBox, { color: '#2563eb' }]}
                    placeholder="Buffalo"
                    placeholderTextColor="#2563eb"
                    keyboardType="numeric"
                    value={form.buffaloMilk}
                    onChangeText={(text) => handleChange('buffaloMilk', text)}
                  />
                </View>
              </View>
              {/* Save */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddCustomer}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'flex-start',
    elevation: 1,
  },
  customerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 2,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  customerMobile: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 2,
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 16,
    marginBottom: 2,
  },
  customerRegion: {
    fontSize: 13,
    marginBottom: 4,
  },
  milkRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  milkTypeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  milkTypeLabel: {
    fontSize: 18,
    marginLeft: 3,
    marginRight: 2,
    fontWeight: 'bold',
  },
  milkTypeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: '90%',
    maxHeight: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    color: '#2563eb',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  genderBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  genderText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  genderTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
});