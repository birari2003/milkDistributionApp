import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
      <Text style={styles.mainTitle}>Welcome to MilkEase</Text>

        <Image
          source={require('../images/milk_banner.png')} // replace with your local image
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <Text style={styles.bannerTitle}>100% Organic Milk</Text>
        <Text style={styles.bannerSubtitle}>Guaranteed Fresh & Pure Every Day</Text>
        <TouchableOpacity style={styles.guaranteeButton}>
          <Text style={styles.guaranteeText}>✓ 100% Organic Guaranteed</Text>
        </TouchableOpacity>
      </View>

      {/* Product Cards */}
      <View style={styles.card}>
        <Image source={require('../images/cow_milk.png')} style={styles.productImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.productTitle}>Cow Milk</Text>
          <Text style={styles.productSubtitle}>Subscribed</Text>
          <View style={styles.dayRow}>
            {['12', '13', '14', '15', '16', '17', '18'].map((day, index) => (
              <View key={index} style={[styles.dayCircle, index === 5 && styles.missedDay]}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Image source={require('../images/baffelo.png')} style={styles.productImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.productTitle}>Buffalo Milk</Text>
          <Text style={styles.productDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.knowMore}>
              <Text style={styles.knowText}>Know More</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <Text style={styles.featureHeader}>Features of MilkEase</Text>
      <View style={styles.featuresContainer}>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Track your daily milk delivery activity</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Receive instant delivery notifications</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Contact your delivery associate anytime</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Easily pause or resume milk service</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Flexible billing: daily, weekly, monthly</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Pay online or offline, hassle-free</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Instant digital receipts on every payment</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../images/cow_milk.png')} style={styles.icon} />
          <Text style={styles.featureText}>Notifications</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30, backgroundColor: '#f9f9f9' },

  // Banner
  banner: { alignItems: 'center', backgroundColor: '#90d0f0', paddingVertical: 20, paddingHorizontal: 10 },
 bannerImage: {
  width: '100%',
  height: 200,
  marginBottom: 10,
  borderRadius: 0,     
},

  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  mainTitle: { fontSize: 30, fontWeight: 'bold', color: '#2c3e50', alignItems: 'center' },
  bannerSubtitle: { fontSize: 14, color: '#555', marginVertical: 5 },
  guaranteeButton: { marginTop: 10, backgroundColor: '#27ae60', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 },
  guaranteeText: { color: 'white', fontWeight: '600' },

  // Product Card
  card: { flexDirection: 'row', padding: 15, backgroundColor: 'white', marginHorizontal: 15, borderRadius: 15, marginTop: 20, elevation: 3 },
  productImage: { width: 60, height: 80, marginRight: 15 },
  productTitle: { fontSize: 18, fontWeight: 'bold' },
  productSubtitle: { fontSize: 14, color: 'green', marginVertical: 5 },
  productDesc: { fontSize: 13, color: '#777' },
  dayRow: { flexDirection: 'row', marginTop: 5 },
  dayCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#dff0d8', justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  missedDay: { backgroundColor: '#f8d7da' },
  dayText: { color: '#333', fontWeight: '600' },
  actionRow: { flexDirection: 'row', marginTop: 10 },
  knowMore: { backgroundColor: '#f1f1f1', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginRight: 10 },
  subscribeBtn: { backgroundColor: '#2ecc71', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  knowText: { color: '#333' },
  subscribeText: { color: '#fff' },

  // Features
  featureHeader: { fontSize: 20, fontWeight: 'bold', margin: 20, marginBottom: 10, color: '#2c3e50' },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  featureBox: {
    width: '45%',
    backgroundColor: '#3dbbff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderBlockColor: '#00000',
    alignItems: 'center',
    elevation: 3,
  },
  icon: { width: 40, height: 40, marginBottom: 10 },
  featureText: { fontSize: 14, textAlign: 'center', color: '#333' },
});
