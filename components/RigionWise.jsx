import React from 'react';
import {
  Modal,
  Pressable,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RegionWise = ({
  visible,
  onClose,
  data,
  selectedRegion,
  setSelectedRegion,
  openRegion,
}) => {
  const RegionListItem = ({ item }) => (
    <TouchableOpacity style={regionStyles.regionListItem} onPress={() => openRegion(item)}>
      <MaterialCommunityIcons name="map-marker" size={22} color="#2563eb" />
      <View style={{ flex: 1 }}>
        <Text style={regionStyles.regionName}>{item.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={16} color="#22c55e" />
          <Text style={regionStyles.regionLabel}>Cow : </Text>
          <Text style={regionStyles.regionValue}>{item.cow} L</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={16} color="#facc15" />
          <Text style={regionStyles.regionLabel}>Buffalo : </Text>
          <Text style={regionStyles.regionValue}>{item.buffalo} L</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={16} color="#22c55e" />
          <Text style={regionStyles.regionLabel}>Received Cow : </Text>
          <Text style={regionStyles.regionReturnedValue}>{item.returnedCow} L</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={16} color="#facc15" />
          <Text style={regionStyles.regionLabel}>Received Buffalo : </Text>
          <Text style={regionStyles.regionReturnedValueBuffalo}>{item.returnedBuffalo} L</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={18} color="#2563eb" />
    </TouchableOpacity>
  );

  const EmployeeRow = ({ item }) => (
    <View style={regionStyles.empRow}>
      <MaterialCommunityIcons name="account" size={20} color="#2563eb" />
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={regionStyles.empName}>{item.name}</Text>
        <Text style={regionStyles.empPhone}>
          <MaterialCommunityIcons name="phone" size={14} color="#60a5fa" /> {item.phone}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={14} color="#22c55e" />
          <Text style={regionStyles.empMilk}>Cow Milk: {item.cow} L</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <MaterialCommunityIcons name="cow" size={14} color="#facc15" />
          <Text style={regionStyles.empMilk}>Buffalo Milk: {item.buffalo} L</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={regionStyles.empReturnedLabel}>Returned Cow: </Text>
          <Text style={regionStyles.empReturnedValue}>{item.returnedCow} L</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={regionStyles.empReturnedLabelBuffalo}>Returned Buffalo: </Text>
          <Text style={regionStyles.empReturnedValueBuffalo}>{item.returnedBuffalo} L</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={regionStyles.modalOverlay} onPress={onClose}>
        <Pressable style={[regionStyles.regionModalBox]} onPress={() => { }}>
          {!selectedRegion ? (
            <>
              <Text style={regionStyles.regionModalTitleBlack}>Region Wise</Text>
              <FlatList
                data={data.regions}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <RegionListItem item={item} />}
                ListFooterComponent={
                  <Text style={regionStyles.regionTotalReturned}>
                    <MaterialCommunityIcons name="undo" size={16} color="#2563eb" /> Total Received:
                    <Text style={{ color: '#22c55e' }}> Cow: {data.returned.cow} L</Text>
                    <Text style={{ color: '#facc15' }}>  Buffalo: {data.returned.buffalo} L</Text>
                  </Text>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            </>
          ) : (
            <>
              <TouchableOpacity style={regionStyles.backBtn} onPress={() => setSelectedRegion(null)}>
                <MaterialCommunityIcons name="arrow-left" size={22} color="#2563eb" />
                <Text style={regionStyles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <Text style={regionStyles.regionModalTitleBlack}>{selectedRegion.name}</Text>
              <View style={regionStyles.regionDetailRow}>
                <MaterialCommunityIcons name="cow" size={20} color="#22c55e" />
                <Text style={regionStyles.regionDetailLabel}>Cow : </Text>
                <Text style={regionStyles.regionDetailValue}>{selectedRegion.cow} L</Text>
              </View>
              <View style={regionStyles.regionDetailRow}>
                <MaterialCommunityIcons name="cow" size={20} color="#facc15" />
                <Text style={regionStyles.regionDetailLabel}>Buffalo : </Text>
                <Text style={regionStyles.regionDetailValue}>{selectedRegion.buffalo} L</Text>
              </View>
              <View style={regionStyles.regionDetailRow}>
                <MaterialCommunityIcons name="cow" size={20} color="#22c55e" />
                <Text style={regionStyles.regionDetailLabel}>Received Cow : </Text>
                <Text style={regionStyles.regionReturnedValue}>{selectedRegion.returnedCow} L</Text>
              </View>
              <View style={regionStyles.regionDetailRow}>
                <MaterialCommunityIcons name="cow" size={20} color="#facc15" />
                <Text style={regionStyles.regionDetailLabel}>Received Buffalo : </Text>
                <Text style={regionStyles.regionReturnedValueBuffalo}>{selectedRegion.returnedBuffalo} L</Text>
              </View>
              <Text style={regionStyles.regionEmpTitleBlack}>Employee Wise</Text>
              <FlatList
                data={selectedRegion.employees}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => <EmployeeRow item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const regionStyles = StyleSheet.create({
  regionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  regionBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,58,138,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionModalBox: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  elevation: 8,
  shadowColor: '#2563eb',
  shadowOpacity: 0.4,
  shadowRadius: 8,
  shadowOffset: { width: 2, height: 2 },
  alignSelf: 'center',
  width: '90%',
  maxHeight: '85%',
},

  regionModalTitleBlack: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  regionListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  regionLabel: {
    fontSize: 13,
    color: '#222',
    marginLeft: 4,
  },
  regionValue: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  regionReturnedValue: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  regionReturnedValueBuffalo: {
    fontSize: 13,
    color: '#facc15',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  regionTotalReturned: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  regionDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  regionDetailLabel: {
    fontSize: 15,
    color: '#222',
    marginLeft: 4,
  },
  regionDetailValue: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  regionEmpTitleBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
    marginBottom: 6,
  },
  empRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  empName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  empPhone: {
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
  },
  empMilk: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 4,
  },
  empReturnedLabel: {
    fontSize: 13,
    color: '#22c55e',
    marginLeft: 0,
  },
  empReturnedValue: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  empReturnedLabelBuffalo: {
    fontSize: 13,
    color: '#facc15',
    marginLeft: 0,
  },
  empReturnedValueBuffalo: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});

export default RegionWise;
