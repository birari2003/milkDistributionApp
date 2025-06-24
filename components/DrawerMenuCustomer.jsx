import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CustomerDashboard from '../screens/CustomerDashboard.js';

import seeCustomer from '../screens/seeCustomer';
import PaymentsScreen from '../screens/PaymentsScreen';
import { AuthContext } from '../App';

const Drawer = createDrawerNavigator();

const DrawerMenuCustomer = () => {
  const { setRole } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'owner', 'role']);
    setRole(null);
  };

  return (
    <Drawer.Navigator initialRouteName="CustomerDashboard" screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="CustomerDashboard"
        component={CustomerDashboard}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
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

export default DrawerMenuCustomer;
