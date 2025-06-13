// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import OwnerLogin from './screens/OwnerLogin';
// import OwnerSignup from './screens/OwnerSignup';
// import DrawerMenu from './components/DrawerMenu';
// import OwnerDashboard from './screens/OwnerDashboard';
// import HomeScreen from './screens/HomeScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="OwnerLogin">
//         <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
//         <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
//         <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
//         <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} /> 
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }



import React, { useEffect, useState, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerLogin from './screens/OwnerLogin';
import OwnerSignup from './screens/OwnerSignup';
import DrawerMenu from './components/DrawerMenu';
import DrawerMenuEmployee from './components/DrawerMenuEmployee';
import OwnerDashboard from './screens/OwnerDashboard';
import HomeScreen from './screens/HomeScreen';
import AreaScreen from './screens/addArea';
import AddEmployee from './screens/ManageEmployees';
import EmployeeDashboard from './screens/EmployeeDashboard';
import AddCustomer from './screens/addCustomer';
import DrawerMenuCustomer from './components/DrawerMenuCustomer';
import seeCustomer from './screens/seeCustomer';
import DailyReport from './screens/dailyReport';

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

  if (loading) return null; // or show splash/loading

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
              <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
              <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
            </>
          )}
          {/* Common screens */}
          <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="addArea" component={AreaScreen} />
          <Stack.Screen name="ManageEmployees" component={AddEmployee} />
          <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
          <Stack.Screen name="addCustomer" component={AddCustomer} />
          <Stack.Screen name="seeCustomer" component={seeCustomer} />
          <Stack.Screen name="DailyReport" component={DailyReport} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
