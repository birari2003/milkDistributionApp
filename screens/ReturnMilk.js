import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

const initialData = [
    {
        id: 'emp1',
        name: 'Rajesh',
        assignedCowMilk: 5,
        assignedBuffaloMilk: 3,
        distributedCowMilk: 4,
        distributedBuffaloMilk: 3,
        isReturned: false,
    },
    {
        id: 'emp2',
        name: 'Suresh',
        assignedCowMilk: 6,
        assignedBuffaloMilk: 2,
        distributedCowMilk: 6,
        distributedBuffaloMilk: 2,
        isReturned: true,
    },
    {
        id: 'emp3',
        name: 'Gaurav',
        assignedCowMilk: 6,
        assignedBuffaloMilk: 2,
        distributedCowMilk: 5,
        distributedBuffaloMilk: 2,
        isReturned: false,
    },
];

const ReceiveReturnedMilk = () => {
    const [employees, setEmployees] = useState(initialData);

    const markAsReturned = (id) => {
        const updated = employees.map((emp) =>
            emp.id === id ? { ...emp, isReturned: true } : emp
        );
        setEmployees(updated);
    };

    const renderItem = ({ item }) => {
        const pendingCow = item.assignedCowMilk - item.distributedCowMilk;
        const pendingBuffalo = item.assignedBuffaloMilk - item.distributedBuffaloMilk;

        return (
            <View style={styles.card}>
                <Text style={styles.name}>👤 {item.name} </Text>
                {!item.isReturned ? <Text style={styles.pendingcolor}>Pending</Text> : <Text style={styles.returnedcolor}>Returned</Text>}
                <Text>🐄 Cow Milk Assigned: {item.assignedCowMilk} L</Text>
                <Text>🐃 Buffalo Milk Assigned: {item.assignedBuffaloMilk} L</Text>

                {!item.isReturned ? (
                    <>
                        <Text>🐄 Cow Milk Pending: {pendingCow} L</Text>
                        <Text>🐃 Buffalo Milk Pending: {pendingBuffalo} L</Text>
                        {(pendingCow > 0 || pendingBuffalo > 0) && (
                            <Button
                                title="Mark as Returned"
                                onPress={() => markAsReturned(item.id)}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <Text>📦 Cow Milk Returned: {pendingCow} L</Text>
                        <Text>📦 Buffalo Milk Returned: {pendingBuffalo} L</Text>
                    </>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Receive Returned Milk</Text>
            <FlatList
                data={employees}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No pending returns 🎉</Text>}
            />
        </View>
    );
};

export default ReceiveReturnedMilk;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#f2f2f2',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
    },
    pendingcolor: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    returnedcolor: {
        color: 'green',
        fontWeight: 'bold',
        marginBottom: 6,
    },
});
