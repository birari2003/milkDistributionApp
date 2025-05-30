import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', contact: '', email: '', area: '', password: '' });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleAddCustomer = () => {
        if (!form.name || !form.contact || !form.email || !form.area || !form.password) {
            alert('Fill all fields!');
            return;
        }

        const newCustomer = { ...form, id: Date.now().toString() };
        setCustomers([...customers, newCustomer]);
        setForm({ name: '', contact: '', email: '', area: '', password: '' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👥 Manage Customers</Text>

            {/* Add Form */}
            <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={(text) => handleChange('name', text)} />
            <TextInput style={styles.input} placeholder="Contact" value={form.contact} onChangeText={(text) => handleChange('contact', text)} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Area" value={form.area} onChangeText={(text) => handleChange('area', text)} />
            <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={(text) => handleChange('password', text)} secureTextEntry />

            <Button title="Add Customer" onPress={handleAddCustomer} />

            {/* Customer List */}
            <FlatList
                data={customers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>👤 {item.name}</Text>
                        <Text>📞 {item.contact}</Text>
                        <Text>📍 {item.area}</Text>
                        <Text>📧 {item.email}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ marginTop: 20 }}>No customers added yet.</Text>}
            />
        </View>
    );
};

export default ManageCustomers;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 8,
        marginBottom: 8,
        borderRadius: 6,
    },
    card: {
        backgroundColor: '#f0f4f8',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
});
