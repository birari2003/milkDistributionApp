import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

const SeeCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://192.168.43.175:3000/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
        setShowList(true);
      } else {
        alert('Failed to fetch customers');
      }
    } catch (err) {
      alert('Error fetching customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customer List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : showList ? (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>📞 {item.phone}</Text>
              <Text style={styles.address}>🏠 {item.address}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No customers found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  phone: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
});

export default SeeCustomer;
