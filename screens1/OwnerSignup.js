import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OwnerSignup({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) return Alert.alert('Fill all fields');
        await AsyncStorage.setItem('ownerEmail', email);
        await AsyncStorage.setItem('ownerPassword', password);
        Alert.alert('Signup successful');
        navigation.navigate('OwnerLogin');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Owner Signup</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Signup" onPress={handleSignup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, marginTop: 100 },
    title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
