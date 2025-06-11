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
  const [customers, setCustomers] = useState([]);
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: '',
    area_id: '',
    daily_milk_needed: '',
    extra_milk_if_needed: '',
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

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
        setShowList(true);
      } else {
        alert('Failed to fetch customers');
      }
    } catch (err) {
      alert('Error fetching customer data');
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

      <TextInput
        style={styles.input}
        placeholder="Extra Milk if Needed (Litres)"
        keyboardType="numeric"
        value={form.extra_milk_if_needed}
        onChangeText={text => setForm({ ...form, extra_milk_if_needed: text })}
      />
      {errors.extra_milk_if_needed && <Text style={styles.error}>{errors.extra_milk_if_needed}</Text>}

      <Button title="Add Customer" onPress={handleSubmit} />

      {message !== '' && (
        <Text style={styles.successMessage}>{message}</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="See Customer List" onPress={fetchCustomers} />
      </View>

      {showList && (
        <FlatList
          style={{ marginTop: 20 }}
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
          )}
        />
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
  card: {
    backgroundColor: '#e6f2ff',
    padding: 15,
    borderRadius: 8,
    borderBlockColor: '#007bff',
    borderWidth: 1,
    marginBottom: 10,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  phone: { marginTop: 5, color: '#333' },
  address: { color: '#555' },
});

export default AddCustomer;
