import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView } from 'react-native';

const AreaWiseReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const response = await fetch('http://192.168.43.175:3000/api/area-wise-report');
      const result = await response.json();
      if (result.success) {
        setReportData(result.data);
      }
    } catch (error) {
      console.error('Error fetching area report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.areaTitle}>📍 {item.area_name}</Text>
      <Text style={styles.empName}>👨‍💼 Employee: {item.employee_name}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Assigned Milk: {item.assigned_milk_today} L</Text>
        <Text style={styles.label}>Distributed Milk: {item.total_distributed_today} L</Text>
        <Text style={styles.subDetail}>🐄 Cow: {item.distributed_cow_today} L</Text>
        <Text style={styles.subDetail}>🦬 Buffalo: {item.distributed_buffalo_today} L</Text>
        <Text style={styles.label}>Returned Milk: {item.returned_milk_today} L</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Customers Served:</Text>
        <Text style={styles.subDetail}>🐄 Cow Milk: {item.cow_customers_today}</Text>
        <Text style={styles.subDetail}>🦬 Buffalo Milk: {item.buffalo_customers_today}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tomorrow's Milk Need:</Text>
        <Text style={styles.subDetail}>🐄 Cow: {item.cow_tomorrow} L</Text>
        <Text style={styles.subDetail}>🦬 Buffalo: {item.buffalo_tomorrow} L</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Area-wise Milk Distribution Report</Text>
      <FlatList
        data={reportData}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#C62828',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2E7D32',
  },
  empName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AreaWiseReport;
