import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Checkbox from 'expo-checkbox';

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
        const enrichedData = data.customers.map(c => ({
          ...c,
          getToday: false,
          getTomorrow: false,
          extraToday: '',
          extraTomorrow: '',
          submitted: false,
        }));
        setCustomers(enrichedData);
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

  const handleChange = (index, field, value) => {
    const updated = [...customers];
    updated[index][field] = value;
    setCustomers(updated);
  };

 const handleSubmit = async (customer, index) => {
  try {
    const response = await fetch('http://192.168.43.175:3000/api/milk-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        got_today: customer.getToday,
        will_get_tomorrow: customer.getTomorrow,
        extra_today: parseFloat(customer.extraToday || 0),
        extra_tomorrow: parseFloat(customer.extraTomorrow || 0),
      })
    });

    const data = await response.json();
    if (data.success) {
      const updated = [...customers];
      updated[index].submitted = true;
      setCustomers(updated);
    } else {
      Alert.alert('Error', 'Failed to submit report');
    }
  } catch (err) {
    Alert.alert('Error', 'Network error while submitting report');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Customer List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : showList ? (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.leftColumn}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    value={item.getToday}
                    onValueChange={(val) => handleChange(index, 'getToday', val)}
                  />
                  <Text style={styles.checkboxLabel}>Got milk today?</Text>
                </View>
                <TextInput
                  placeholder="Extra today (L)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={item.extraToday}
                  onChangeText={(val) => handleChange(index, 'extraToday', val)}
                />

                <View style={styles.checkboxRow}>
                  <Checkbox
                    value={item.getTomorrow}
                    onValueChange={(val) => handleChange(index, 'getTomorrow', val)}
                  />
                  <Text style={styles.checkboxLabel}>Will get tomorrow?</Text>
                </View>
                <TextInput
                  placeholder="Extra tomorrow (L)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={item.extraTomorrow}
                  onChangeText={(val) => handleChange(index, 'extraTomorrow', val)}
                />

                <TouchableOpacity
  style={styles.submitBtn}
  onPress={() => handleSubmit(item, index)}
>
  <Text style={styles.submitBtnText}>Submit</Text>
</TouchableOpacity>

{item.submitted && (
  <Text style={styles.submittedText}>Information Submitted...</Text>
)}

              </View>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  leftColumn: {
    flex: 1.2,
    paddingRight: 10,
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 1.8,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginTop: 6,
    height: 40,
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 8,
  },
  submitBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  submittedText: {
  marginTop: 6,
  fontSize: 14,
  color: 'green',
  fontWeight: '600',
},

});

export default SeeCustomer;
