import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [employeeListVisible, setEmployeeListVisible] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/areas')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAreas(data.areas);
        else Alert.alert('Error', 'Error fetching areas');
      })
      .catch(() => Alert.alert('Error', 'Server error'));
  }, []);

  const handleAdd = async () => {
    if (!name || !contact || !address || !password || !selectedArea) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const res = await fetch('http://192.168.43.175:3000/api/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, address, password, area_id: selectedArea }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('✅ Employee added successfully!');
        setName('');
        setContact('');
        setAddress('');
        setPassword('');
        setSelectedArea('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/employees');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
        setEmployeeListVisible(true);
      } else {
        Alert.alert('Error', 'Could not fetch employee list');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Employee</Text>

      {successMessage.length > 0 && (
        <View style={styles.successContainer}>
          <Text style={styles.success}>{successMessage}</Text>
        </View>
      )}

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Contact" keyboardType="phone-pad" value={contact} onChangeText={setContact} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedArea} onValueChange={setSelectedArea}>
          <Picker.Item label="Select Area" value="" />
          {areas.map(area => (
            <Picker.Item key={area.id} label={area.landmark} value={area.id} />
          ))}
        </Picker>
      </View>

      <Button title="Add Employee" onPress={handleAdd} />

      <TouchableOpacity onPress={fetchEmployees} style={styles.listButton}>
        <Text style={styles.listButtonText}>📋 See Employee List</Text>
      </TouchableOpacity>

      {employeeListVisible && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Employee List</Text>
          {employees.map(emp => (
            <View key={emp.id} style={styles.card}>
              <Text style={styles.cardText}>👤 {emp.name}</Text>
              <Text style={styles.cardText}>📍 {emp.address}</Text>
              <Text style={styles.cardText}>🏘️ Area: {emp.area_name}</Text>
              <Text style={styles.cardText}>📞 {emp.contact}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  successContainer: {
    backgroundColor: '#d4edda',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  success: {
    color: '#155724',
    fontWeight: '600',
    textAlign: 'center',
  },
  listButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  listButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 3,
    color: '#333',
  },
});
