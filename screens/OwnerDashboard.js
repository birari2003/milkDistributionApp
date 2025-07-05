import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const [cowMilk, setCowMilk] = useState(0);
  const [buffaloMilk, setBuffaloMilk] = useState(0);
  const [totalMilk, setTotalMilk] = useState(0);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const handleOption = (option) => {
    setMenuVisible(false);
    alert(`${option} clicked`);
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/owner-dashboard-summary');
      const data = await res.json();
      if (data.success) {
        setCowMilk(data.total_cow_milk);
        setBuffaloMilk(data.total_buffalo_milk);
        setTotalMilk(data.total);
        console.log('Dashboard data:', data);
      } else {
        Alert.alert('Error', data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      Alert.alert('Error', 'Network issue while loading dashboard');
    }

  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scroll} style={{ marginBottom: 60 }}>
        <View style={styles.totalMilkCard}>
          <Icon name="local-drink" size={28} color="#0ea5e9" />
          <Text style={styles.totalMilkText}>Total Milk Supplied Today</Text>
          <Text style={styles.totalMilkValue}>{totalMilk} Litres</Text>
        </View>

        <View style={styles.milkContainer}>
          <View style={styles.milkCard}>
            <Text style={styles.emojiIcon}>🐄</Text>
            <Text style={styles.milkLabel}>Cow Milk</Text>
            <Text style={styles.milkValue}>{cowMilk} L</Text>
            <Text style={styles.priceLabel}>Price: ₹56/L</Text>
          </View>
          <View style={styles.milkCard}>
            <Text style={styles.emojiIcon}>🐃</Text>
            <Text style={styles.milkLabel}>Buffalo Milk</Text>
            <Text style={styles.milkValue}>{buffaloMilk} L</Text>
            <Text style={styles.priceLabel}>Price: ₹70/L</Text>
          </View>


        </View>

        {/* Assign Milk Option */}
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Assign Milk')}>
            <Icon name="assignment" size={24} color="#0ea5e9" />
            <Text style={styles.cardText}>Assign Milk</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Admin Dashboard</Text>
          <Text style={styles.subheading}>Quick access to manage your dairy operations</Text>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Add Employee')}>
            <Icon name="groups" size={24} color="#3b82f6" />
            <Text style={styles.cardText}>Add Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Add Customer')}>
            <Icon name="person" size={24} color="#f97316" />
            <Text style={styles.cardText}>Add Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Daily Report')}>
            <Icon name="inventory" size={24} color="#10b981" />
            <Text style={styles.cardText}>Daily Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Payment Status')}>
            <Icon name="payments" size={24} color="#60a5fa" />
            <Text style={styles.cardText}>Payment Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab('Home')} style={styles.navItem}>
          <Icon name="home" size={28} color={activeTab === 'Home' ? '#0284c7' : '#555'} />
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeTabText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Settings')} style={styles.navItem}>
          <Icon name="settings" size={28} color={activeTab === 'Settings' ? '#0284c7' : '#555'} />
          <Text style={[styles.navText, activeTab === 'Settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Account')} style={styles.navItem}>
          <Icon name="account-circle" size={28} color={activeTab === 'Account' ? '#0284c7' : '#555'} />
          <Text style={[styles.navText, activeTab === 'Account' && styles.activeTabText]}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#1e40af',
  },
  scroll: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#000',
  },
  subheading: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#555',
  },

  // Total Milk Supplied
  totalMilkCard: {
    backgroundColor: '#e0f2fe',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
        borderStyle : ' solid',
    borderColor: '#023E8A',
    borderWidth: 1,
  },
  totalMilkText: {
    fontSize: 18,
    marginTop: 5,
    color: '#0f172a',
    fontWeight: '600',
  },
  totalMilkValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0284c7',
    marginTop: 5,
  },

  // Cow/Buffalo Milk
  milkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginHorizontal: 10,
  },
  milkCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    elevation: 2,
        borderStyle : ' solid',
    borderColor: '#023E8A',
    borderWidth: 1,
  },
  milkLabel: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  milkValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  priceLabel: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 4,
  },

  // Dashboard cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '600',
    color: '#333',
  },

  // Menu modal
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 60,
    marginLeft: 10,
  },
  menuBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 170,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 30,
    marginBottom: 4,
  },

  navText: {
    fontSize: 12,
    color: '#555',
  },
  activeTabText: {
    color: '#0284c7',
    fontWeight: '600',
  },
});