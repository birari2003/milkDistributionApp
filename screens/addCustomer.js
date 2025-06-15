import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddCustomer = () => {
  const [areas, setAreas] = useState([]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    area_id: '',
    daily_milk_needed: '',
    extra_milk_if_needed: '',
    milk_category: '', // new
  });


  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://192.168.43.175:3000/api/areas')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAreas(data.areas);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Phone must be 10 digits.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Min 6 characters required.';
    if (!form.address.trim()) errs.address = 'Address is required.';
    if (!form.area_id) errs.area_id = 'Please select an area.';
    if (form.daily_milk_needed && isNaN(Number(form.daily_milk_needed)))
      errs.daily_milk_needed = 'Must be a number.';
    if (form.extra_milk_if_needed && isNaN(Number(form.extra_milk_if_needed)))
      errs.extra_milk_if_needed = 'Must be a number.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await fetch('http://192.168.43.175:3000/api/add-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('✅ Customer added successfully!');
        setForm({
          name: '', phone: '', password: '', address: '',
          area_id: '', daily_milk_needed: '', extra_milk_if_needed: '',
        });
        setErrors({});
      } else {
        setMessage('❌ Failed to add customer.');
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Customer</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={form.name}
        onChangeText={text => setForm({ ...form, name: text })}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={text => setForm({ ...form, phone: text.replace(/[^0-9]/g, '') })}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={text => setForm({ ...form, password: text })}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={text => setForm({ ...form, address: text })}
      />
      {errors.address && <Text style={styles.error}>{errors.address}</Text>}

      <Text style={styles.label}>Select Area</Text>
      <Picker
        selectedValue={form.area_id}
        onValueChange={itemValue => setForm({ ...form, area_id: itemValue })}
      >
        <Picker.Item label="Select Area" value="" />
        {areas.map(area => (
          <Picker.Item key={area.id} label={area.landmark} value={area.id} />
        ))}
      </Picker>
      {errors.area_id && <Text style={styles.error}>{errors.area_id}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Daily Milk Needed (Litres)"
        keyboardType="numeric"
        value={form.daily_milk_needed}
        onChangeText={text => setForm({ ...form, daily_milk_needed: text })}
      />
      {errors.daily_milk_needed && <Text style={styles.error}>{errors.daily_milk_needed}</Text>}

      <Text style={styles.label}>Milk Category</Text>
      <Picker
        selectedValue={form.milk_category}
        onValueChange={value => setForm({ ...form, milk_category: value })}
      >
        <Picker.Item label="Select Milk Category" value="" />
        <Picker.Item label="Cow's Milk" value="cows" />
        <Picker.Item label="Buffalo's Milk" value="buffalo" />
      </Picker>
      {errors.milk_category && <Text style={styles.error}>{errors.milk_category}</Text>}


      <Button title="Add Customer" onPress={handleSubmit} />

      {message !== '' && (
        <Text style={styles.successMessage}>{message}</Text>
      )}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10, marginLeft: 5, fontSize: 13 },
  successMessage: {
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddCustomer;
