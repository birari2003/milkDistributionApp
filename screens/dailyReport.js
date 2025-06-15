import React from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import MilkSummary from '../components/milkSummary';
import AreaWiseReport from '../components/areaWiseReport';

const DailyReport = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>📋 Today's Milk Report</Text>
        
        {/* Milk Summary */}
        <MilkSummary />

        {/* Area-wise Report */}
        <AreaWiseReport />
      </ScrollView>
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
});
