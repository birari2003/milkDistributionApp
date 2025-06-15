import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

const MilkSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://192.168.43.175:3000/api/milk-summary');
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching milk summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Unable to load milk summary.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Milk Distribution Summary</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Milk Distributed Today</Text>
        <Text style={styles.detail}>🐄 Cow Milk: {summary.total_cow_today} L</Text>
        <Text style={styles.detail}>🦬 Buffalo Milk: {summary.total_buffalo_today} L</Text>
        <Text style={styles.total}>Total: {summary.total_cow_today + summary.total_buffalo_today} L</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Milk to be Distributed Tomorrow</Text>
        <Text style={styles.detail}>🐄 Cow Milk: {summary.total_cow_tomorrow} L</Text>
        <Text style={styles.detail}>🦬 Buffalo Milk: {summary.total_buffalo_tomorrow} L</Text>
        <Text style={styles.total}>Total: {summary.total_cow_tomorrow + summary.total_buffalo_tomorrow} L</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Assigned & Returned Milk</Text>
        <Text style={styles.detail}>Assigned Today: {summary.total_assigned_today} L</Text>
        <Text style={styles.detail}>Returned Today: {summary.total_returned_today} L</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#C62828',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  total: {
    fontSize: 17,
    marginTop: 5,
    fontWeight: '600',
    color: '#2E7D32',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#D32F2F',
    fontSize: 16,
  },
});

export default MilkSummary;
