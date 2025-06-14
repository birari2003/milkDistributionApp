import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import BottomTabNavigator from './BottomTabNavigator';
import ManageEmployees from '../screens/ManageEmployees';
import ManageCustomers from '../screens/ManageCustomers';
import MilkInventory from '../screens/MilkInventory';
import PaymentsScreen from '../screens/PaymentsScreen';
import HomeScreen from '../screens/HomeScreen';
import { AuthContext } from '../App'; // Make sure AuthContext is exported correctly

import AddEmployee from '../screens/sample';

const Drawer = createDrawerNavigator();

const DrawerMenu = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: true,
            }}
        >
            <Drawer.Screen
                name="Home"
                component={BottomTabNavigator}
                options={{
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
                name="Manage Customers"
                component={ManageCustomers}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Milk Inventory"
                component={MilkInventory}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="cube-outline" size={size} color={color} />
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
        </Drawer.Navigator>
    );
};

export default DrawerMenu;
