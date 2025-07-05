import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window');

export default function CustomerDashboard() {
  const [milkInfo, setMilkInfo] = useState({ cow: 0, buffalo: 0, extra: 0, total: 0 });
  const [deliveryStatus, setDeliveryStatus] = useState(false); // can update from API later
  const [cowRate, setCowRate] = useState(0);
  const [buffaloRate, setBuffaloRate] = useState(0);

  useEffect(() => {

       fetch('http://192.168.43.175:3000/api/get-latest-milk-price')
         .then(res => res.json())
         .then(data => {
           if (data.success && data.latest) {
             setCowRate(data.latest.cow_milk_price);
             setBuffaloRate(data.latest.buffalo_milk_price);
           }
         })
         .catch(err => {
           console.error('Fetch price error:', err);
         });
     }, []);



  useEffect(() => {
    const getMilkInfo = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = JSON.parse(userStr);
        if (!user?.id) return;

        const res = await fetch('http://192.168.43.175:3000/api/customer-today-milk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id: user.id }),
        });

        const data = await res.json();
        if (data.success) {
          setMilkInfo({
            cow: data.cow,
            buffalo: data.buffalo,
            extra: data.extra,
            total: data.total,
          });

          if (data.total > 0) setDeliveryStatus(true);
        }
      } catch (err) {
        console.error('Milk fetch error:', err);
      }
    };

    getMilkInfo();
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Total Milk Received Today */}
        <View style={styles.totalSuppliedBox}>
          <MaterialCommunityIcons name="cup-water" size={28} color="#2563eb" style={{ marginBottom: 2 }} />
          <Text style={styles.totalSuppliedLabel}>Milk Received Today</Text>
          <Text style={styles.totalSuppliedValue}>
            {milkInfo.total} <Text style={{ fontSize: 18 }}>Litres</Text>
          </Text>
        </View>

        {/* Milk Cards */}
        <View style={styles.milkRow}>
          <View style={styles.milkCard}>
            <Text style={styles.emojiIcon}>🐄</Text>
            <Text style={styles.milkLabel}>Cow Milk</Text>
            <Text style={styles.milkValue}>{milkInfo.cow} L</Text>
            <Text style={styles.priceText}>Price: ₹{cowRate}/L</Text>
          </View>
          <View style={styles.milkCard}>
            <Text style={styles.emojiIcon}>🐃</Text>
            <Text style={styles.milkLabel}>Buffalo Milk</Text>
            <Text style={styles.milkValue}>{milkInfo.buffalo} L</Text>
            <Text style={styles.priceText}>Price: ₹{buffaloRate}/L</Text>
          </View>
        </View>


        {/* Delivery Status */}
        <View style={styles.deliveryStatusBox}>
          <MaterialCommunityIcons
            name={deliveryStatus ? "check-circle" : "close-circle"}
            size={22}
            color={deliveryStatus ? "#22c55e" : "#ef4444"}
            style={{ marginRight: 8 }}
          />
          <Text style={[
            styles.deliveryStatusText,
            { color: deliveryStatus ? "#22c55e" : "#ef4444" }
          ]}>
            {deliveryStatus ? "Delivered" : "Not Delivered"}
          </Text>
        </View>

        {/* Dashboard Title */}
        <Text style={styles.dashboardTitle}>Customer Dashboard</Text>
        <Text style={styles.dashboardDesc}>Quick access to manage your dairy services</Text>

        {/* Quick Actions */}
        <TouchableOpacity style={styles.optionCard}>
          <MaterialCommunityIcons name="truck-delivery" size={22} color="#2563eb" style={styles.optionIcon} />
          <Text style={styles.optionText}>Delivery Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard}>
          <FontAwesome5 name="money-check-alt" size={20} color="#60a5fa" style={styles.optionIcon} />
          <Text style={styles.optionText}>Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard}>
          <MaterialIcons name="help-outline" size={22} color="#f59e42" style={styles.optionIcon} />
          <Text style={styles.optionText}>Query</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={22} color="#2563eb" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={22} color="#64748b" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="account-circle" size={22} color="#64748b" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5fb',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 2,
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  totalSuppliedBox: {
    backgroundColor: '#e6f0fb',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
    borderStyle: 'solid',
    borderColor: '#023E8A',
    borderWidth: 1,
  },
  totalSuppliedLabel: {
    color: '#222',
    fontSize: 16,
    marginBottom: 2,
    marginTop: 2,
  },
  totalSuppliedValue: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: 2,
  },
  emojiIcon: {
  fontSize: 30,
  marginBottom: 4,
},

  milkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  milkCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 4,
    elevation: 1,
    minWidth: width * 0.38,
    borderStyle: 'solid',
    borderColor: '#023E8A',
    borderWidth: 1,
  },
  milkLabel: {
    color: '#64748b',
    fontSize: 15,
    marginTop: 4,
  },
  milkValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  priceText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
  },
  deliveryStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  deliveryStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 2,
  },
  dashboardDesc: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5fb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e7ef',
    backgroundColor: '#fff',
    paddingVertical: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 2,
    fontWeight: 'bold',
  },
});



