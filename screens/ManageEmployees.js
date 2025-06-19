import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal,
  Pressable, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, ScrollView,
  useWindowDimensions, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AddEmployee() {
  const [formVisible, setFormVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('active');
  const [editId, setEditId] = useState(null);

  const [areaFilter, setAreaFilter] = useState('All');
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 24;
  const MODAL_WIDTH = width > 600 ? width * 0.6 : width * 0.95;

  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setPassword('');
    setArea('');
    setStatus('active');
    setEditId(null);
  };

  const fetchAreas = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/areas');
      const data = await res.json();
      if (data.success) setAreas(data.areas);
      else Alert.alert('Error', 'Failed to fetch areas');
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/employees');
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
      else Alert.alert('Error', 'Could not fetch employee list');
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchEmployees();
  }, []);

const handleAddOrEdit = async () => {
  // Validation
  if (!name || !phone || !address || !area || (!editId && !password)) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  const payload = {
    name,
    contact: phone,
    address,
    area_id: area,
    status,
    ...(password && { password }),
    ...(editId && { id: editId })
  };

  const url = editId
    ? 'http://192.168.43.175:3000/api/update-employee'
    : 'http://192.168.43.175:3000/api/add-employee';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      fetchEmployees(); // Refresh list
      setFormVisible(false); // Close modal
      resetForm(); // Clear form
      Alert.alert('Success', editId ? 'Employee updated successfully' : 'Employee added successfully');
    } else {
      Alert.alert('Error', data.message || 'Operation failed');
    }
  } catch (err) {
    console.error('API Error:', err);
    Alert.alert('Error', 'Something went wrong while submitting data');
  }
};

const handleEdit = (emp) => {
  setEditId(emp.id);
  setName(emp.name);
  setPhone(emp.contact);
  setAddress(emp.address);
  setPassword(''); // Leave empty on edit (user can re-enter)
  setArea(emp.area_id);
  setStatus(emp.status || 'active');
  setFormVisible(true);
};



  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleOutsidePress = () => {
    setFormVisible(false);
    setDropdownVisible(false);
    resetForm();
  };

  const filteredEmployees =
    areaFilter === 'All'
      ? employees
      : employees.filter((emp) => emp.area_name === areaFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Employee</Text>
        <TouchableOpacity onPress={() => setFormVisible(true)} style={styles.addBtn}>
          <MaterialIcons name="add" size={28} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Area Filter Dropdown */}
      <View style={styles.filterDropdownContainer}>
        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setFilterDropdownVisible((v) => !v)}
        >
          <MaterialIcons name="filter-list" size={22} color="#2563eb" />
          <Text style={styles.filterDropdownText}>
            {areaFilter === 'All' ? 'All Areas' : areaFilter}
          </Text>
          <MaterialIcons
            name={filterDropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={24}
            color="#2563eb"
          />
        </TouchableOpacity>
        {filterDropdownVisible && (
          <View style={styles.filterDropdownList}>
            <TouchableOpacity
              style={styles.filterDropdownItem}
              onPress={() => {
                setAreaFilter('All');
                setFilterDropdownVisible(false);
              }}
            >
              <Text style={styles.filterDropdownText}>All Areas</Text>
            </TouchableOpacity>
            {areas.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={styles.filterDropdownItem}
                onPress={() => {
                  setAreaFilter(a.landmark);
                  setFilterDropdownVisible(false);
                }}
              >
                <Text style={styles.filterDropdownText}>{a.landmark}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Modal Form */}
      <Modal
        visible={formVisible}
        transparent
        animationType="fade"
        onRequestClose={handleOutsidePress}
      >
        <Pressable style={styles.modalOverlay} onPress={handleOutsidePress}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.centeredView}
          >
            <ScrollView contentContainerStyle={styles.scrollFormBox} keyboardShouldPersistTaps="handled">
              <Pressable style={[styles.formBox, { width: MODAL_WIDTH }]} onPress={() => setDropdownVisible(false)}>
                <Text style={styles.formTitle}>{editId ? 'Edit Employee' : 'Add Employee'}</Text>
                <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={10} />
                <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
                
                <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownVisible((v) => !v)}>
                  <Text style={styles.dropdownText}>
                    {area ? areas.find((a) => a.id === area)?.landmark || 'Select Area' : 'Select Area'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#2563eb" />
                </TouchableOpacity>
                {dropdownVisible && (
                  <View style={styles.dropdownList}>
                    {areas.map((a) => (
                      <TouchableOpacity
                        key={a.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setArea(a.id);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{a.landmark}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {editId && (
                  <View style={styles.statusRow}>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        status === 'active' && styles.statusBtnActive,
                      ]}
                      onPress={() => handleStatusChange('active')}
                    >
                      <MaterialIcons name="check-circle" size={20} color="#22c55e" />
                      <Text style={styles.statusBtnText}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        status === 'inactive' && styles.statusBtnInactive,
                      ]}
                      onPress={() => handleStatusChange('inactive')}
                    >
                      <MaterialIcons name="cancel" size={20} color="#ef4444" />
                      <Text style={styles.statusBtnText}>Inactive</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity style={styles.submitBtn} onPress={handleAddOrEdit}>
                  <Text style={styles.submitBtnText}>
                    {editId ? 'Save Changes' : 'Add Employee'}
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <View style={[styles.empCard, { width: CARD_WIDTH }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.empName}>{item.name}</Text>
              <Text style={styles.empInfo}>📞 {item.contact}</Text>
              <Text style={styles.empInfo}>📍 {item.area_name}</Text>
              <Text style={[styles.empInfo, { color: item.status === 'active' ? '#22c55e' : '#ef4444' }]}>
                {item.status === 'active' ? '✅ Active' : '❌ Inactive'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
              <MaterialIcons name="edit" size={22} color="#2563eb" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No employees yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appNameBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  appName: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
    elevation: 2,
  },
  headerTitle: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 17,
    flex: 1,
    textAlign: 'left',
  },
  addBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    marginLeft: 10,
  },
  filterDropdownContainer: {
    backgroundColor: '#f1f6fd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    zIndex: 20,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    width: 170,
    alignSelf: 'flex-start',
  },
  filterDropdownText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  filterDropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginTop: 4,
    position: 'absolute',
    left: 16,
    top: 48,
    width: 170,
    zIndex: 30,
    elevation: 8,
  },
  filterDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,58,138,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  scrollFormBox: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
    minHeight: '100%',
    paddingVertical: 30,
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
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    flex: 1,
    marginRight: 8,
  },
  genderBtnActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  genderBtnActiveFemale: {
    backgroundColor: '#fefce8',
    borderColor: '#facc15',
  },
  genderText: {
    marginLeft: 6,
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  genderTextActive: {
    color: '#22c55e',
  },
  genderTextActiveFemale: {
    color: '#facc15',
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 2,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    backgroundColor: '#e0e7ff',
    flex: 1,
    marginRight: 8,
  },
  statusBtnActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  statusBtnInactive: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  statusBtnText: {
    marginLeft: 6,
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  statusBtnTextActive: {
    color: '#22c55e',
  },
  statusBtnTextInactive: {
    color: '#ef4444',
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
  empCard: {
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
    maxWidth: 600,
    width: '100%',
  },
  empProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  profileImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  empName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
    flexShrink: 1,
    maxWidth: 200,
  },
  empInfo: {
    fontSize: 14,
    color: '#475569',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: 200,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  editBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
    },
});

