import React, { useContext, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import EmployeeDashboard from '../screens/EmployeeDashboard';
import EmployeeInventoryScreen from '../screens/EmployeeInventory';
import AddCustomer from '../screens/addCustomer';
import SeeCustomer from '../screens/seeCustomer';
import AreaScreen from '../screens/addArea';
import PaymentsScreen from '../screens/PaymentsScreen';
import { AuthContext } from '../App';

const Drawer = createDrawerNavigator();

const DrawerMenuEmployee = () => {
  const { setRole } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'owner', 'role']);
    setRole(null);
  };

  return (
    <Drawer.Navigator initialRouteName="EmployeeDashboard" screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="EmployeeDashboard"
        component={EmployeeDashboard}
        options={{
          title: 'Employee Panel',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen name="Manage Customers" component={AddCustomer} options={{
        drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
      }} />
      <Drawer.Screen name="Employee Inventory" component={EmployeeInventoryScreen} options={{
        drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
      }} />
      <Drawer.Screen name="See Customers" component={SeeCustomer} options={{
        drawerIcon: ({ color, size }) => <Ionicons name="eye-outline" size={size} color={color} />,
      }} />
      <Drawer.Screen name="Add Area" component={AreaScreen} options={{
        drawerIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
      }} />
      <Drawer.Screen name="Payments" component={PaymentsScreen} options={{
        drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
      }} />
      <Drawer.Screen
        name="Logout"
        component={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        )}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerMenuEmployee;
