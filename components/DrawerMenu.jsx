import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import OwnerDashboard from '../screens/OwnerDashboard';
import AddEmployee from '../screens/ManageEmployees';
import AddCustomer from '../screens/addCustomerByOwner';
import PaymentsScreen from '../screens/PaymentsScreen';
import HomeScreen from '../screens/HomeScreen';
import AreaScreen from '../screens/addArea';
import DailyReport from '../screens/dailyReport';
import AssignMilkScreen from './assignMilk';
import { AuthContext } from '../App';

const Drawer = createDrawerNavigator();

const DrawerMenu = () => {
  const { setRole } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'owner', 'role']);
    setRole(null);
  };

  const commonHeaderOptions = {
    headerStyle: {
      backgroundColor: '#1e40af', // Deep blue
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
  };

  return (
    <Drawer.Navigator
      initialRouteName="OwnerDashboard"
      screenOptions={{
        drawerActiveTintColor: '#1e40af',
        drawerLabelStyle: { fontSize: 16 },
        ...commonHeaderOptions,
      }}
    >
      <Drawer.Screen
        name="OwnerDashboard"
        component={OwnerDashboard}
        options={{
          title: 'Owner Panel',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Employee"
        component={AddEmployee}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Customer"
        component={AddCustomer}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Daily Report"
        component={DailyReport}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Assign Milk"
        component={AssignMilkScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flask-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Area"
        component={AreaScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Logout" onPress={handleLogout} color="#ef4444" />
          </View>
        )}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerMenu;
