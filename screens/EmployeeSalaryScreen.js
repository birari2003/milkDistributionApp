import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { toTitleCase } from './utils';

const { width } = Dimensions.get('window');

const months = [
  'June 2025',
  'May 2025',
  'April 2025',
  'March 2025',
  'February 2025',
  'January 2025',
];

export default function EmployeeSalaryScreen() {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [amount, setAmount] = useState('15000');
  const [payMode, setPayMode] = useState('Online');
  const [showModal, setShowModal] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const confirmAnim = useRef(new Animated.Value(0)).current;

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/employees');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch employees');
    }
  };

  const fetchSalaryHistory = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/salary-history');
      const data = await res.json();
      if (data.success) {
        setSalaryHistory(data.history);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch salary history');
    }
  };

  const handleEmployeePress = (emp) => {
    setSelectedEmp(emp);
    setSelectedMonth(months[0]);
    setAmount('15000');
    setPayMode('Online');
    setShowModal(true);
  };

  const handlePayPress = () => {
    setShowConfirm(true);
    Animated.spring(confirmAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirm = async () => {
    Animated.timing(confirmAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setShowConfirm(false);

    try {
      const res = await fetch('http://192.168.43.175:3000/api/pay-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmp.id,
          employee_name: selectedEmp.name,
          area_id: selectedEmp.area_id,      // or selectedEmp.area?.id depending on structure
          contact: selectedEmp.contact,

          amount: parseFloat(amount),
          pay_mode: payMode,
          month: selectedMonth,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchSalaryHistory();
      } else {
        Alert.alert('Error', data.message || 'Failed to pay salary');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error');
    }
  };

  const getPaidEmployeeIds = () => {
    return salaryHistory.map((e) => `${e.employee_id}_${e.month}`);
  };

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchSalaryHistory()]).finally(() => setLoading(false));
  }, []);

  const paidIds = getPaidEmployeeIds();

  const unpaidEmployees = employees.filter(
    (emp) => !paidIds.includes(`${emp.id}_${months[0]}`)
  );

  const filteredEmployees = unpaidEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.contact.includes(search)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Pay Employee Salary</Text>

      <Text style={styles.sectionTitle}>Pending Salary - {months[0]}</Text>
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search employee..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <View style={styles.employeeList}>
          {filteredEmployees.map((emp) => (
            <TouchableOpacity
              key={emp.id}
              style={styles.employeeItem}
              onPress={() => handleEmployeePress(emp)}
            >
              <FontAwesome5 name="user-alt" size={18} color="#2563eb" />
              <Text style={styles.employeeName}>{toTitleCase(emp.name)}</Text>
              <View style={styles.area_idTag}>
                {/* <Text style={styles.area_idText}>{emp.area_id}</Text> */}
                <Text style={styles.area_idText}>{toTitleCase(emp.area_name)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* History */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>
          <FontAwesome5 name="history" size={16} color="#2563eb" /> Salary Payment History
        </Text>
        {salaryHistory.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <FontAwesome5 name="user-alt" size={18} color="#2563eb" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.historyEmp}>
                {item.employee_name}
                <Text
                  style={[
                    styles.historyStatus,
                    item.pay_mode === 'Online' ? styles.statusOnline : styles.statusCash,
                    { marginLeft: 6, fontWeight: 'bold' },
                  ]}
                >
                  {' '}
                  {item.pay_mode}
                </Text>
              </Text>
              <Text style={styles.historycontact}>{item.contact}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', minWidth: 120 }}>
              <Text style={styles.historyAmount}>₹{item.amount}</Text>
              <Text style={styles.historyDate}>{item.month}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Salary Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.salaryCard}>
            <View style={styles.salaryCardHeader}>
              <MaterialIcons name="payments" size={20} color="#2563eb" />
              <Text style={styles.salaryCardTitle}>Salary Details & Payment</Text>
              <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Employee</Text>
              <Text style={styles.salaryValue}>{selectedEmp?.name}</Text>
            </View>

            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Month</Text>
              <TouchableOpacity
                style={styles.monthDropdown}
                onPress={() => setMonthDropdownOpen(!monthDropdownOpen)}
              >
                <Text style={styles.salaryValue}>{selectedMonth}</Text>
                <MaterialIcons
                  name={monthDropdownOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={22}
                  color="#2563eb"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>

            {monthDropdownOpen && (
              <View style={styles.dropdownList}>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedMonth(month);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedMonth === month && { color: '#2563eb', fontWeight: 'bold' },
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.salaryRow}>
              <Text style={styles.salaryLabel}>Amount</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                maxLength={7}
              />
            </View>

            <Text style={styles.payByLabel}>Pay Salary By</Text>
            <View style={styles.payModeRow}>
              {['Online', 'Cash'].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.payModeBtn, payMode === mode && styles.payModeBtnActive]}
                  onPress={() => setPayMode(mode)}
                >
                  <FontAwesome5
                    name={mode === 'Online' ? 'credit-card' : 'money-bill-wave'}
                    size={16}
                    color={payMode === mode ? '#fff' : '#2563eb'}
                  />
                  <Text style={[styles.payModeText, payMode === mode && { color: '#fff' }]}>{mode}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.payBtn} onPress={handlePayPress}>
              <MaterialIcons name="done" size={20} color="#fff" />
              <Text style={styles.payBtnText}>Pay Salary</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showConfirm && (
          <Animated.View
            style={[
              styles.confirmOverlay,
              {
                opacity: confirmAnim,
                transform: [{ scale: confirmAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
              },
            ]}
          >
            <View style={styles.confirmBox}>
              <MaterialIcons name="check-circle" size={40} color="#22c55e" style={{ alignSelf: 'center' }} />
              <Text style={styles.confirmTitle}>Confirm Payment</Text>
              <Text style={styles.confirmText}>Employee: {selectedEmp?.name}</Text>
              <Text style={styles.confirmText}>Amount: ₹{amount}</Text>
              <Text style={styles.confirmText}>Month: {selectedMonth}</Text>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width > 400 ? 370 : '97%',
    marginBottom: 10,
    marginTop: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#22223b',
    fontSize: 18,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: width > 400 ? 370 : '97%',
    marginBottom: 8,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#22223b',
    marginLeft: 8,
    height: 30,
    paddingInlineStart: 3
  },
  employeeList: {
    width: width > 400 ? 370 : '97%',
    marginBottom: 12,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  employeeItemActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  employeeName: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  area_idTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  area_idText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  salaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: width > 400 ? 370 : '97%',
    borderWidth: 1,
    borderColor: '#e0e7ef',
    elevation: 1,
    marginBottom: 18,
  },
  salaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  salaryCardTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
    marginLeft: 8,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 90,
  },
  salaryValue: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: 'bold',
    flex: 1,
  },
  monthDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e7ef',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 100,
    marginRight: 0,
    width: 180,
    elevation: 3,
    zIndex: 10,
    position: 'absolute',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#22223b',
  },
  amountInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    color: '#111',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  payByLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  payModeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  payModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  payModeBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  payModeText: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: width > 400 ? 370 : '97%',
    borderWidth: 1,
    borderColor: '#e0e7ef',
    elevation: 1,
    marginBottom: 18,
  },
  historyTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingBottom: 6,
  },
  historyEmp: {
    fontSize: 14,
    color: '#22223b',
    fontWeight: 'bold',
    marginRight: 8,
    flex: 1,
    marginTop: 10,
  },
  historycontact: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -2,
    marginBottom: 2,
  },
  historyMonth: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 8,
  },
  historyDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -2,
    marginBottom: 2,
  },
  historyAmount: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: 'bold',
    marginRight: 8,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statusOnline: {
    color: '#22c55e',
  },
  statusCash: {
    color: '#2563eb',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  confirmBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: 280,
    elevation: 5,
  },
  confirmTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2563eb',
    marginTop: 10,
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 15,
    color: '#22223b',
    marginBottom: 4,
  },
  confirmBtn: {
    marginTop: 18,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});