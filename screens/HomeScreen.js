import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Section */}
      <Text style={styles.heading}>Welcome to MilkEase</Text>
      <Text style={styles.subheading}>Your smart milk distribution companion</Text>

      {/* AI Illustration */}
      <Image
        source={{ uri: 'https://cdn.pixabay.com/photo/2023/10/12/12/42/cow-8310536_1280.png' }} // Replace with better AI illustration if needed
        style={styles.image}
        resizeMode="contain"
      />

      {/* Features */}
      <Text style={styles.featuresTitle}>Why You'll Love It</Text>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Track your daily milk delivery activity</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Receive instant delivery notifications</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Contact your delivery associate anytime</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Easily pause or resume milk service</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Flexible billing: daily, weekly, monthly</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Pay online or offline, hassle-free</Text>
      </View>

      <View style={styles.feature}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.featureText}>Instant digital receipts on every payment</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#2c3e50',
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 20,
    color: '#2ecc71',
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
    flexShrink: 1,
  },
});
