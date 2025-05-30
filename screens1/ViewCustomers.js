import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const customers = [
    {
        id: 'cust1',
        name: 'Anjali Sharma',
        records: [
            {
                date: '2025-05-27',
                cowMilk: 2,
                buffaloMilk: 1,
                amountPaid: 50,
                totalCost: 60,
            },
            {
                date: '2025-05-26',
                cowMilk: 2,
                buffaloMilk: 2,
                amountPaid: 0,
                totalCost: 80,
            },
        ],
    },
    {
        id: 'cust2',
        name: 'Rohit Verma',
        records: [
            {
                date: '2025-05-27',
                cowMilk: 1,
                buffaloMilk: 1,
                amountPaid: 40,
                totalCost: 60,
            },
        ],
    },
];

const ViewCustomers = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>📄 View Customer Reports</Text>

            <FlatList
                data={customers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const totalPaid = item.records.reduce((sum, r) => sum + r.amountPaid, 0);
                    const totalCost = item.records.reduce((sum, r) => sum + r.totalCost, 0);
                    const pending = totalCost - totalPaid;

                    return (
                        <View style={styles.card}>
                            <Text style={styles.name}>👤 {item.name}</Text>
                            <Text>💰 Paid: ₹{totalPaid}</Text>
                            <Text>⏳ Pending: ₹{pending}</Text>

                            <Text style={{ marginTop: 6, fontWeight: 'bold' }}>🗓️ Daily Records:</Text>
                            {item.records.map((r, i) => (
                                <View key={i} style={styles.recordRow}>
                                    <Text>{r.date} - 🐄 {r.cowMilk}L | 🐃 {r.buffaloMilk}L | ₹Paid: {r.amountPaid} / {r.totalCost}</Text>
                                </View>
                            ))}
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default ViewCustomers;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    card: {
        backgroundColor: '#f7f9fc',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        elevation: 2,
    },
    name: { fontSize: 18, fontWeight: 'bold' },
    recordRow: { marginTop: 4 },
});
