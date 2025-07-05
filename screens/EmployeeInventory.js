import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.43.175:3000/api/employee-customers-report';
const LEFTOVER_API_URL = 'http://192.168.43.175:3000/api/employee-milk-leftover';
const RETURN_API_URL = 'http://192.168.43.175:3000/api/return-milk';

export default function EmpInventoryScreen() {
  const [activeTab, setActiveTab] = useState('return');
  const [showNotTaken, setShowNotTaken] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [returnInputs, setReturnInputs] = useState({ cow: '', buffalo: '' });
  const [returnError, setReturnError] = useState({ cow: '', buffalo: '' });
  const [milkReturned, setMilkReturned] = useState(false);
  const [editing, setEditing] = useState(true);
  const [leftoverMilk, setLeftoverMilk] = useState({ cowLeft: 0, buffaloLeft: 0 });
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [notTakenCustomers, setNotTakenCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStr);
        if (user?.id) {
          setEmployeeId(user.id);
        } else {
          alert('Employee ID not found');
        }
      } catch (err) {
        console.error('Error fetching employee ID:', err);
      }
    };
    fetchEmployeeId();
  }, []);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);

    fetch(`${API_URL}?emp_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAssignedCustomers(data.assignedCustomers);
          setNotTakenCustomers(data.notTakenCustomers);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, [employeeId]);

  const fetchLeftoverMilk = () => {
    if (!employeeId) return;
    fetch(`${LEFTOVER_API_URL}?emp_id=${employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeftoverMilk({
            cowLeft: data.cowLeft || 0,
            buffaloLeft: data.buffaloLeft || 0,
          });
        }
      })
      .catch(err => console.error('Leftover API error:', err));
  };

  const getCardWidth = () => {
    if (width > 900) return 600;
    if (width > 600) return 420;
    if (width > 400) return 340;
    return width - 24;
  };

  const handleReturnInputChange = (type, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
    if (val !== '' && parseInt(val) > 100) {
      setReturnInputs(prev => ({ ...prev, [type]: '' }));
      setReturnError(prev => ({ ...prev, [type]: 'Value exceeds 100' }));
    } else {
      setReturnInputs(prev => ({ ...prev, [type]: val }));
      setReturnError(prev => ({ ...prev, [type]: '' }));
    }
  };

  const handleReturnTabPress = () => {
    setReturnInputs({ cow: '', buffalo: '' });
    setReturnError({ cow: '', buffalo: '' });
    setMilkReturned(false);
    setEditing(true);
    setReturnModal(true);
    fetchLeftoverMilk();
  };

  const handleReturnMilk = async () => {
    if (!employeeId) return;

    const payload = {
      employee_id: employeeId,
      returned_cow_milk: returnInputs.cow || 0,
      returned_buffalo_milk: returnInputs.buffalo || 0,
    };

    try {
      const response = await fetch(RETURN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setMilkReturned(true);
        setEditing(false);
        alert('Milk return submitted successfully!');
      } else {
        alert('Failed to return milk. Please try again.');
      }
    } catch (err) {
      console.error('Return milk error:', err);
      alert('Error submitting milk return.');
    }
  };

  const handleEditReturn = () => {
    setEditing(true);
    setMilkReturned(false);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {returnModal && <View style={styles.blurOverlay} pointerEvents="auto" />}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'return' && styles.activeTabBtn]}
          onPress={handleReturnTabPress}
        >
          <MaterialIcons
            name="undo"
            size={20}
            color={activeTab === 'return' ? "#fff" : "#2563eb"}
            style={{ marginRight: 8 }}
          />
          <Text
            style={[styles.tabText, activeTab === 'return' && styles.activeTabText]}
          >
            Return Milk
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.filterBtn}
        onPress={() => setShowNotTaken(prev => !prev)}
      >
        <MaterialIcons name="filter-list" size={20} color="#2563eb" style={{ marginRight: 6 }} />
        <Text style={styles.filterBtnText}>Customers Not Taken Milk Today</Text>
        <MaterialIcons
          name={showNotTaken ? "expand-less" : "expand-more"}
          size={20}
          color="#2563eb"
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>

      {showNotTaken && (
        <View style={styles.notTakenList}>
          {notTakenCustomers.length === 0 ? (
            <Text style={styles.notTakenEmpty}>All customers have taken milk today.</Text>
          ) : (
            notTakenCustomers.map(cust => (
              <View key={cust.id} style={styles.notTakenCard}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5 name="user" size={16} color="#f43f5e" style={{ marginRight: 8 }} />
                  <Text style={styles.notTakenName}>{cust.name}</Text>
                </View>
                <View style={styles.notTakenPhoneRow}>
                  <MaterialIcons name="phone" size={15} color="#2563eb" />
                  <Text style={styles.notTakenPhone}>{cust.phone}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <View style={styles.takenHeaderRow}>
        <Text style={styles.takenHeaderText}>
          Customers Taken Milk{' '}
          <View style={styles.countCircleInline}>
            <Text style={styles.countCircleText}>{assignedCustomers.length}</Text>
          </View>
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {assignedCustomers.map(cust => (
            <View
              key={cust.id}
              style={[styles.card, { width: getCardWidth(), alignSelf: 'center' }]}
            >
              <View style={styles.rowBetween}>
                <View style={styles.infoLeft}>
                  <View style={styles.infoRow}>
                    <FontAwesome5 name="user" size={20} color="#2563eb" style={{ marginRight: 8 }} />
                    <Text style={styles.name}>{cust.name}</Text>
                  </View>
                  <View style={styles.phoneRow}>
                    <Text style={styles.phone}>
                      <MaterialIcons name="phone" size={15} color="#2563eb" />{' '}
                      <Text style={{ color: '#2563eb' }}>{cust.phone}</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.milkRight}>
                  <View style={styles.milkLine}>
                    <MaterialIcons name="local-drink" size={18} color="#8b5cf6" />
                    <Text style={styles.milkLabel}>Cow Milk : </Text>
                    <Text style={[styles.milkValue, { color: '#8b5cf6', marginLeft: 2 }]}>
                      {cust.cowMilk} L
                    </Text>
                  </View>
                  <View style={styles.milkLine}>
                    <MaterialIcons name="local-drink" size={18} color="#f43f5e" />
                    <Text style={styles.milkLabel}>Buffalo Milk : </Text>
                    <Text style={[styles.milkValue, { color: '#f43f5e', marginLeft: 2 }]}>
                      {cust.buffaloMilk} L
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Return Milk Modal */}
      <Modal
        visible={returnModal}
        transparent
        animationType="fade"
        onRequestClose={() => setReturnModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Return Milk</Text>
              <Pressable onPress={() => setReturnModal(false)}>
                <MaterialIcons name="close" size={24} color="#222" />
              </Pressable>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Milk Left to Return:</Text>
              <Text style={{ color: '#4b5563', marginBottom: 2 }}>Cow Milk: {leftoverMilk.cowLeft} L</Text>
              <Text style={{ color: '#4b5563' }}>Buffalo Milk: {leftoverMilk.buffaloLeft} L</Text>
            </View>

            <View style={styles.inputLabelRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.inputLabelCow}>Cow Milk (L)</Text>
                <TextInput
                  style={[styles.inputBox, !editing && { backgroundColor: '#e7fbe9' }]}
                  keyboardType="numeric"
                  value={returnInputs.cow}
                  onChangeText={text => handleReturnInputChange('cow', text)}
                  editable={editing}
                  maxLength={3}
                />
                {returnError.cow ? <Text style={styles.errorMsg}>{returnError.cow}</Text> : null}
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.inputLabelBuffalo}>Buffalo Milk (L)</Text>
                <TextInput
                  style={[
                    styles.inputBox,
                    { borderColor: '#f43f5e' },
                    !editing && { backgroundColor: '#e7fbe9' },
                  ]}
                  keyboardType="numeric"
                  value={returnInputs.buffalo}
                  onChangeText={text => handleReturnInputChange('buffalo', text)}
                  editable={editing}
                  maxLength={3}
                />
                {returnError.buffalo ? <Text style={styles.errorMsg}>{returnError.buffalo}</Text> : null}
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.assignBtn,
                  milkReturned && styles.returnedMsgRow,
                  (!returnInputs.cow && !returnInputs.buffalo) && styles.disabledBtn,
                ]}
                onPress={milkReturned ? undefined : handleReturnMilk}
                disabled={
                  (!returnInputs.cow && !returnInputs.buffalo && !milkReturned) ||
                  (!editing && !milkReturned) ||
                  milkReturned
                }
              >
                <Text style={milkReturned ? styles.returnedMsg : styles.assignBtnText}>
                  {milkReturned ? 'Milk Returned' : 'Return Milk'}
                </Text>
              </TouchableOpacity>
              {milkReturned && !editing && (
                <TouchableOpacity onPress={handleEditReturn} style={styles.editBtn}>
                  <MaterialIcons name="edit" size={22} color="#2563eb" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 62, 80, 0.25)',
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5fb',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
    paddingVertical: 8,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 0,
    backgroundColor: '#e0e7ef',
    width: '100%',
    justifyContent: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 14,
    alignSelf: 'center',
  },
  filterBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
  takenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 2,
    marginBottom: 8,
  },
  takenHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countCircleInline: {
    backgroundColor: '#22c55e',
    borderRadius: 999,
    minWidth: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
    display: 'inline-flex',
  },
  countCircleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  notTakenList: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
  },
  notTakenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
    paddingBottom: 6,
    justifyContent: 'space-between',
  },
  notTakenName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  notTakenPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 120,
  },
  notTakenPhone: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 4,
  },
  notTakenEmpty: {
    color: '#22c55e',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  infoLeft: {
    flex: 1,
    minWidth: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 0,
    marginRight: 10,
  },
  phoneRow: {
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#2563eb',
  },
  milkRight: {
    alignItems: 'flex-end',
    minWidth: 120,
    justifyContent: 'center',
  },
  milkLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  milkLabel: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  milkValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  returnBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(44, 62, 80, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: width > 400 ? 340 : width - 36,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
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
    paddingVertical: 8,
    width: '100%',
  },
  errorMsg: {
    color: '#f43f5e',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  assignBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    height: 48,
    minWidth: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  assignBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabledBtn: {
    backgroundColor: '#bcd7fa',
  },
  editBtn: {
    marginLeft: 10,
    padding: 7,
    borderRadius: 6,
    backgroundColor: '#e0e7ef',
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnedMsgRow: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    height: 48,
    minWidth: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  returnedMsg: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editIconBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#e0e7ef',
  },
});