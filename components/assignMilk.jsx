import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AssignMilkScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [assignedMilk, setAssignedMilk] = useState('');
  const [extraMilk, setExtraMilk] = useState('');
  const [cowMilk, setCowMilk] = useState('');
  const [buffaloMilk, setBuffaloMilk] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployees(data.employees);
        } else {
          Alert.alert('Error', 'Failed to fetch employees');
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Server error while fetching employees');
      });
  }, []);

  const handleAssignMilk = async () => {
    if (
      !selectedEmployee ||
      !assignedMilk ||
      !extraMilk ||
      !cowMilk ||
      !buffaloMilk
    ) {
      setMessage('❌ Please fill all the fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.43.175:3000/api/assign-milk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEmployee,
          assigned_milk_today: parseFloat(assignedMilk),
          assigned_extra_milk_today: parseFloat(extraMilk),
          cow_milk: parseFloat(cowMilk),
          buffalo_milk: parseFloat(buffaloMilk),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Milk assigned successfully!');
        setSelectedEmployee('');
        setAssignedMilk('');
        setExtraMilk('');
        setCowMilk('');
        setBuffaloMilk('');
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Assign Milk to Employee</Text>

      <Text style={styles.label}>Select Employee</Text>
      <Picker
        selectedValue={selectedEmployee}
        onValueChange={value => setSelectedEmployee(value)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Employee --" value="" />
        {employees.map(emp => (
          <Picker.Item key={emp.id} label={emp.name} value={emp.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Assigned Milk Today (litres)"
        keyboardType="numeric"
        value={assignedMilk}
        onChangeText={setAssignedMilk}
      />

      <TextInput
        style={styles.input}
        placeholder="Extra Milk Today (litres)"
        keyboardType="numeric"
        value={extraMilk}
        onChangeText={setExtraMilk}
      />

      <TextInput
        style={styles.input}
        placeholder="Cow's Milk (litres)"
        keyboardType="numeric"
        value={cowMilk}
        onChangeText={setCowMilk}
      />

      <TextInput
        style={styles.input}
        placeholder="Buffalo's Milk (litres)"
        keyboardType="numeric"
        value={buffaloMilk}
        onChangeText={setBuffaloMilk}
      />

      <Button title="Assign Milk" onPress={handleAssignMilk} color="#007BFF" />

      {message !== '' && (
        <Text
          style={[
            styles.message,
            message.startsWith('✅') ? styles.success : styles.error,
          ]}
        >
          {message}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f7fa' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: { marginBottom: 6, fontWeight: '600' },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  success: { color: 'green' },
  error: { color: 'red' },
});

export default AssignMilkScreen;
