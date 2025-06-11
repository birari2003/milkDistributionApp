import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import BottomTabNavigator from './BottomTabNavigator';
// import ManageCustomers from '../screens/ManageCustomers';
import PaymentsScreen from '../screens/PaymentsScreen';
import { AuthContext } from '../App'; // Make sure AuthContext is exported correctly
import AreaScreen from '../screens/addArea';
import AddCustomer from '../screens/addCustomer';


const Drawer = createDrawerNavigator();

const DrawerMenuEmployee = () => {
 const { setRole } = useContext(AuthContext);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('owner');
        await AsyncStorage.removeItem('role');
        setRole(null); // This will trigger re-render and go back to login
    };


  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Manage Customers"
        component={AddCustomer}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="Add Area"
        component={AreaScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      {/* <Drawer.Screen
        name="Manage Customers"
        component={ManageCustomers}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      /> */}
      <Drawer.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      {/* Custom logout button below drawer menu */}
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
      {/* Add more screens as needed */}
    </Drawer.Navigator>
  );
};

export default DrawerMenuEmployee;
