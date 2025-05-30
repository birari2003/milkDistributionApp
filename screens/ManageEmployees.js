import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';

const ManageEmployees = () => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('');
    const [password, setPassword] = useState('');
    const [employees, setEmployees] = useState([]);

    const handleAddEmployee = () => {
        if (!name || !contact || !email || !area || !password) {
            Alert.alert('Missing Info', 'Please fill all fields');
            return;
        }

        const newEmployee = {
            id: Date.now().toString(),
            name,
            contact,
            email,
            area,
            password, // You can hash this if saving to DB
        };

        setEmployees([...employees, newEmployee]);

        // Clear fields
        setName('');
        setContact('');
        setEmail('');
        setArea('');
        setPassword('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Employee</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                value={contact}
                onChangeText={setContact}
            />
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Area"
                value={area}
                onChangeText={setArea}
            />
            <TextInput
                style={styles.input}
                placeholder="Set Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Add Employee" onPress={handleAddEmployee} />

            <Text style={styles.subtitle}>Employee List</Text>
            <FlatList
                data={employees}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>👤 {item.name}</Text>
                        <Text>📞 {item.contact}</Text>
                        <Text>📧 {item.email}</Text>
                        <Text>📍 {item.area}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ManageEmployees;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 8,
        borderRadius: 6,
        marginBottom: 10,
    },
    card: {
        padding: 12,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        marginVertical: 6,
    },
});
