import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function OwnerDashboard({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>👑 Owner Dashboard</Text>
            {/* Milk Summary */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>🥛 Milk Summary (Today)</Text>
                <Text>Cow Milk Assigned: 50 Liters</Text>
                <Text>Buffalo Milk Assigned: 30 Liters</Text>
                <Text>Milk Returned: 5 Liters</Text>
            </View>

            {/* Payments Summary */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>💰 Payments</Text>
                <Text>Collected: ₹1500</Text>
                <Text>Pending: ₹500</Text>
            </View>

            {/* Navigation Buttons */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AssignMilk')}
            >
                <Text style={styles.buttonText}>➕ Assign Milk to Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ReturnMilk')}
            >
                <Text style={styles.buttonText}>📥 Receive Returned Milk</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ManageEmployees')}
            >
                <Text style={styles.buttonText}>👷 Manage Employees</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ManageCustomers')}
            >
                <Text style={styles.buttonText}>👷 Manage Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ViewCustomers')}
            >
                <Text style={styles.buttonText}>📊 View Customers Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ViewReports')}
            >
                <Text style={styles.buttonText}>📊 View Daily Report</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: {
        backgroundColor: '#e8f0fe',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonText: { color: 'white', fontSize: 16, textAlign: 'center' },
});
