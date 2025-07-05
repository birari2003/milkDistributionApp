import React, { useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerLogin from './screens/OwnerLogin';
import OwnerSignup from './screens/OwnerSignup';
import DrawerMenu from './components/DrawerMenu';
import DrawerMenuEmployee from './components/DrawerMenuEmployee';
import DrawerMenuCustomer from './components/DrawerMenuCustomer';
import OnboardingScreen from './screens/OnboardingScreen';

export const AuthContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('token');
      const savedRole = await AsyncStorage.getItem('role');
      if (token && savedRole) {
        setRole(savedRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ setRole }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {role === 'owner' ? (
            <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
          ) : role === 'employee' ? (
            <Stack.Screen name="DrawerMenuEmployee" component={DrawerMenuEmployee} />
          ) : role === 'customer' ? (
            <Stack.Screen name="DrawerMenuCustomer" component={DrawerMenuCustomer} />
          ) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
              <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
