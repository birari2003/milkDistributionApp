// import React, { useEffect, useState } from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const AddCustomer = () => {
//   const [areas, setAreas] = useState([]);

// const [form, setForm] = useState({
//   name: '',
//   phone: '',
//   password: '',
//   address: '',
//   area_id: '',
//   daily_milk_needed: '',
//   extra_milk_if_needed: '',
//   milk_category: '',
//   delivery_time: '', // <-- new
// });



//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetch('http://192.168.43.175:3000/api/areas')
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setAreas(data.areas);
//         }
//       })
//       .catch(err => console.error(err));
//   }, []);

//   const validate = () => {
//     const errs = {};

//     if (!form.name.trim()) errs.name = 'Name is required.';
//     if (!form.phone.trim()) errs.phone = 'Phone number is required.';
//     else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits.';
//     if (!form.password) errs.password = 'Password is required.';
//     else if (form.password.length < 6) errs.password = 'Min 6 characters required.';
//     if (!form.address.trim()) errs.address = 'Address is required.';
//     if (!form.area_id) errs.area_id = 'Please select an area.';
//     if (form.daily_milk_needed && isNaN(Number(form.daily_milk_needed)))
//       errs.daily_milk_needed = 'Must be a number.';
//     if (form.extra_milk_if_needed && isNaN(Number(form.extra_milk_if_needed)))
//       errs.extra_milk_if_needed = 'Must be a number.';
//     if (!form.delivery_time) errs.delivery_time = 'Please select delivery time.';


//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     try {
//       const response = await fetch('http://192.168.43.175:3000/api/add-customer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setMessage('✅ Customer added successfully!');
//         setForm({
//           name: '', phone: '', password: '', address: '',
//           area_id: '', daily_milk_needed: '', extra_milk_if_needed: '',
//         });
//         setErrors({});
//       } else {
//         setMessage('❌ Failed to add customer.');
//       }
//     } catch (err) {
//       setMessage('❌ Server error. Please try again.');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Add Customer</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={form.name}
//         onChangeText={text => setForm({ ...form, name: text })}
//       />
//       {errors.name && <Text style={styles.error}>{errors.name}</Text>}

//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         keyboardType="phone-pad"
//         value={form.phone}
//         onChangeText={text => setForm({ ...form, phone: text.replace(/[^0-9]/g, '') })}
//       />
//       {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={form.password}
//         onChangeText={text => setForm({ ...form, password: text })}
//       />
//       {errors.password && <Text style={styles.error}>{errors.password}</Text>}

//       <TextInput
//         style={styles.input}
//         placeholder="Address"
//         value={form.address}
//         onChangeText={text => setForm({ ...form, address: text })}
//       />
//       {errors.address && <Text style={styles.error}>{errors.address}</Text>}

//       <Text style={styles.label}>Select Area</Text>
//       <Picker
//         selectedValue={form.area_id}
//         onValueChange={itemValue => setForm({ ...form, area_id: itemValue })}
//       >
//         <Picker.Item label="Select Area" value="" />
//         {areas.map(area => (
//           <Picker.Item key={area.id} label={area.landmark} value={area.id} />
//         ))}
//       </Picker>
//       {errors.area_id && <Text style={styles.error}>{errors.area_id}</Text>}
// <Text style={styles.label}>Preferred Delivery Time</Text>
// <Picker
//   selectedValue={form.delivery_time}
//   onValueChange={value => setForm({ ...form, delivery_time: value })}
// >
//   <Picker.Item label="Select Time" value="" />
//   <Picker.Item label="Morning" value="morning" />
//   <Picker.Item label="Evening" value="evening" />
// </Picker>
// {errors.delivery_time && <Text style={styles.error}>{errors.delivery_time}</Text>}

//       <TextInput
//         style={styles.input}
//         placeholder="Daily Milk Needed (Litres)"
//         keyboardType="numeric"
//         value={form.daily_milk_needed}
//         onChangeText={text => setForm({ ...form, daily_milk_needed: text })}
//       />
//       {errors.daily_milk_needed && <Text style={styles.error}>{errors.daily_milk_needed}</Text>}

//       <Text style={styles.label}>Milk Category</Text>
//       <Picker
//         selectedValue={form.milk_category}
//         onValueChange={value => setForm({ ...form, milk_category: value })}
//       >
//         <Picker.Item label="Select Milk Category" value="" />
//         <Picker.Item label="Cow's Milk" value="cows" />
//         <Picker.Item label="Buffalo's Milk" value="buffalo" />
//       </Picker>
//       {errors.milk_category && <Text style={styles.error}>{errors.milk_category}</Text>}


//       <Button title="Add Customer" onPress={handleSubmit} />

//       {message !== '' && (
//         <Text style={styles.successMessage}>{message}</Text>
//       )}
//     </ScrollView>

//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 24, textAlign: 'center', marginVertical: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
//   error: { color: 'red', marginBottom: 10, marginLeft: 5, fontSize: 13 },
//   successMessage: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: 'green',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default AddCustomer;




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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
const genderColors = {
  Male: '#2563eb',      // blue
  Female: '#f472b6',    // pink
  Other: '#a21caf',     // purple
};

const milkColors = {
  cow: '#22c55e',       // green
  buffalo: '#a21caf',   // purple
};

const EMPLOYEE_REGION = 'MIDC Area'; // Static region for all customers

const STATIC_CUSTOMERS = [
  {
    id: '1',
    name: 'Aashish Kumar',
    mobile: '9876543210',
    gender: 'Male',
    address: '123 Main Street',
    cowMilk: '2',
    buffaloMilk: '1',
    region: EMPLOYEE_REGION,
  },
  {
    id: '2',
    name: 'Vedant',
    mobile: '9123456789',
    gender: 'Female',
    address: '45 Rose Lane',
    cowMilk: '1',
    buffaloMilk: '2',
    region: EMPLOYEE_REGION,
  },
 
];

export default function AddCustomerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    gender: '',
    address: '',
    cowMilk: '',
    buffaloMilk: '',
    region: EMPLOYEE_REGION,
  });
  const [customers, setCustomers] = useState(STATIC_CUSTOMERS);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddCustomer = () => {
    if (!form.name || !form.mobile || !form.gender) return;
    setCustomers([
      ...customers,
      {
        ...form,
        id: Date.now().toString(),
      },
    ]);
    setModalVisible(false);
    setForm({
      name: '',
      mobile: '',
      gender: '',
      address: '',
      cowMilk: '',
      buffaloMilk: '',
      region: EMPLOYEE_REGION,
    });
  };

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerIconBox}>
        <MaterialCommunityIcons
          name={
            item.gender === 'Male'
              ? 'account'
              : item.gender === 'Female'
              ? 'account'
              : 'account-circle'
          }
          size={32}
          color={genderColors[item.gender] || '#a21caf'}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerMobile}>
          <MaterialCommunityIcons name="phone" size={15} color="#60a5fa" /> {item.mobile}
        </Text>
        <Text style={styles.customerAddress}>{item.address}</Text>
        <Text style={styles.customerRegion}>
          <MaterialCommunityIcons name="map-marker" size={14} color="#a21caf" /> {item.region}
        </Text>
        <View style={styles.milkRow}>
          <View style={styles.milkTypeBox}>
            <MaterialCommunityIcons name="cow" size={18} color={milkColors.cow} />
            <Text style={[styles.milkTypeLabel, { color: milkColors.cow }]}>Cow:</Text>
            <Text style={[styles.milkTypeValue, { color: milkColors.cow }]}>{item.cowMilk || 0} L</Text>
          </View>
          <View style={styles.milkTypeBox}>
            <MaterialCommunityIcons name="cow" size={18} color={milkColors.buffalo} />
            <Text style={[styles.milkTypeLabel, { color: milkColors.buffalo }]}>Buffalo:</Text>
            <Text style={[styles.milkTypeValue, { color: milkColors.buffalo }]}>{item.buffaloMilk || 0} L</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <MaterialCommunityIcons name="account-plus" size={28} color="#2563eb" />
        <Text style={styles.headerTitle}>Add Customer</Text>
      </View>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Add Customer</Text>
      </TouchableOpacity>

      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderCustomer}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#aaa', marginTop: 30 }}>
            No customers added yet.
          </Text>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalBox} onPress={() => {}}>
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
                  onChangeText={text => handleChange('name', text)}
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
                  onChangeText={text => handleChange('mobile', text)}
                />
              </View>
              {/* Gender */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="gender-male-female" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <View style={[styles.genderRow, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[
                      styles.genderBtn,
                      form.gender === 'Male' && styles.genderBtnActive,
                    ]}
                    onPress={() => handleChange('gender', 'Male')}
                  >
                    <Text style={form.gender === 'Male' ? styles.genderTextActive : [styles.genderText, { color: genderColors.Male }]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderBtn,
                      form.gender === 'Female' && styles.genderBtnActive,
                    ]}
                    onPress={() => handleChange('gender', 'Female')}
                  >
                    <Text style={form.gender === 'Female' ? styles.genderTextActive : [styles.genderText, { color: genderColors.Female }]}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderBtn,
                      form.gender === 'Other' && styles.genderBtnActive,
                    ]}
                    onPress={() => handleChange('gender', 'Other')}
                  >
                    <Text style={form.gender === 'Other' ? styles.genderTextActive : [styles.genderText, { color: genderColors.Other }]}>Other</Text>
                  </TouchableOpacity>
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
                  onChangeText={text => handleChange('address', text)}
                  multiline
                />
              </View>
              {/* Region */}
              <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="map-marker" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.inputBox, { backgroundColor: '#f3f4f6', color: '#2563eb', flex: 1 }]}
                  value={EMPLOYEE_REGION}
                  editable={false}
                  placeholder="Region"
                  placeholderTextColor="#2563eb"
                />
              </View>
              {/* Cow & Buffalo in one row */}
              <View style={[styles.inputGroup, { flexDirection: 'row', gap: 10 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: '#2563eb' }]}>Cow Milk (L/day)</Text>
                  <TextInput
                    style={[styles.inputBox, { color: '#2563eb' }]}
                    placeholder="Cow"
                    placeholderTextColor="#2563eb"
                    keyboardType="numeric"
                    value={form.cowMilk}
                    onChangeText={text => handleChange('cowMilk', text)}
                    maxLength={3}
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
                    onChangeText={text => handleChange('buffaloMilk', text)}
                    maxLength={3}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddCustomer}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
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