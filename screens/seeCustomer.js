import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ReportSubmit from '../components/reportSubmit';
import UpdateCustomer from '../components/updateCustomer';

const SeeCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // for expanded item
  const [activeTab, setActiveTab] = useState(null);     // 'update' or 'report'

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      const user = JSON.parse(userStr);

      if (!user?.area_id) {
        alert('Missing area information');
        return;
      }

      const res = await fetch(`http://192.168.43.175:3000/api/customers?area_id=${user.area_id}`);
      const data = await res.json();

      if (data.success) {
        const enrichedData = data.customers.map(c => ({

          ...c,
          getToday: false,
          getTomorrow: false,
          extraToday: '',
          extraTomorrow: '',
          submitted: false,
        }));
        setCustomers(enrichedData);
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

  const handleToggle = (index, tab) => {
    // If the same customer and same tab is tapped again, close it
    if (activeIndex === index && activeTab === tab) {
      setActiveIndex(null);
      setActiveTab(null);
    } else {
      setActiveIndex(index);
      setActiveTab(tab);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customer List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : customers.length > 0 ? (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              {/* Customer Basic Info */}
              <View style={styles.rowSpaceBetween}>
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phone}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleToggle(index, 'update')}
                >
                  <Text style={styles.btnText}>Update Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: '#28a745' }]}
                  onPress={() => handleToggle(index, 'report')}
                >
                  <Text style={styles.btnText}>Today's Report</Text>
                </TouchableOpacity>
              </View>

              {/* Conditional Rendering */}
              {activeIndex === index && activeTab === 'update' && (
                <UpdateCustomer customer={item} />
              )}

              {activeIndex === index && activeTab === 'report' && (
                <ReportSubmit customer={item} index={index} />
              )}
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
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SeeCustomer;
