import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const customers = [
    {
        phone: '9876543210',
        name: 'Shalini Mehta',
        status: 'Pending',
        amount: 12320,
        icon: 'person',
        iconColor: '#f59e42',
        region: 'West Zone',
    },
    {
        phone: '9123456780',
        name: 'Amit Kumar',
        status: 'Paid',
        amount: 1880,
        icon: 'person',
        iconColor: '#2563eb',
        region: 'North Zone',
    },
    {
        phone: '9988776655',
        name: 'Priya Sharma',
        status: 'Pending',
        amount: 3450,
        icon: 'person',
        iconColor: '#e11d48',
        region: 'East Zone',
    },
    {
        phone: '9090909090',
        name: 'Rahul Singh',
        status: 'Paid',
        amount: 12320,
        icon: 'person',
        iconColor: '#059669',
        region: 'South Zone',
    },
    {
        phone: '9988722655',
        name: 'Rohit Verma',
        status: 'Pending',
        amount: 2100,
        icon: 'person',
        iconColor: '#f59e42',
        region: 'Central Zone',
    },
];

const statusColors = {
    Paid: '#22c55e',
    Pending: '#ef4444',
};

export default function OwnerCustPayScreen() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [notifiedPhones, setNotifiedPhones] = useState([]);


    const navigation = useNavigation();

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === 'All' || c.status === filter)
    );

    const handleNotify = (phone) => {
        setNotifiedPhones(prev => [...prev, phone]);
        setTimeout(() => {
            setNotifiedPhones(prev => prev.filter(p => p !== phone));
        }, 3000);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <MaterialIcons name="account-circle" size={32} color="#2563eb" />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.headerTitle}>Customer Payment Status</Text>
                </View>
                <Feather name="bell" size={22} color="#64748b" style={{ marginLeft: 'auto' }} />
            </View>

            {/* Search */}
            <Text style={styles.sectionTitle}>Search Customer</Text>
            <View style={styles.searchBox}>
                <Feather name="search" size={18} color="#64748b" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search customer..."
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            {/* Payments Filter */}
            <View style={styles.paymentsHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.paymentsTitle}>Payments</Text>
                    <TouchableOpacity
                        style={styles.seePendingBtn}
                        onPress={() => navigation.navigate('CustPayDetailsScreen')}
                        
                    >
                        <Text style={styles.seePendingText}>See Pending Payments</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    {['All', 'Paid', 'Pending'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.filterBtn,
                                filter === type && styles.filterBtnActive(type),
                            ]}
                            onPress={() => setFilter(type)}
                        >
                            <Text style={[
                                styles.filterBtnText,
                                filter === type && { color: type === 'Paid' ? '#22c55e' : type === 'Pending' ? '#ef4444' : '#2563eb', fontWeight: 'bold' }
                            ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Customer List */}
            <View style={styles.customerList}>
                {filteredCustomers.map(cust => {
                    const isNotified = notifiedPhones.includes(cust.phone);
                    return (
                        <View key={cust.phone} style={styles.customerRow}>
                            <View style={styles.iconAvatar}>
                                <MaterialIcons name={cust.icon} size={32} color={cust.iconColor} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.custName}>{cust.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    <MaterialIcons name="phone" size={14} color="#64748b" style={{ marginRight: 4 }} />
                                    <Text style={styles.custId}>{cust.phone}</Text>
                                </View>
                                <Text style={styles.regionText}>{cust.region}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons
                                        name={cust.status === 'Paid' ? 'check-circle' : 'error'}
                                        size={18}
                                        color={statusColors[cust.status]}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={[
                                        styles.statusText,
                                        { color: statusColors[cust.status] }
                                    ]}>
                                        {cust.status}
                                    </Text>
                                </View>
                                <Text style={styles.amountText}>₹{cust.amount.toLocaleString()}</Text>
                                {cust.status === 'Pending' && (
                                    <TouchableOpacity
                                        style={[
                                            styles.notifyBtn,
                                            isNotified && { backgroundColor: '#bbf7d0' }
                                        ]}
                                        disabled={isNotified}
                                        onPress={() => handleNotify(cust.phone)}
                                    >
                                        <MaterialIcons
                                            name={isNotified ? 'check-circle' : 'notification-important'}
                                            size={16}
                                            color={isNotified ? '#22c55e' : '#ef4444'}
                                        />
                                        <Text style={[
                                            styles.notifyText,
                                            isNotified && { color: '#22c55e' }
                                        ]}>
                                            {isNotified ? 'Notified' : 'Notify'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 18,
        paddingBottom: 30,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        minHeight: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width > 400 ? 370 : '97%',
        marginBottom: 10,
        marginTop: 5,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#22223b',
        fontSize: 18,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: '#2563eb',
        fontSize: 15,
        alignSelf: 'flex-start',
        marginLeft: 12,
        marginTop: 10,
        marginBottom: 4,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 10,
        width: width > 400 ? 370 : '97%',
        marginBottom: 8,
        height: 38,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        color: '#22223b',
        marginLeft: 8,
        height: 30,
    },
    paymentsHeader: {
        width: width > 400 ? 370 : '97%',
        marginTop: 10,
        marginBottom: 4,
    },
    paymentsTitle: {
        fontWeight: 'bold',
        color: '#22223b',
        fontSize: 15,
        marginBottom: 4,
    },
    seePendingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    seePendingText: {
        color: '#2563eb',
        fontWeight: 'bold',
        fontSize: 13,
        marginRight: 2,
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    filterBtn: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: '#f1f5f9',
    },
    filterBtnActive: (type) => ({
        backgroundColor: type === 'Paid' ? '#dcfce7' : type === 'Pending' ? '#fee2e2' : '#dbeafe',
    }),
    filterBtnText: {
        fontSize: 14,
        color: '#2563eb',
    },
    customerList: {
        width: width > 400 ? 370 : '97%',
        marginTop: 4,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e7ef',
        elevation: 1,
    },
    iconAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#e0e7ef',
        alignItems: 'center',
        justifyContent: 'center',
    },
    custName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#22223b',
    },
    custId: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    regionText: {
        fontSize: 12,
        color: '#2563eb',
        marginTop: 2,
        fontWeight: 'bold',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 2,
    },
    amountText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#22223b',
        marginTop: 2,
    },
    notifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    notifyText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 4,
    },
});