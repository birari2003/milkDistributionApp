

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function OwnerLogin({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');



  const handleLogin = async () => {
  try {
    const response = await fetch('http://192.168.43.175:3000/api/owner/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await response.json();
    if (data.success) {
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('owner', JSON.stringify(data.owner));
      setIsLoggedIn(true);
    } else {
      Alert.alert(data.error || 'Invalid credentials');
    }
  } catch (err) {
    Alert.alert('Something went wrong. Please try again.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="number-pad"
        value={phone}
        onChangeText={(text) => {
          const onlyNumbers = text.replace(/[^0-9]/g, '');
          setPhone(onlyNumbers);
        }}
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 10 }} onPress={() => navigation.navigate('OwnerSignup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
