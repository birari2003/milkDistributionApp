import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AssignMilkScreen() {
  const [employees, setEmployees] = useState([]);
  const [inputs, setInputs] = useState({});
  const [assigned, setAssigned] = useState({});
  const [editing, setEditing] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingNeeds, setLoadingNeeds] = useState(true);
  const [tomorrowNeed, setTomorrowNeed] = useState({});
  const [assignedToday, setAssignedToday] = useState([]);

  useEffect(() => {
    // Fetch employees
    fetch('http://192.168.43.175:3000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployees(data.employees);
          const inputMap = {}, assignedMap = {}, editMap = {}, errorMap = {};
          data.employees.forEach(emp => {
            inputMap[emp.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
            assignedMap[emp.id] = emp.is_assigned === 1; // set initial assignment based on API
            editMap[emp.id] = false;
            errorMap[emp.id] = { cow: '', buffalo: '', extraCow: '', extraBuffalo: '' };
          });
          setInputs(inputMap);
          setAssigned(assignedMap);
          setEditing(editMap);
          setError(errorMap);
        } else {
          Alert.alert('Error', 'Failed to fetch employee data.');
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Server connection failed.');
      })
      .finally(() => setLoading(false));

    // Fetch tomorrow's milk needs
    // Fetch tomorrow's milk needs
    fetch('http://192.168.43.175:3000/api/employee-milk-need-tomorrow')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const map = {};
          data.data.forEach(item => {
            map[item.employee_id] = {
              cow: item.estimated_cow_milk || 0,
              buffalo: item.estimated_buffalo_milk || 0
            };
          });
          setTomorrowNeed(map);
        }
      })
      .catch(err => console.error("Error fetching employee milk need", err))
      .finally(() => setLoadingNeeds(false));



    // Fetch assigned employees
    fetch('http://192.168.43.175:3000/api/assigned-employees')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAssignedToday(data.assigned); // Array of employee_id
        }
      })
      .catch(err => console.error("Error fetching assigned employees", err));

  },

    []);

  const handleInputChange = (empId, type, value) => {
    let val = value.replace(/[^0-9]/g, '');
    if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
    if (val !== '' && parseInt(val) > 100) {
      setInputs(prev => ({
        ...prev,
        [empId]: { ...prev[empId], [type]: '' },
      }));
      setError(prev => ({
        ...prev,
        [empId]: { ...prev[empId], [type]: 'Value exceeds above 100' },
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        [empId]: { ...prev[empId], [type]: val },
      }));
      setError(prev => ({
        ...prev,
        [empId]: { ...prev[empId], [type]: '' },
      }));
    }
  };

  const handleAssign = async (empId) => {
    const { cow, buffalo, extraCow, extraBuffalo } = inputs[empId];

    try {
      const res = await fetch('http://192.168.43.175:3000/api/assign-milk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: empId,
          cow_milk: parseInt(cow) || 0,
          buffalo_milk: parseInt(buffalo) || 0,
          extra_cow_milk: parseInt(extraCow) || 0,
          extra_buffalo_milk: parseInt(extraBuffalo) || 0,
        })
      });

      const result = await res.json();
      if (result.success) {
        setAssigned(prev => ({ ...prev, [empId]: true }));
        setEditing(prev => ({ ...prev, [empId]: false }));
      } else {
        Alert.alert('Error', result.message || 'Assignment failed');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network request failed.');
    }
  };

  const handleEdit = (empId) => {
    setAssigned(prev => ({ ...prev, [empId]: false }));
    setEditing(prev => ({ ...prev, [empId]: true }));
  };

  const getCardWidth = () => {
    if (width > 900) return 600;
    if (width > 600) return 420;
    if (width > 400) return 340;
    return width - 24;
  };

  if (loading || loadingNeeds) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={{ marginTop: 10 }}>Loading employees...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}>
        {employees.map((emp) => {
          const { cow, buffalo, extraCow, extraBuffalo } = inputs[emp.id] || {};
          const empError = error[emp.id] || {};
          const isDisabled =
            assigned[emp.id] ||
            (cow?.trim() === '' && buffalo?.trim() === '');

          const estimated = tomorrowNeed[emp.id] || { cow: 0, buffalo: 0 };

          return (
            <View key={emp.id} style={{
              backgroundColor: '#fff',
              padding: 14,
              marginBottom: 16,
              borderRadius: 12,
              width: getCardWidth(),
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <MaterialIcons name="person" size={22} color="#8b5cf6" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{emp.name}</Text>
                  <Text style={{ color: '#2563eb', fontSize: 13 }}>{emp.contact}</Text>
                  <Text style={{ color: '#22c55e', fontSize: 13 }}>{emp.area_name}</Text>
                </View>
              </View>




              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: '#0ea5e9' }}>Est. Cow: {estimated.cow} L</Text>
                <Text style={{ fontSize: 13, color: '#f43f5e' }}>Est. Buffalo: {estimated.buffalo} L</Text>
              </View>

              {/* Cow and Buffalo Inputs */}
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={{ fontSize: 13 }}>Cow Milk</Text>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    value={cow}
                    onChangeText={(text) => handleInputChange(emp.id, 'cow', text)}
                    editable={!assigned[emp.id] || editing[emp.id]}
                  />
                  {empError.cow && <Text style={styles.errorMsg}>{empError.cow}</Text>}
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={{ fontSize: 13 }}>Buffalo Milk</Text>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    value={buffalo}
                    onChangeText={(text) => handleInputChange(emp.id, 'buffalo', text)}
                    editable={!assigned[emp.id] || editing[emp.id]}
                  />
                  {empError.buffalo && <Text style={styles.errorMsg}>{empError.buffalo}</Text>}
                </View>
              </View>

              {/* Extra Milk Inputs */}
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={{ fontSize: 13 }}>Extra Cow</Text>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    value={extraCow}
                    onChangeText={(text) => handleInputChange(emp.id, 'extraCow', text)}
                    editable={!assigned[emp.id] || editing[emp.id]}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={{ fontSize: 13 }}>Extra Buffalo</Text>
                  <TextInput
                    style={styles.inputBox}
                    keyboardType="numeric"
                    value={extraBuffalo}
                    onChangeText={(text) => handleInputChange(emp.id, 'extraBuffalo', text)}
                    editable={!assigned[emp.id] || editing[emp.id]}
                  />
                </View>
              </View>
              {/* Milk Already Assigned Info */}
              {assignedToday.includes(emp.id) && (
                <Text style={{ color: 'green', marginTop: 4, fontSize: 13 }}>
                  Milk is already assigned
                </Text>
              )}

              {/* Actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => handleAssign(emp.id)}
                  disabled={isDisabled}
                  style={{
                    flex: 1,
                    backgroundColor: assigned[emp.id] ? '#10b981' : '#3b82f6',
                    paddingVertical: 10,
                    borderRadius: 6,
                    opacity: isDisabled ? 0.6 : 1,
                    marginRight: 6,
                  }}
                >
                  <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    {assigned[emp.id] ? 'Milk Assigned' : 'Assign'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEdit(emp.id)}
                  disabled={!assigned[emp.id]}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 6,
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                  }}
                >
                  <MaterialIcons name="edit" size={20} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}


// NOTE: Remember to include your existing `StyleSheet.create({ ... })` styles below.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  scrollContainer: {
    paddingVertical: 18,
    paddingBottom: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  empCard: {
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
  empInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  empName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  empPhone: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 2,
  },
  empRegion: {
    fontSize: 14,
    color: '#22c55e',
    marginBottom: 2,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: "auto",
    marginTop: 10,
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
  disabledBtn: {
    backgroundColor: '#bcd7fa',
  },
  editBtn: {
    marginLeft: 10,
    padding: 7,
    borderRadius: 6,
    backgroundColor: '#e0e7ef',
  }
});