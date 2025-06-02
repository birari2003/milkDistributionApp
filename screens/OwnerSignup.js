
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OwnerSignup({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

const handleSignup = async () => {
    if (!name || !phone || !email || !address || !password) {
        return Alert.alert('Please fill all fields');
    }
    try {
        const response = await fetch('http://192.168.43.175:3000/api/owner/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email, address, password }),
        });
        const data = await response.json();
        if (data.success) {
            Alert.alert('Signup successful');
            navigation.navigate('OwnerLogin');
        } else {
            Alert.alert(data.error || 'Signup failed');
        }
    } catch (err) {
        Alert.alert('Something went wrong. Please try again.');
    }
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Owner Signup</Text>

            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Address"
                value={address}
                multiline
                numberOfLines={3}
                onChangeText={setAddress}
            />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

            <Button title="Signup" onPress={handleSignup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 50 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});
