// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   SafeAreaView,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import ReportSubmit from '../components/reportSubmit';
// import UpdateCustomer from '../components/updateCustomer';

// const SeeCustomer = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(null); // for expanded item
//   const [activeTab, setActiveTab] = useState(null);     // 'update' or 'report'

//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const userStr = await AsyncStorage.getItem('user');
//       const user = JSON.parse(userStr);

//       if (!user?.area_id) {
//         alert('Missing area information');
//         return;
//       }

//       const res = await fetch(`http://192.168.43.175:3000/api/customers?area_id=${user.area_id}`);
//       const data = await res.json();

//       if (data.success) {
//         const enrichedData = data.customers.map(c => ({

//           ...c,
//           getToday: false,
//           getTomorrow: false,
//           extraToday: '',
//           extraTomorrow: '',
//           submitted: false,
//         }));
//         setCustomers(enrichedData);
//       } else {
//         alert('Failed to fetch customers');
//       }
//     } catch (err) {
//       alert('Error fetching customer data');
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleToggle = (index, tab) => {
//     // If the same customer and same tab is tapped again, close it
//     if (activeIndex === index && activeTab === tab) {
//       setActiveIndex(null);
//       setActiveTab(null);
//     } else {
//       setActiveIndex(index);
//       setActiveTab(tab);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Customer List</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
//       ) : customers.length > 0 ? (
//         <FlatList
//           data={customers}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item, index }) => (
//             <View style={styles.card}>
//               {/* Customer Basic Info */}
//               <View style={styles.rowSpaceBetween}>
//                 <View>
//                   <Text style={styles.name}>{item.name}</Text>
//                   <Text style={styles.phone}>{item.phone}</Text>
//                   <Text style={styles.address}>{item.address}</Text>
//                   <Text style={styles.deliveryTime}>
//                     Delivery: {item.delivery_time === 'morning' ? 'Morning' : 'Evening'}
//                   </Text>
//                 </View>
//               </View>

//               {/* Buttons */}
//               <View style={styles.buttonRow}>
//                 <TouchableOpacity
//                   style={styles.btn}
//                   onPress={() => handleToggle(index, 'update')}
//                 >
//                   <Text style={styles.btnText}>Update Customer</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.btn, { backgroundColor: '#28a745' }]}
//                   onPress={() => handleToggle(index, 'report')}
//                 >
//                   <Text style={styles.btnText}>Today's Report</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Conditional Rendering */}
//               {activeIndex === index && activeTab === 'update' && (
//                 <UpdateCustomer customer={item} />
//               )}

//               {activeIndex === index && activeTab === 'report' && (
//                 <ReportSubmit customer={item} index={index} />
//               )}
//             </View>
//           )}
//         />
//       ) : (
//         <Text style={styles.noDataText}>No customers found.</Text>
//       )}
//     </SafeAreaView>
//   );
// }; 

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     backgroundColor: '#f0f4f8',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginVertical: 15,
//     color: '#333',
//     textAlign: 'center',
//   },
//   noDataText: {
//     textAlign: 'center',
//     marginTop: 30,
//     fontSize: 16,
//     color: '#999',
//   },
//   deliveryTime: {
//     fontSize: 14,
//     color: '#888',
//     fontStyle: 'italic',
//     marginBottom: 6,
//   },

//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     marginVertical: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   rowSpaceBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 6,
//     color: '#222',
//   },
//   phone: {
//     fontSize: 15,
//     color: '#444',
//     marginBottom: 4,
//   },
//   address: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     gap: 8,
//   },
//   btn: {
//     flex: 1,
//     backgroundColor: '#007BFF',
//     paddingVertical: 8,
//     borderRadius: 6,
//     marginTop: 6,
//   },
//   btnText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });

// export default SeeCustomer;






import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Dimensions, Platform, Alert
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function MilkDeliveryScreen() {
  const [customers, setCustomers] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [inputs, setInputs] = useState({});
  const [assigned, setAssigned] = useState({});
  const [editing, setEditing] = useState({});
  const [showExtra, setShowExtra] = useState({});
  const [error, setError] = useState({});

  const getCardWidth = () => {
    if (width > 900) return 600;
    if (width > 600) return 420;
    if (width > 400) return 340;
    return width - 24;
  };

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
                  initExtra = {}, initErrors = {};

            for (let cust of data.customers) {
              initInputs[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
              initAssigned[cust.id] = false;
              initEditing[cust.id] = true;
              initExtra[cust.id] = false;
              initErrors[cust.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
            }

            setInputs(initInputs);
            setAssigned(initAssigned);
            setEditing(initEditing);
            setShowExtra(initExtra);
            setError(initErrors);

            // Check report exists
            for (let cust of data.customers) {
              const checkRes = await fetch(`http://192.168.43.175:3000/api/check-daily-report?customer_id=${cust.id}`);
              const checkData = await checkRes.json();
              if (checkData.success && checkData.exists) {
                setAssigned(prev => ({ ...prev, [cust.id]: true }));
                setEditing(prev => ({ ...prev, [cust.id]: false }));
              }
            }
          }
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch customers');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (custId, type, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
    if (val !== '' && parseInt(val) > 100) {
      setInputs(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: '' } }));
      setError(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: 'Value exceeds 100' } }));
    } else {
      setInputs(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: val } }));
      setError(prev => ({ ...prev, [custId]: { ...prev[custId], [type]: '' } }));
    }
  };

  const handleAssign = async (custId) => {
    const data = inputs[custId];
    if (!data?.cow && !data?.buffalo) return Alert.alert('Error', 'Enter at least one milk value');

    try {
      const res = await fetch(`http://192.168.43.175:3000/api/add-daily-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: custId,
          got_cow_milk_today: true,
          got_buffalo_milk_today: true,
          will_get_cow_milk_tomorrow: true,
          will_get_buffalo_milk_tomorrow: true,
          extra_today: parseFloat(data.extraCow || 0) + parseFloat(data.extraBuffalo || 0),
          extra_tomorrow: 0,
          assigned_employee_id: employeeId,
          override: false
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setAssigned(prev => ({ ...prev, [custId]: true }));
        setEditing(prev => ({ ...prev, [custId]: false }));
        Alert.alert('Success', 'Milk assigned');
      } else {
        Alert.alert('Error', resData.message || 'Submission failed');
      }
    } catch {
      Alert.alert('Error', 'Server/network error');
    }
  };

  const handleEdit = (custId) => {
    setEditing(prev => ({ ...prev, [custId]: true }));
    setAssigned(prev => ({ ...prev, [custId]: false }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {customers.map(cust => {
          const { cow, buffalo, extraCow, extraBuffalo } = inputs[cust.id] || {};
          const custError = error[cust.id] || {};

          return (
            <View key={cust.id} style={[styles.card, { width: getCardWidth(), alignSelf: 'center' }]}>
              <View style={styles.infoRow}>
                {cust.gender === 'male'
                  ? <FontAwesome5 name="male" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                  : <FontAwesome5 name="female" size={22} color="#f43f5e" style={{ marginRight: 8 }} />
                }
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{cust.name}</Text>
                  <Text style={styles.phone}>
                    <MaterialIcons name="phone" size={15} color="#2563eb" /> <Text style={{ color: '#2563eb' }}>{cust.phone}</Text>
                  </Text>
                </View>
              </View>

              {assigned[cust.id] && !editing[cust.id] ? (
                <View style={styles.assignedMsgRow}>
                  <Text style={styles.assignedMsg}>Milk Assigned</Text>
                  <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(cust.id)}>
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
                      {custError.cow ? <Text style={styles.errorMsg}>{custError.cow}</Text> : null}
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
                      {custError.buffalo ? <Text style={styles.errorMsg}>{custError.buffalo}</Text> : null}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.extraBtn}
                    onPress={() => setShowExtra(prev => ({ ...prev, [cust.id]: !prev[cust.id] }))}
                  >
                    <Text style={styles.extraBtnText}>
                      {showExtra[cust.id] ? 'Hide Extra' : 'Extra'}
                    </Text>
                  </TouchableOpacity>

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
                      </View>
                    </View>
                  )}

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.assignBtn,
                        assigned[cust.id] && styles.assignedBtn,
                        (!cow && !buffalo) && styles.disabledBtn,
                      ]}
                      onPress={() => handleAssign(cust.id)}
                      disabled={(!cow && !buffalo) || assigned[cust.id]}
                    >
                      <Text style={[
                        styles.assignBtnText,
                        assigned[cust.id] && styles.assignedBtnText
                      ]}>Assign</Text>
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

// ✅ Reuse your same styles as before here...


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
});