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
import { Picker } from '@react-native-picker/picker';


const { width } = Dimensions.get('window');

export default function AddCustomer() {
  const [formVisible, setFormVisible] = useState(false);
  const [areas, setAreas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [filterTab, setFilterTab] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [dropdowns, setDropdowns] = useState({
    area: false,
    employee: false,
    gender: false,
    delivery_time: false,
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
        if (data.success) {
          setEmployees(data.employees);
          setFilteredEmployees(data.employees);
        }
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
    setFilteredEmployees(employees);
    setFilterTab(null);
    setFilteredCustomers(allCustomers);
  };

  const handleAddCustomer = async () => {
    const requiredFields = ['name', 'phone', 'password', 'address', 'area_id', 'employee_id', 'daily_milk_needed', 'milk_category', 'delivery_time'];
    for (let field of requiredFields) {
      if (!form[field] || (Array.isArray(form[field]) && form[field].length === 0)) {
        console.log('Form Data:', form);

        return alert('Please fill all required fields');
      }
    }

    // Convert milk_category array to ENUM-compatible value
    let milkCategoryValue = '';
    if (form.milk_category.includes('cows') && form.milk_category.includes('buffalo')) {
      milkCategoryValue = 'both';
    } else if (form.milk_category.includes('cows')) {
      milkCategoryValue = 'cow';
    } else if (form.milk_category.includes('buffalo')) {
      milkCategoryValue = 'buffalo';
    } else {
      return alert('Please select at least one milk category');
    }

    try {
      const res = await fetch('http://192.168.43.175:3000/api/add-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          employee_assigned: form.employee_id,
          milk_category: milkCategoryValue,
          delivery_time: form.delivery_time,
          gender: form.gender,
        }),
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
          employee_id: '',
          daily_milk_needed: '',
          milk_category: [],
          delivery_time: '',
          gender: '',
        });
      } else {
        alert('Failed to add: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Server error');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f1f6fd" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setFormVisible(true)}>
          <MaterialIcons name="add" size={24} color="#2563eb" />
          <Text style={styles.addBtnText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setFilterTab(prev => (prev === 'region' ? null : 'region'))}>
          <Text style={styles.tabText}>{selectedRegion?.landmark || 'Region'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setFilterTab(prev => (prev === 'employee' ? null : 'employee'))}>
          <Text style={styles.tabText}>{selectedEmployee?.name || 'Employee'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdowns */}
      {filterTab === 'region' && (
        <View style={styles.dropdownList}>
          {areas.map(item => (
            <TouchableOpacity key={item.id} style={styles.dropdownItem}
              onPress={() => {
                setSelectedRegion(item);
                const emps = employees.filter(e => e.area_id === item.id);
                setFilteredEmployees(emps);
                if (!emps.find(e => e.id === selectedEmployee?.id)) {
                  setSelectedEmployee(null);
                }
                applyFilters(item, selectedEmployee?.area_id === item.id ? selectedEmployee : null);
                setFilterTab(null);
              }}
            >
              <Text style={styles.dropdownText}>{item.landmark}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {filterTab === 'employee' && (
        <View style={styles.dropdownList}>
          {filteredEmployees.map(item => (
            <TouchableOpacity key={item.id} style={styles.dropdownItem}
              onPress={() => {
                setSelectedEmployee(item);
                applyFilters(selectedRegion, item);
                setFilterTab(null);
              }}
            >
              <Text style={styles.dropdownText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>📞 {item.phone}</Text>
            </View>

            <Text style={styles.address}>🏠 {item.address}</Text>

            <View style={styles.rowBetween}>
              <Text style={styles.deliveryTime}>🕒 Delivery: {item.delivery_time}</Text>
              <Text style={styles.meta}>📍 {item.area_name}</Text>
            </View>

            <Text style={styles.meta}>👤 Assigned: {item.employee_name}</Text>
          </View>
        )}
      />


      {/* Modal */}
      <Modal visible={formVisible} transparent animationType="fade" onRequestClose={() => setFormVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFormVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.centeredView}
          >
            <Pressable
              style={styles.formBox}
              onPress={(e) => e.stopPropagation()} // Prevent dismiss when pressing inside the form
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.formTitle}>Add Customer</Text>

                <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} />
                <TextInput style={styles.input} placeholder="Phone" keyboardType="number-pad" maxLength={10} value={form.phone} onChangeText={t => setForm({ ...form, phone: t.replace(/[^0-9]/g, '') })} />
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
                      <TouchableOpacity key={a.id} style={styles.dropdownItem} onPress={() => {
                        setForm({ ...form, area_id: a.id, employee_id: '' });
                        const emps = employees.filter(e => e.area_id === a.id);
                        setFilteredEmployees(emps);
                        setDropdowns({ ...dropdowns, area: false });
                      }}
                      >
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
                    {filteredEmployees.map(e => (
                      <TouchableOpacity key={e.id} style={styles.dropdownItem} onPress={() => { setForm({ ...form, employee_id: e.id }); setDropdowns({ ...dropdowns, employee: false }); }}>
                        <Text style={styles.dropdownText}>{e.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() =>
                    setDropdowns({ ...dropdowns, delivery_time: !dropdowns.delivery_time })
                  }
                >
                  <Text style={styles.dropdownText}>
                    {form.delivery_time
                      ? form.delivery_time.charAt(0).toUpperCase() +
                      form.delivery_time.slice(1)
                      : 'Select Delivery Time'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>

                {dropdowns.delivery_time && (
                  <View style={styles.dropdownList}>
                    {['morning', 'evening'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setForm({ ...form, delivery_time: time });
                          setDropdowns({ ...dropdowns, delivery_time: false });
                        }}
                      >
                        <Text style={styles.dropdownText}>
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}


                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setDropdowns({ ...dropdowns, gender: !dropdowns.gender })}
                >
                  <Text style={styles.dropdownText}>
                    {form.gender
                      ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1)
                      : 'Select Gender'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>

                {dropdowns.gender && (
                  <View style={styles.dropdownList}>
                    {['male', 'female', 'other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setForm({ ...form, gender });
                          setDropdowns({ ...dropdowns, gender: false });
                        }}
                      >
                        <Text style={styles.dropdownText}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}



                <TextInput style={styles.dropdown} placeholder="Daily Milk Needed (L)" keyboardType="numeric" value={form.daily_milk_needed} onChangeText={t => setForm({ ...form, daily_milk_needed: t })} />

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'left',
    justifyContent: 'flex-start',
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
    elevation: 2,
  },
  addBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  pickerWrapper: {
    backgroundColor: '#f1f5ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 12,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: '#1e293b', // dark slate for readability
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 50,
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#f1f5ff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#f1f6fd',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  resetBtnText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  selectedFilters: {
    paddingHorizontal: 16,
    paddingVertical: 6,
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
  dropdownText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '500',
  },



  card: {
    backgroundColor: '#c2d5fe',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },

  phone: {
    fontSize: 13,
    color: '#334155',
  },

  address: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
  },

  deliveryTime: {
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '500',
  },

  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },





  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,58,138,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 8,
    shadowColor: '#2563eb',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    width: '90%',
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
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 6,
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '500',
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
});
