import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
} from 'react-native';

const UpdateCustomer = ({ customer }) => {
    console.log("Customer data:", customer);
    if (!customer) {

        return (
            <View>
                <Text>No customer data provided.</Text>
            </View>
        );
    }

    const [name, setName] = useState(customer.name || '');
    const [phone, setPhone] = useState(customer.phone || '');
    const [dailyMilk, setDailyMilk] = useState(String(customer.daily_milk_needed || ''));

    const handleUpdate = async () => {
        if (!name || !phone || !dailyMilk) {
            Alert.alert('Validation Error', 'All fields are required');
            return;
        }
        console.log("button clicked");

        if (!customer?.id) {
            Alert.alert('Error', 'Customer ID is missing');
            // return;
        }

        try {
            const res = await fetch(`http://192.168.43.175:3000/api/customer/${customer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    daily_milk_needed: parseFloat(dailyMilk),
                    milk_category: customer.milk_category || '', // Ensure milk_category is included
                }),
            });


            const contentType = res.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid JSON response');
            }

            const data = await res.json();

            if (data.success) {
                Alert.alert('Success', data.message);
            } else {
                Alert.alert('Error', data.message || 'Failed to update');
            }
        } catch (err) {
            console.error('Update Error:', err);
            Alert.alert('Error', 'Something went wrong');
        }
    };

  
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    placeholder="Enter name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                    placeholder="Enter phone"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Milk Category</Text>
                <TextInput
                    value={customer.milk_category || ''}
                    editable={false}
                    style={styles.input}
                    placeholder="Milk Category"
                />
            </View>


            <View style={styles.inputGroup}>
                <Text style={styles.label}>Daily Milk Needed (L)</Text>
                <TextInput
                    value={dailyMilk}
                    onChangeText={setDailyMilk}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="Enter quantity"
                />
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
                <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fa',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: '#fff',
    },
    btn: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdateCustomer;
