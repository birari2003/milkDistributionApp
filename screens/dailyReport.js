import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

const DailyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.43.175:3000/api/todays-milk-report');
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      } else {
        alert('Failed to fetch report');
      }
    } catch (err) {
      alert('Error fetching report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReport().then(() => setRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Milk Report</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {reportData.length === 0 ? (
            <Text style={styles.noDataText}>No data available.</Text>
          ) : (
            reportData.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.areaTitle}>Area: {item.area_landmark}</Text>
                <Text style={styles.subText}>Employee: {item.employee_name} ({item.employee_phone})</Text>
                {/* <Text style={styles.subText}>Region: {item.region}</Text> */}
                <Text style={styles.date}>{item.today_date}</Text>


                <View style={styles.infoRow}>
                  <Text style={styles.label}>Total Customers Got milk:</Text>
                  <Text style={styles.value}>{item.total_customers_today}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Total Customers will get Milk:</Text>
                  <Text style={styles.value}>{item.total_customers_tomorrow}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Today's Milk Distributed (L):</Text>
                  <Text style={styles.value}>{item.total_milk_today} L</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Tomorrow want to Distribute (L):</Text>
                  <Text style={styles.value}>{item.total_milk_tomorrow} L</Text>
                  {/* <Text style={styles.date}>📅 Tomorrow: {item.tomorrow_date}</Text> */}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DailyReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 16,
    textAlign: 'center',
    color: '#2a2a2a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007BFF',
  },
  subText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
