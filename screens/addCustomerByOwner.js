import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
// const GENDERS = ['Male', 'Female'];

export default function AddCustomer() {
  const [formVisible, setFormVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    area_id: '',
    daily_milk_needed: '',
    // extra_milk_if_needed: '',
    milk_category: [],
    delivery_time: '',
    employee_id: '',

  });

  const [dropdowns, setDropdowns] = useState({
    gender: false,
    area: false,
    employee: false,
  });

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/areas')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAreas(data.areas);
      });

    fetch('http://192.168.43.175:3000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success) setEmployees(data.employees);
      });
  }, []);

  const handleAddCustomer = async () => {
    const requiredFields = ['name', 'phone', 'password', 'address', 'area_id', 'daily_milk_needed', 'milk_category', 'delivery_time'];
    for (let field of requiredFields) {
      if (!form[field]) return alert('Please fill all required fields');
    }

    try {
      const res = await fetch('http://192.168.43.175:3000/api/add-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('Customer added');
        setFormVisible(false);
        setForm({
          name: '', phone: '', password: '', address: '',
          area_id: '', daily_milk_needed: '',
          milk_category: '', delivery_time: ''
        });
      } else alert('Failed to add');
    } catch {
      alert('Server error');
    }
  };

  // const CARD_WIDTH = width - 24;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f1f6fd" barStyle="dark-content" />
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setFormVisible(true)}>
          <MaterialIcons name="add" size={28} color="#2563eb" />
          <Text style={styles.addBtnText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={formVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFormVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFormVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.centeredView}>
            <Pressable style={styles.formBox}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.formTitle}>Add Customer</Text>

                <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} />
                <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={form.phone} onChangeText={t => setForm({ ...form, phone: t.replace(/[^0-9]/g, '') })} maxLength={10} />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} />
                <TextInput style={styles.input} placeholder="Address" value={form.address} onChangeText={t => setForm({ ...form, address: t })} />

                {/* Area Dropdown */}
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdowns({ ...dropdowns, area: !dropdowns.area })}>
                  <Text style={styles.dropdownText}>{areas.find(a => a.id === form.area_id)?.landmark || 'Select Area'}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>
                {dropdowns.area && (
                  <View style={styles.dropdownList}>
                    {areas.map(a => (
                      <TouchableOpacity key={a.id} style={styles.dropdownItem} onPress={() => setForm({ ...form, area_id: a.id }) || setDropdowns({ ...dropdowns, area: false })}>
                        <Text style={styles.dropdownText}>{a.landmark}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Employee Dropdown */}
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdowns({ ...dropdowns, employee: !dropdowns.employee })}>
                  <Text style={styles.dropdownText}>{employees.find(e => e.id === form.employee_id)?.name || 'Select Employee'}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>
                {dropdowns.employee && (
                  <View style={styles.dropdownList}>
                    {employees.map(e => (
                      <TouchableOpacity key={e.id} style={styles.dropdownItem} onPress={() => setForm({ ...form, employee_id: e.id }) || setDropdowns({ ...dropdowns, employee: false })}>
                        <Text style={styles.dropdownText}>{e.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Gender Dropdown */}
                {/* <TouchableOpacity style={styles.dropdown} onPress={() => setDropdowns({ ...dropdowns, gender: !dropdowns.gender })}>
                  <Text style={styles.dropdownText}>{form.gender}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>
                {dropdowns.gender && (
                  <View style={styles.dropdownList}>
                    {GENDERS.map(g => (
                      <TouchableOpacity key={g} style={styles.dropdownItem} onPress={() => setForm({ ...form, gender: g }) || setDropdowns({ ...dropdowns, gender: false })}>
                        <Text style={styles.dropdownText}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )} */}

                <TextInput style={styles.input} placeholder="Delivery Time (Morning/Evening)" value={form.delivery_time} onChangeText={t => setForm({ ...form, delivery_time: t })} />
                <TextInput style={styles.input} placeholder="Daily Milk Needed" keyboardType="numeric" value={form.daily_milk_needed} onChangeText={t => setForm({ ...form, daily_milk_needed: t })} />
                {/* <TextInput style={styles.input} placeholder="Extra Milk If Needed" keyboardType="numeric" value={form.extra_milk_if_needed} onChangeText={t => setForm({ ...form, extra_milk_if_needed: t })} /> */}
                <Text style={styles.label}>Milk Category</Text>
                <View style={styles.checkboxRow}>
                  <TouchableOpacity
                    style={styles.checkboxItem}
                    onPress={() => {
                      const current = form.milk_category;
                      const updated = current.includes('cows')
                        ? current.filter(cat => cat !== 'cows')
                        : [...current, 'cows'];
                      setForm({ ...form, milk_category: updated });
                    }}
                  >
                    <MaterialIcons
                      name={form.milk_category.includes('cows') ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color="#2563eb"
                    />
                    <Text style={styles.checkboxLabel}>Cow's Milk</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxItem}
                    onPress={() => {
                      const current = form.milk_category;
                      const updated = current.includes('buffalo')
                        ? current.filter(cat => cat !== 'buffalo')
                        : [...current, 'buffalo'];
                      setForm({ ...form, milk_category: updated });
                    }}
                  >
                    <MaterialIcons
                      name={form.milk_category.includes('buffalo') ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color="#2563eb"
                    />
                    <Text style={styles.checkboxLabel}>Buffalo's Milk</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleAddCustomer}>
                  <Text style={styles.submitBtnText}>Add Customer</Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1e293b',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#e0e7ff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
    elevation: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    marginLeft: 0,
  },
  addBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,58,138,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: width * 0.95,
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f5ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    color: '#1e293b',
    marginBottom: 10,
    width: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 10,
    marginTop: -10,
    zIndex: 10,
    width: '100%',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  selectedDropdownItem: {
    backgroundColor: '#e0e7ff',
  },
  selectedDropdownText: {
    color: '#1e40af',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 2,
    width: '100%',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 70,
    maxWidth: width - 20,
  },
  customerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
    flexShrink: 1,
    maxWidth: width * 0.5,
  },
  customerInfo: {
    fontSize: 14,
    color: '#475569',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: width * 0.5,
  },
  actionCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  editBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  activeStatus: {
    backgroundColor: '#dcfce7',
  },
  deactiveStatus: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  activeStatusText: {
    color: '#22c55e',
  },
  deactiveStatusText: {
    color: '#ef4444',
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 2,
    minWidth: 80,
    justifyContent: 'space-between',
  },
  filterDropdownText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
    paddingLeft: 10,
  },
  filterDropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    zIndex: 20,
    width: 110,
    elevation: 5,
  },
});