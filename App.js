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
import OwnerDashboard from './screens/OwnerDashboard';
import HomeScreen from './screens/HomeScreen';

export const AuthContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
          ) : (
            <>
              <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
              <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
            </>
          )}
          <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
