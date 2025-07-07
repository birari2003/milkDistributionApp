// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   SafeAreaView, ScrollView, Dimensions, Platform, Alert
// } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { toTitleCase } from './utils';

// const { width } = Dimensions.get('window');

// export default function MilkDeliveryScreen() {
//   const [customers, setCustomers] = useState([]);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [inputs, setInputs] = useState({});
//   const [assigned, setAssigned] = useState({});
//   const [editing, setEditing] = useState({});
//   const [showExtra, setShowExtra] = useState({});
//   const [error, setError] = useState({});

//   const getCardWidth = () => {
//     if (width > 900) return 600;
//     if (width > 600) return 420;
//     if (width > 400) return 340;
//     return width - 24;
//   };

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem('user');
//       const user = JSON.parse(userStr);
//       if (user?.id) {
//         setEmployeeId(user.id);

//         const res = await fetch(`http://192.168.43.175:3000/api/customers?employee_id=${user.id}`);
//         const data = await res.json();
//         if (data.success && data.customers) {
//           setCustomers(data.customers);

//           const initInputs = {}, initAssigned = {}, initEditing = {},
//                 initExtra = {}, initErrors = {};

//           for (let cust of data.customers) {
//             initInputs[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
//             initAssigned[cust.id] = false;
//             initEditing[cust.id] = true;
//             initExtra[cust.id] = false;
//             initErrors[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
//           }

//           setInputs(initInputs);
//           setAssigned(initAssigned);
//           setEditing(initEditing);
//           setShowExtra(initExtra);
//           setError(initErrors);

//           // Check report exists
//           for (let cust of data.customers) {
//             const checkRes = await fetch(`http://192.168.43.175:3000/api/check-daily-report?customer_id=${cust.id}`);
//             const checkData = await checkRes.json();
//             if (checkData.success && checkData.exists) {
//               setAssigned(prev => ({ ...prev, [cust.id]: true }));
//               setEditing(prev => ({ ...prev, [cust.id]: false }));
//             }
//           }
//         }
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to fetch customers');
//     }
//   };

//   fetchData();
// }, []);

//   const handleInputChange = (custId, type, value) => {
//     let val = value.replace(/[^0-9]/g, '');
//     if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
//     if (val !== '' && parseInt(val) > 100) {
//       setInputs(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: '' } }));
//       setError(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: 'Value exceeds 100' } }));
//     } else {
//       setInputs(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: val } }));
//       setError(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: '' } }));
//     }
//   };

//   const handleAssign = async (custId) => {
//     const data = inputs[custId];
//     if (!data?.cow && !data?.buffalo) return Alert.alert('Error', 'Enter at least one milk value');

//     try {
//       const res = await fetch(`http://192.168.43.175:3000/api/add-daily-report`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           customer_id: custId,
//           got_cow_milk_today: true,
//           got_buffalo_milk_today: true,
//           will_get_cow_milk_tomorrow: true,
//           will_get_buffalo_milk_tomorrow: true,
//           extra_today: parseFloat(data.extraCow || 0) + parseFloat(data.extraBuffalo || 0),
//           extra_tomorrow: 0,
//           assigned_employee_id: employeeId,
//           override: false
//         })
//       });

//       const resData = await res.json();
//       if (resData.success) {
//         setAssigned(prev => ({ ...prev, [custId]: true }));
//         setEditing(prev => ({ ...prev, [custId]: false }));
//         Alert.alert('Success', 'Milk assigned');
//       } else {
//         Alert.alert('Error', resData.message || 'Submission failed');
//       }
//     } catch {
//       Alert.alert('Error', 'Server/network error');
//     }
//   };

//   const handleEdit = (custId) => {
//     setEditing(prev => ({ ...prev, [custId]: true }));
//     setAssigned(prev => ({ ...prev, [custId]: false }));
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {customers.map(cust => {
//           const { cow, buffalo, extraCow, extraBuffalo } = inputs[cust.id] || {};
//           const custError = error[cust.id] || {};

//           return (
//             <View key={cust.id} style={[styles.card, { width: getCardWidth(), alignSelf: 'center' }]}>
//               <View style={styles.infoRow}>
//                 {cust.gender === 'male'
//                   ? <FontAwesome5 name="male" size={22} color="#2563eb" style={{ marginRight: 8 }} />
//                   : <FontAwesome5 name="female" size={22} color="#f43f5e" style={{ marginRight: 8 }} />
//                 }
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.name}>{toTitleCase(cust.name)}</Text>
//                   <Text style={styles.phone}>
//                     <MaterialIcons name="phone" size={15} color="#2563eb" /> <Text style={{ color: '#2563eb' }}>{cust.phone}</Text>
//                   </Text>
//                 </View>
//               </View>

//               {assigned[cust.id] && !editing[cust.id] ? (
//                 <View style={styles.assignedMsgRow}>
//                   <Text style={styles.assignedMsg}>Milk Assigned</Text>
//                   <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(cust.id)}>
//                     <MaterialIcons name="edit" size={22} color="#2563eb" />
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <>
//                   <View style={styles.inputLabelRow}>
//                     <View style={{ flex: 1, marginRight: 6 }}>
//                       <Text style={styles.inputLabelCow}>Cow Milk (L)</Text>
//                       <TextInput
//                         style={styles.inputBox}
//                         keyboardType="numeric"
//                         value={cow}
//                         onChangeText={(text) => handleInputChange(cust.id, 'cow', text)}
//                         editable={editing[cust.id]}
//                         maxLength={3}
//                       />
//                       {custError.cow ? <Text style={styles.errorMsg}>{custError.cow}</Text> : null}
//                     </View>
//                     <View style={{ flex: 1, marginLeft: 6 }}>
//                       <Text style={styles.inputLabelBuffalo}>Buffalo Milk (L)</Text>
//                       <TextInput
//                         style={[styles.inputBox, { borderColor: '#f43f5e' }]}
//                         keyboardType="numeric"
//                         value={buffalo}
//                         onChangeText={(text) => handleInputChange(cust.id, 'buffalo', text)}
//                         editable={editing[cust.id]}
//                         maxLength={3}
//                       />
//                       {custError.buffalo ? <Text style={styles.errorMsg}>{custError.buffalo}</Text> : null}
//                     </View>
//                   </View>

//                   <TouchableOpacity
//                     style={styles.extraBtn}
//                     onPress={() => setShowExtra(prev => ({ ...prev, [cust.id]: !prev[cust.id] }))}
//                   >
//                     <Text style={styles.extraBtnText}>
//                       {showExtra[cust.id] ? 'Hide Extra' : 'Extra'}
//                     </Text>
//                   </TouchableOpacity>

//                   {showExtra[cust.id] && (
//                     <View style={styles.inputLabelRow}>
//                       <View style={{ flex: 1, marginRight: 6 }}>
//                         <Text style={styles.inputLabelCow}>Extra Cow Milk (L)</Text>
//                         <TextInput
//                           style={styles.inputBox}
//                           keyboardType="numeric"
//                           value={extraCow}
//                           onChangeText={(text) => handleInputChange(cust.id, 'extraCow', text)}
//                           editable={editing[cust.id]}
//                           maxLength={3}
//                         />
//                       </View>
//                       <View style={{ flex: 1, marginLeft: 6 }}>
//                         <Text style={styles.inputLabelBuffalo}>Extra Buffalo Milk (L)</Text>
//                         <TextInput
//                           style={[styles.inputBox, { borderColor: '#f43f5e' }]}
//                           keyboardType="numeric"
//                           value={extraBuffalo}
//                           onChangeText={(text) => handleInputChange(cust.id, 'extraBuffalo', text)}
//                           editable={editing[cust.id]}
//                           maxLength={3}
//                         />
//                       </View>
//                     </View>
//                   )}

//                   <View style={styles.actionRow}>
//                     <TouchableOpacity
//                       style={[
//                         styles.assignBtn,
//                         assigned[cust.id] && styles.assignedBtn,
//                         (!cow && !buffalo) && styles.disabledBtn,
//                       ]}
//                       onPress={() => handleAssign(cust.id)}
//                       disabled={(!cow && !buffalo) || assigned[cust.id]}
//                     >
//                       <Text style={[
//                         styles.assignBtnText,
//                         assigned[cust.id] && styles.assignedBtnText
//                       ]}>Assign</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}
//             </View>
//           );
//         })}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // ✅ Reuse your same styles as before here...


// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     paddingVertical: 18,
//     paddingBottom: 40,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 18,
//     elevation: 2,
//     shadowColor: '#2563eb',
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     borderWidth: 1,
//     borderColor: '#e0e7ef',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111',
//     marginBottom: 2,
//   },
//   phone: {
//     fontSize: 14,
//     color: '#2563eb',
//     marginBottom: 2,
//   },
//   inputLabelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   inputLabelCow: {
//     color: '#8b5cf6',
//     fontSize: 13,
//     marginBottom: 2,
//     fontWeight: 'bold',
//   },
//   inputLabelBuffalo: {
//     color: '#f43f5e',
//     fontSize: 13,
//     marginBottom: 2,
//     fontWeight: 'bold',
//   },
//   inputBox: {
//     backgroundColor: '#f8fafc',
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#8b5cf6',
//     color: '#111',
//     fontSize: 15,
//     paddingHorizontal: 10,
//     paddingVertical: Platform.OS === 'ios' ? 10 : 7,
//     width: '100%',
//   },
//   errorMsg: {
//     color: '#f43f5e',
//     fontSize: 12,
//     marginTop: 2,
//     marginLeft: 2,
//   },
//   extraBtn: {
//     alignSelf: 'flex-start',
//     marginBottom: 8,
//     marginTop: -2,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: '#e0e7ef',
//   },
//   extraBtnText: {
//     color: '#2563eb',
//     fontWeight: 'bold',
//     fontSize: 13,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   assignBtn: {
//     backgroundColor: '#2563eb',
//     borderRadius: 8,
//     paddingVertical: 11,
//     alignItems: 'center',
//     flex: 1,
//   },
//   assignBtnText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
//   assignedBtn: {
//     backgroundColor: '#22c55e',
//   },
//   assignedBtnText: {
//     color: '#fff',
//   },
//   assignedMsgRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#22c55e',
//     borderRadius: 8,
//     height: 48,
//     paddingHorizontal: 18,
//     justifyContent: 'space-between',
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   assignedMsg: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   disabledBtn: {
//     backgroundColor: '#bcd7fa',
//   },
//   editBtn: {
//     marginLeft: 10,
//     padding: 7,
//     borderRadius: 6,
//     backgroundColor: '#e0e7ef',
//     height: 34,
//     width: 34,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });







import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toTitleCase } from './utils';

const { width } = Dimensions.get('window');

export default function MilkDeliveryScreen() {
  const [customers, setCustomers] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [inputs, setInputs] = useState({});
  const [assigned, setAssigned] = useState({});
  const [showExtra, setShowExtra] = useState({});
  const [showPay, setShowPay] = useState({});
  const [editing, setEditing] = useState({});
  const [error, setError] = useState({});
  const [payment, setPayment] = useState({});
  const [paidStatus, setPaidStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStr);
        if (user?.id) {
          setEmployeeId(user.id);

          const res = await fetch(`http://192.168.43.175:3000/api/customers?employee_id=${user.id}`);
          const data = await res.json();

          if (data.success && data.customers) {
            setCustomers(data.customers);

            const initInputs = {}, initAssigned = {}, initEditing = {},
              initExtra = {}, initErrors = {}, initPayment = {}, initPaid = {};

            for (let cust of data.customers) {
              initInputs[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
              initAssigned[cust.id] = false;
              initEditing[cust.id] = true;
              initExtra[cust.id] = false;
              initErrors[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
              initPayment[cust.id] = { type: '', paid: '', remaining: '' };
              initPaid[cust.id] = false;
            }

            setInputs(initInputs);
            setAssigned(initAssigned);
            setEditing(initEditing);
            setShowExtra(initExtra);
            setError(initErrors);
            setPayment(initPayment);
            setPaidStatus(initPaid);

            console.log('✅ Customer data loaded:', data.customers);
          }
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        Alert.alert('Error', 'Failed to fetch customers');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (custId, type, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
    if (val !== '' && parseInt(val) > 100) {
      setInputs(prev => ({
        ...prev,
        [custId]: { ...prev[custId], [type]: '' },
      }));
      setError(prev => ({
        ...prev,
        [custId]: { ...prev[custId], [type]: 'Value exceeds above 100' },
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        [custId]: { ...prev[custId], [type]: val },
      }));
      setError(prev => ({
        ...prev,
        [custId]: { ...prev[custId], [type]: '' },
      }));
    }
  };

  const handleAssign = async (custId) => {
  const milk = inputs[custId];
  const pay = payment[custId];

  if (!milk.cow && !milk.buffalo) {
    return Alert.alert('Error', 'Enter at least one milk value');
  }

  const payload = {
    customer_id: custId,
    got_cow_milk_today: parseFloat(milk.cow || 0),
    got_buffalo_milk_today: parseFloat(milk.buffalo || 0),
    got_cow_milk_extra_today: parseFloat(milk.extraCow || 0),
    got_buffalo_milk_extra_today: parseFloat(milk.extraBuffalo || 0),
    payment_type: pay.type || 'not_paid',
    amount_paid: parseFloat(pay.paid || 0),
    amount_remain: parseFloat(pay.remaining || 0),
    assigned_employee_id: employeeId,
  };

  try {
    const res = await fetch('http://192.168.43.175:3000/api/add-daily-report-updated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setAssigned(prev => ({ ...prev, [custId]: true }));
      setEditing(prev => ({ ...prev, [custId]: false }));
      Alert.alert('Success', 'Milk and payment assigned');
    } else {
      Alert.alert('Error', data.message || 'Submission failed');
    }
  } catch (err) {
    console.error('❌ Fetch exception:', err);
    Alert.alert('Error', 'Server error while assigning');
  }
};

  const handleEdit = (custId) => {
    setEditing(prev => ({ ...prev, [custId]: true }));
    setAssigned(prev => ({ ...prev, [custId]: false }));
  };

  const handlePaymentChange = (custId, field, value) => {
    let val = value.replace(/[^0-9]/g, '');
    setPayment(prev => ({
      ...prev,
      [custId]: { ...prev[custId], [field]: val },
    }));
  };

  const handlePay = (custId) => {
    setPaidStatus(prev => ({
      ...prev,
      [custId]: true,
    }));
  };

  const getCardWidth = () => {
    if (width > 900) return 600;
    if (width > 600) return 420;
    if (width > 400) return 340;
    return width - 24;
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {customers.map((cust) => {
          const { cow, buffalo, extraCow, extraBuffalo } = inputs[cust.id];
          const custError = error[cust.id];

          return (
            <View key={cust.id} style={[styles.card, { width: getCardWidth(), alignSelf: 'center' }]}>
              <View style={styles.infoRow}>
                {cust.gender === 'male' ? (
                  <FontAwesome5 name="male" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                ) : (
                  <FontAwesome5 name="female" size={22} color="#f43f5e" style={{ marginRight: 8 }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{toTitleCase(cust.name)}</Text>
                  <Text style={styles.phone}>
                    <MaterialIcons name="phone" size={15} color="#2563eb" />{' '}
                    <Text style={{ color: '#2563eb' }}>{cust.phone}</Text>
                  </Text>
                </View>
              </View>
              {/* Inputs */}
              {assigned[cust.id] && !editing[cust.id] ? (
                <View style={styles.assignedMsgRow}>
                  <Text style={styles.assignedMsg}>Milk Assigned</Text>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(cust.id)}
                  >
                    <MaterialIcons name="edit" size={22} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.inputLabelRow}>
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Text style={styles.inputLabelCow}>Cow Milk (L)</Text>
                      <TextInput
                        style={styles.inputBox}
                        keyboardType="numeric"
                        value={cow}
                        onChangeText={(text) => handleInputChange(cust.id, 'cow', text)}
                        editable={editing[cust.id]}
                        maxLength={3}
                      />
                      {custError.cow ? (
                        <Text style={styles.errorMsg}>{custError.cow}</Text>
                      ) : null}
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.inputLabelBuffalo}>Buffalo Milk (L)</Text>
                      <TextInput
                        style={[styles.inputBox, { borderColor: '#f43f5e' }]}
                        keyboardType="numeric"
                        value={buffalo}
                        onChangeText={(text) => handleInputChange(cust.id, 'buffalo', text)}
                        editable={editing[cust.id]}
                        maxLength={3}
                      />
                      {custError.buffalo ? (
                        <Text style={styles.errorMsg}>{custError.buffalo}</Text>
                      ) : null}
                    </View>
                  </View>
                  {/* Extra and Pay buttons row */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <TouchableOpacity
                      style={styles.extraBtn}
                      onPress={() =>
                        setShowExtra((prev) => ({
                          ...prev,
                          [cust.id]: !prev[cust.id],
                        }))
                      }
                    >
                      <Text style={styles.extraBtnText}>
                        {showExtra[cust.id] ? 'Hide Extra' : 'Extra'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.payBtn}
                      onPress={() =>
                        setShowPay((prev) => ({
                          ...prev,
                          [cust.id]: !prev[cust.id],
                        }))
                      }
                    >
                      <FontAwesome name="money" size={16} color="#22c55e" />
                      <Text style={styles.payBtnText}>
                        {showPay[cust.id] ? 'Hide Pay' : 'Pay'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showExtra[cust.id] && (
                    <View style={styles.inputLabelRow}>
                      <View style={{ flex: 1, marginRight: 6 }}>
                        <Text style={styles.inputLabelCow}>Extra Cow Milk (L)</Text>
                        <TextInput
                          style={styles.inputBox}
                          keyboardType="numeric"
                          value={extraCow}
                          onChangeText={(text) => handleInputChange(cust.id, 'extraCow', text)}
                          editable={editing[cust.id]}
                          maxLength={3}
                        />
                        {custError.extraCow ? (
                          <Text style={styles.errorMsg}>{custError.extraCow}</Text>
                        ) : null}
                      </View>
                      <View style={{ flex: 1, marginLeft: 6 }}>
                        <Text style={styles.inputLabelBuffalo}>Extra Buffalo Milk (L)</Text>
                        <TextInput
                          style={[styles.inputBox, { borderColor: '#f43f5e' }]}
                          keyboardType="numeric"
                          value={extraBuffalo}
                          onChangeText={(text) => handleInputChange(cust.id, 'extraBuffalo', text)}
                          editable={editing[cust.id]}
                          maxLength={3}
                        />
                        {custError.extraBuffalo ? (
                          <Text style={styles.errorMsg}>{custError.extraBuffalo}</Text>
                        ) : null}
                      </View>
                    </View>
                  )}
                  {/* Pay section */}
                  {showPay[cust.id] && (
                    <View style={styles.paySection}>
                      <Text style={styles.payLabel}>
                        Payment Type
                      </Text>
                      <View style={styles.payTypeRow}>
                        <TouchableOpacity
                          style={[
                            styles.payTypeBtn,
                            payment[cust.id].type === 'cash' && styles.payTypeBtnActive,
                          ]}
                          onPress={() =>
                            setPayment((prev) => ({
                              ...prev,
                              [cust.id]: { ...prev[cust.id], type: 'cash' },
                            }))
                          }
                          disabled={paidStatus[cust.id]}
                        >
                          <FontAwesome name="money" size={16} color="blue" />
                          <Text style={styles.payTypeBtnText}>Cash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.payTypeBtn,
                            payment[cust.id].type === 'online' && styles.payTypeBtnActive,
                          ]}
                          onPress={() =>
                            setPayment((prev) => ({
                              ...prev,
                              [cust.id]: { ...prev[cust.id], type: 'online' },
                            }))
                          }
                          disabled={paidStatus[cust.id]}
                        >
                          <FontAwesome name="mobile" size={16} color="#2563eb" />
                          <Text style={styles.payTypeBtnText}>Online</Text>
                        </TouchableOpacity>
                      </View>
                      {/* If not paid, show inputs and Pay button */}
                      {!paidStatus[cust.id] ? (
                        <>
                          <View style={styles.inputLabelRow}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                              <Text style={styles.payLabel}>
                                <FontAwesome name="arrow-circle-up" size={14} color="#22c55e" /> Amount Paid
                              </Text>
                              <TextInput
                                style={styles.inputBox}
                                keyboardType="numeric"
                                value={payment[cust.id].paid}
                                onChangeText={(text) => handlePaymentChange(cust.id, 'paid', text)}
                                maxLength={6}
                              />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                              <Text style={styles.payLabel}>
                                <FontAwesome name="arrow-circle-down" size={14} color="#f43f5e" /> Remaining
                              </Text>
                              <TextInput
                                style={styles.inputBox}
                                keyboardType="numeric"
                                value={payment[cust.id].remaining}
                                onChangeText={(text) => handlePaymentChange(cust.id, 'remaining', text)}
                                maxLength={6}
                              />
                            </View>
                          </View>
                          {/* Show Pay button only if all fields are filled */}
                          {payment[cust.id].paid && payment[cust.id].type ? (
                            <TouchableOpacity
                              style={[
                                styles.simplePayBtn,
                                paidStatus[cust.id] && styles.simplePayBtnPaid
                              ]}
                              disabled={paidStatus[cust.id]}
                              onPress={() => {
                                handlePay(cust.id);
                                setShowPay((prev) => ({
                                  ...prev,
                                  [cust.id]: true,
                                }));
                              }}
                            >
                              <Text style={styles.simplePayBtnText}>Pay</Text>
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : (
                        // If paid, show summary
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                          <FontAwesome name="check-circle" size={22} color="#22c55e" />
                          <Text style={{ color: '#22c55e', fontWeight: 'bold', marginTop: 6 }}>
                            Paid: ₹{payment[cust.id].paid}
                          </Text>
                          <Text style={{ color: '#f43f5e', fontWeight: 'bold', marginTop: 2 }}>
                            Remaining: ₹{payment[cust.id].remaining}
                          </Text>
                          <Text style={{ color: '#2563eb', marginTop: 2 }}>
                            Mode: {payment[cust.id].type === 'cash' ? 'Cash' : payment[cust.id].type === 'online' ? 'Online' : '-'}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.assignBtn,
                        assigned[cust.id] && styles.assignedBtn,
                        (!inputs[cust.id].cow && !inputs[cust.id].buffalo) && styles.disabledBtn,
                      ]}
                      onPress={() => handleAssign(cust.id)}
                      disabled={
                        (!inputs[cust.id].cow && !inputs[cust.id].buffalo) ||
                        assigned[cust.id]
                      }
                    >
                      <Text style={[
                        styles.assignBtnText,
                        assigned[cust.id] && styles.assignedBtnText
                      ]}>
                        Assign
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingVertical: 18,
    paddingBottom: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 2,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputLabelCow: {
    color: '#8b5cf6',
    fontSize: 13,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  inputLabelBuffalo: {
    color: '#f43f5e',
    fontSize: 13,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    color: '#111',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    width: '100%',
  },
  errorMsg: {
    color: '#f43f5e',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },
  extraBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: -2,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#e0e7ef',
  },
  extraBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
  payBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7e9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 8,
  },
  payBtnText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  assignBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    flex: 1,
  },
  assignBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  assignedBtn: {
    backgroundColor: '#22c55e',
  },
  assignedBtnText: {
    color: '#fff',
  },
  assignedMsgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  assignedMsg: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: '#bcd7fa',
  },
  editBtn: {
    marginLeft: 10,
    padding: 7,
    borderRadius: 6,
    backgroundColor: '#e0e7ef',
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paySection: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  payLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  payTypeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 2,
  },
  payTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  payTypeBtnActive: {
    backgroundColor: '#22c55e',
  },
  payTypeBtnText: {
    marginLeft: 6,
    color: '#111',
    fontWeight: 'bold',
    fontSize: 13,
  },
  simplePayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#035399',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  simplePayBtnPaid: {
    backgroundColor: '#035399',
  },
  simplePayBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
});


