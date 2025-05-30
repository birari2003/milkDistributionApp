import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const paymentHistory = [
    { id: '1', date: '2024-06-01', amount: 49.99, status: 'Completed' },
    { id: '2', date: '2024-05-15', amount: 19.99, status: 'Pending' },
    { id: '3', date: '2024-05-01', amount: 29.99, status: 'Completed' },
];

const PaymentsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment History</Text>
            <View style={styles.listContainer}>
                {paymentHistory.map(payment => (
                    <View key={payment.id} style={styles.item}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date:</Text>
                            <Text style={styles.value}>{payment.date}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Amount:</Text>
                            <Text style={styles.value}>${payment.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={[
                                styles.value,
                                payment.status === 'Completed' ? styles.completed : styles.pending
                            ]}>
                                {payment.status}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listContainer: {
        width: '90%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    item: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        color: '#555',
    },
    completed: {
        color: 'green',
    },
    pending: {
        color: 'orange',
    },

});

export default PaymentsScreen;
