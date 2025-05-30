import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const dailyReports = [
    {
        id: 'emp1',
        name: 'Rajesh',
        assignedCow: 5,
        distributedCow: 4,
        returnedCow: 1,
        assignedBuffalo: 3,
        distributedBuffalo: 3,
        returnedBuffalo: 0,
        paymentsCollected: 400,
    },
    {
        id: 'emp2',
        name: 'Suresh',
        assignedCow: 6,
        distributedCow: 5,
        returnedCow: 1,
        assignedBuffalo: 4,
        distributedBuffalo: 2,
        returnedBuffalo: 2,
        paymentsCollected: 280,
    },
];

const ViewDailyReports = () => {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>👤 {item.name}</Text>
            <Text>🐄 Cow Milk - Assigned: {item.assignedCow} L | Distributed: {item.distributedCow} L | Returned: {item.returnedCow} L</Text>
            <Text>🐃 Buffalo Milk - Assigned: {item.assignedBuffalo} L | Distributed: {item.distributedBuffalo} L | Returned: {item.returnedBuffalo} L</Text>
            <Text>💰 Payments Collected: ₹{item.paymentsCollected}</Text>
            <Text>📊 Performance: {item.paymentsCollected > 300 ? 'Good' : 'Average'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📅 Daily Employee Report</Text>
            <FlatList
                data={dailyReports}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No reports found for today.</Text>}
            />
        </View>
    );
};

export default ViewDailyReports;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    card: {
        padding: 12,
        backgroundColor: '#e7f0f7',
        borderRadius: 10,
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
});
