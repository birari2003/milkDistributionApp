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

export default function AddCustomer() {
  const [formVisible, setFormVisible] = useState(false);
  const [areas, setAreas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [filterTab, setFilterTab] = useState('region');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [dropdowns, setDropdowns] = useState({
    area: false,
    employee: false,
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    area_id: '',
    daily_milk_needed: '',
    milk_category: [],
    delivery_time: '',
    employee_id: '',
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

    fetch('http://192.168.43.175:3000/api/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAllCustomers(data.customers);
          setFilteredCustomers(data.customers);
        }
      });
  }, []);

  const applyFilters = (region, employee) => {
    const filtered = allCustomers.filter(c => {
      const regionMatch = region ? c.area_name === region.landmark : true;
      const employeeMatch = employee ? c.employee_name === employee.name : true;
      return regionMatch && employeeMatch;
    });
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setSelectedRegion(null);
    setSelectedEmployee(null);
    setFilteredCustomers(allCustomers);
  };

  const handleAddCustomer = async () => {
    const requiredFields = ['name', 'phone', 'password', 'address', 'area_id', 'daily_milk_needed', 'milk_category', 'delivery_time'];
    for (let field of requiredFields) {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
        return alert('Please fill all required fields');
      }
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
          name: '',
          phone: '',
          password: '',
          address: '',
          area_id: '',
          daily_milk_needed: '',
          milk_category: [],
          delivery_time: '',
          employee_id: '',
        });
      } else {
        alert('Failed to add');
      }
    } catch {
      alert('Server error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f1f6fd" barStyle="dark-content" />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setFormVisible(true)}>
          <MaterialIcons name="add" size={28} color="#2563eb" />
          <Text style={styles.addBtnText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.tab, filterTab === 'region' && styles.activeTab]}
          onPress={() => setFilterTab('region')}
        >
          <Text style={styles.tabText}>Region</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filterTab === 'employee' && styles.activeTab]}
          onPress={() => setFilterTab('employee')}
        >
          <Text style={styles.tabText}>Employee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
        >
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Filters */}
      <View style={styles.selectedFilters}>
        {selectedRegion && <Text>🗺️ Region: {selectedRegion.landmark}</Text>}
        {selectedEmployee && <Text>👤 Employee: {selectedEmployee.name}</Text>}
      </View>

      {/* Dynamic Dropdown */}
      <View style={styles.dropdownList}>
        {(filterTab === 'region' ? areas : employees).map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.dropdownItem}
            onPress={() => {
              if (filterTab === 'region') {
                setSelectedRegion(item);
                applyFilters(item, selectedEmployee);
              } else {
                setSelectedEmployee(item);
                applyFilters(selectedRegion, item);
              }
            }}
          >
            <Text style={styles.dropdownText}>
              {filterTab === 'region' ? item.landmark : item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.deliveryTime}>Delivery: {item.delivery_time}</Text>
            <Text style={styles.meta}>Area: {item.area_name}</Text>
            <Text style={styles.meta}>Employee: {item.employee_name}</Text>
          </View>
        )}
      />

      {/* Add Customer Modal */}
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
                      <TouchableOpacity key={a.id} style={styles.dropdownItem} onPress={() => { setForm({ ...form, area_id: a.id }); setDropdowns({ ...dropdowns, area: false }); }}>
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
                      <TouchableOpacity key={e.id} style={styles.dropdownItem} onPress={() => { setForm({ ...form, employee_id: e.id }); setDropdowns({ ...dropdowns, employee: false }); }}>
                        <Text style={styles.dropdownText}>{e.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TextInput style={styles.input} placeholder="Delivery Time (Morning/Evening)" value={form.delivery_time} onChangeText={t => setForm({ ...form, delivery_time: t })} />
                <TextInput style={styles.input} placeholder="Daily Milk Needed" keyboardType="numeric" value={form.daily_milk_needed} onChangeText={t => setForm({ ...form, daily_milk_needed: t })} />
                
                <Text style={styles.label}>Milk Category</Text>
                <View style={styles.checkboxRow}>
                  {['cows', 'buffalo'].map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.checkboxItem}
                      onPress={() => {
                        const updated = form.milk_category.includes(cat)
                          ? form.milk_category.filter(c => c !== cat)
                          : [...form.milk_category, cat];
                        setForm({ ...form, milk_category: updated });
                      }}
                    >
                      <MaterialIcons
                        name={form.milk_category.includes(cat) ? 'check-box' : 'check-box-outline-blank'}
                        size={22}
                        color="#2563eb"
                      />
                      <Text style={styles.checkboxLabel}>{cat === 'cows' ? "Cow's Milk" : "Buffalo's Milk"}</Text>
                    </TouchableOpacity>
                  ))}
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

// You can plug your existing `styles` object here or ask for it if needed


const styles = StyleSheet.create({

    safeArea: { flex: 1, backgroundColor: '#f1f6fd' },
  headerRow: {
    padding: 10,
    alignItems: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3ecfb',
    padding: 10,
    borderRadius: 10,
  },
  addBtnText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedFilters: {
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  dropdownList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 14,
    borderRadius: 10,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  phone: { fontSize: 14, color: '#555' },
  address: { fontSize: 14, color: '#777' },
  deliveryTime: { fontSize: 14, color: '#333', marginTop: 6 },
  meta: { fontSize: 13, color: '#888', marginTop: 2 },
  checkboxRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  tab: {
  padding: 10,
  marginHorizontal: 5,
  borderRadius: 6,
  backgroundColor: '#e0e0e0',
},
activeTab: {
  backgroundColor: '#2563eb',
},
tabText: {
  color: '#fff',
  fontWeight: 'bold',
},
meta: {
  fontSize: 13,
  color: '#666',
  marginTop: 2,
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