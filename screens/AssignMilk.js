import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AssignMilk() {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [cowMilk, setCowMilk] = useState('');
    const [buffaloMilk, setBuffaloMilk] = useState('');
    const [assignments, setAssignments] = useState([]);

    // For now, simulate employees
    const employees = [
        { id: '1', name: 'Ravi Singh' },
        { id: '2', name: 'Sunita Devi' },
        { id: '3', name: 'Aman Kumar' },
    ];

    const handleAssignMilk = () => {
        if (!selectedEmployee || !cowMilk || !buffaloMilk) return;

        const employeeName = employees.find((emp) => emp.id === selectedEmployee)?.name || '';

        const updatedAssignments = [...assignments];
        const existingIndex = updatedAssignments.findIndex(
            (item) => item.employeeId === selectedEmployee
        );

        const updatedEntry = {
            id: Date.now().toString(),
            employeeId: selectedEmployee,
            employee: employeeName,
            cowMilk,
            buffaloMilk,
        };

        if (existingIndex !== -1) {
            // ✅ Update existing
            updatedAssignments[existingIndex] = updatedEntry;
        } else {
            // ➕ Add new
            updatedAssignments.push(updatedEntry);
        }

        setAssignments(updatedAssignments);
        setCowMilk('');
        setBuffaloMilk('');
        setSelectedEmployee('');
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>🥛 Assign Milk to Employee</Text>

            <Text style={styles.label}>Select Employee</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedEmployee}
                    onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
                >
                    <Picker.Item label="-- Select Employee --" value="" />
                    {employees.map((emp) => (
                        <Picker.Item key={emp.id} label={emp.name} value={emp.id} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Cow Milk Quantity (liters)"
                value={cowMilk}
                onChangeText={setCowMilk}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Buffalo Milk Quantity (liters)"
                value={buffaloMilk}
                onChangeText={setBuffaloMilk}
                keyboardType="numeric"
            />

            <Button title="✅ Assign Milk" onPress={handleAssignMilk} color="#28a745" />

            <Text style={styles.subheader}>📋 Assigned List</Text>
            {assignments.map((item) => (
                <View key={item.employeeId} style={styles.card}>
                    <Text>👤 {item.employee}</Text>
                    <Text>🐄 Cow Milk: {item.cowMilk} L</Text>
                    <Text>🐃 Buffalo Milk: {item.buffaloMilk} L</Text>
                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    subheader: { fontSize: 18, marginVertical: 15 },
    card: {
        backgroundColor: '#e8f0fe',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
});
