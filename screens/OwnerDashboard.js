import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import InfoCard from '../components/InfoCard';
import EmployeeCard from '../components/EmployeeCard';
import colors from '../theme/colors';

const OwnerDashboard = () => {
    const openDrawer = () => {
        console.log('Drawer open logic to be implemented');
    };

    return (
        <View style={styles.container}>

            {/* Scrollable Body */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.section}>Today's Overview</Text>

                <View style={styles.infoRow}>
                    <InfoCard title="Total Milk Distributed" value="500 L" />
                    <InfoCard title="Pending Payments" value="$2,500" />
                </View>
                <View style={styles.infoRow}>
                    <InfoCard title="Returned Milk" value="20 L" />
                    <InfoCard title="Employee Performance" value="95%" />
                </View>

                <Text style={styles.section}>Employee Performance</Text>
                <EmployeeCard name="Ethan Harper" />
                <EmployeeCard name="Liam Carter" />
                <EmployeeCard name="Noah Bennett" />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default OwnerDashboard;
