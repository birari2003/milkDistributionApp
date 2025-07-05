import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


export default function OwnerInventory({ navigation }) {
  const [summary, setSummary] = useState({ cow: 0, buffalo: 0, total: 0 });
  const [returned, setReturned] = useState({ cow: 0, buffalo: 0, total: 0 });
  const [employeeData, setEmployeeData] = useState([]);
  const [tomorrowModal, setTomorrowModal] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showPicker, setShowPicker] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'from' or 'to'



  const { width, height } = useWindowDimensions();
  const modalWidth = width > 600 ? width * 0.7 : width * 0.95;
  const modalHeight = height * 0.8;

  const formatDate = (date) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };


  useEffect(() => {
    fetchSummary();
    fetchReturned();
    fetchEmployeeData();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/owner-dashboard-summary');
      const data = await res.json();
      if (data.success) {
        setSummary({ cow: data.total_cow_milk, buffalo: data.total_buffalo_milk, total: data.total });
      }
    } catch (err) {
      console.error('Summary API error:', err);
    }
  };

  const fetchReturned = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/return-milk-summary');
      const data = await res.json();
      if (data.success) {
        setReturned({ cow: data.returned_cow_milk, buffalo: data.returned_buffalo_milk, total: data.total });
      }
    } catch (err) {
      console.error('Return API error:', err);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch('http://192.168.43.175:3000/api/employee-milk-summary-dash');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map(emp => ({
          name: emp.employee_name,
          phone: emp.employee_phone,
          cow: emp.total_cow_milk,
          buffalo: emp.total_buffalo_milk
        }));
        setEmployeeData(formatted);
      } else {
        console.error('Unexpected data structure from API');
      }
    } catch (err) {
      console.error('Employee summary fetch error:', err);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="cup-water" size={28} color="#2563eb" />
            <Text style={styles.headerTitle}>Milk Inventory</Text>
          </View>
          <TouchableOpacity
            style={styles.reportsBtn}
            onPress={() => navigation.navigate('Report')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="file-chart" size={18} color="#fff" />
            <Text style={styles.reportsBtnText}>REPORTS</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }}>
          <TouchableOpacity
            style={styles.datePickerBox}
            onPress={() => { setActivePicker('from'); setShowPicker(true); }}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#2563eb" />
            <Text style={styles.datePickerText}>{formatDate(fromDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerBox}
            onPress={() => { setActivePicker('to'); setShowPicker(true); }}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#2563eb" />
            <Text style={styles.datePickerText}>{formatDate(toDate)}</Text>
          </TouchableOpacity>
        </View>


        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          onConfirm={(date) => {
            if (activePicker === 'from') setFromDate(date);
            else if (activePicker === 'to') setToDate(date);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
        />



        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleBlack}>
            <MaterialCommunityIcons name="calendar-today" size={20} color="#2563eb" /> Cow and Buffalo
          </Text>
          <Text style={styles.totalLiters}>{summary.total} Liters</Text>
          <View style={styles.milkRow}>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐄</Text>
              <Text style={styles.milkTypeLabel}>Cow Milk</Text>
              <Text style={styles.milkTypeValue}>{summary.cow} L</Text>
            </View>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐃</Text>
              <Text style={styles.milkTypeLabel}>Buffalo Milk</Text>
              <Text style={styles.milkTypeValue}>{summary.buffalo} L</Text>
            </View>
          </View>
        </View>


        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleBlack}>
            <MaterialCommunityIcons name="undo" size={20} color="#2563eb" /> Returned
          </Text>
          <Text style={styles.totalLiters}>{returned.total} Liters</Text>
          <View style={styles.milkRow}>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐄</Text>
              <Text style={styles.milkTypeLabel}>Cow Milk</Text>
              <Text style={styles.milkTypeValue}>{returned.cow} L</Text>
            </View>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐃</Text>
              <Text style={styles.milkTypeLabel}>Buffalo Milk</Text>
              <Text style={styles.milkTypeValue}>{returned.buffalo} L</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.tomorrowBtn} onPress={() => setTomorrowModal(true)}>
            <MaterialCommunityIcons name="calendar" size={22} color="#2563eb" />
            <Text style={styles.tomorrowBtnText}>Tomorrow</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#2563eb" />
          </TouchableOpacity>
          <Text style={styles.totalLiters}>{employeeData.reduce((acc, e) => acc + e.cow + e.buffalo, 0)} Liters</Text>
          <View style={styles.milkRow}>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐄</Text>
              <Text style={styles.milkTypeLabel}>Cow Milk</Text>
              <Text style={styles.milkTypeValue}>
                {employeeData.reduce((acc, e) => acc + e.cow, 0)} L
              </Text>
            </View>
            <View style={styles.milkTypeBox}>
              <Text style={{ fontSize: 24 }}>🐃</Text>
              <Text style={styles.milkTypeLabel}>Buffalo Milk</Text>
              <Text style={styles.milkTypeValue}>
                {employeeData.reduce((acc, e) => acc + e.buffalo, 0)} L
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={tomorrowModal} transparent animationType="slide" onRequestClose={() => setTomorrowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setTomorrowModal(false)}>
          <Pressable
            style={[
              styles.regionModalBox,
              { width: modalWidth, height: modalHeight, maxHeight: modalHeight },
            ]}
            onPress={() => { }}
          >
            <Text style={styles.regionModalTitleBlack}>Tomorrow's Distribution</Text>
            <View style={styles.milkRow}>
              <View style={styles.milkTypeBox}>
                <Text style={{ fontSize: 24 }}>🐄</Text>
                <Text style={styles.milkTypeLabel}>Cow Milk</Text>
                <Text style={styles.milkTypeValue}>
                  {employeeData.reduce((acc, e) => acc + e.cow, 0)} L
                </Text>
              </View>
              <View style={styles.milkTypeBox}>
                <Text style={{ fontSize: 24 }}>🐃</Text>
                <Text style={styles.milkTypeLabel}>Buffalo Milk</Text>
                <Text style={styles.milkTypeValue}>
                  {employeeData.reduce((acc, e) => acc + e.buffalo, 0)} L
                </Text>
              </View>
            </View>
            <Text style={styles.regionEmpTitleBlack}>Employee Wise</Text>
            <FlatList
              data={employeeData}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.empRow}>
                  <MaterialCommunityIcons name="account" size={20} color="#2563eb" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.empName}>{item.name}</Text>
                    <Text style={styles.empPhone}>
                      <MaterialCommunityIcons name="phone" size={14} color="#60a5fa" /> {item.phone}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      <MaterialCommunityIcons name="cow" size={14} color="#22c55e" />
                      <Text style={styles.empMilk}>Cow Milk: {item.cow} L</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      <MaterialCommunityIcons name="cow" size={14} color="#facc15" />
                      <Text style={styles.empMilk}>Buffalo Milk: {item.buffalo} L</Text>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
            <TouchableOpacity
              style={[styles.regionBtn, { marginTop: 10, alignSelf: 'center' }]}
              onPress={() => setTomorrowModal(false)}
            >
              <Text style={styles.regionBtnText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  datePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#f8fafc',
  },
  datePickerText: {
    marginLeft: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginLeft: 10,
  },
  sectionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    elevation: 1,
  },
  sectionTitleBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLiters: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 10,
  },
  milkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  milkTypeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 6,
    padding: 10,
    elevation: 1,
    border
  },
  milkTypeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  milkTypeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 2,
  },
  tomorrowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tomorrowBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionModalBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    elevation: 5,
  },
  regionModalTitleBlack: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  regionEmpTitleBlack: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
  },
  empRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  empName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  empPhone: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 2,
  },
  empMilk: {
    fontSize: 16,
    color: '#222',
    marginLeft: 6,
  },
  regionBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 10,
  },
  regionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  reportsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a78bfa', // purple-400
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 10,
  },
  reportsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});