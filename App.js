import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import OwnerLogin from './screens/OwnerLogin';
// import OwnerSignup from './screens/OwnerSignup';
import DrawerMenu from './components/DrawerMenu';
import OwnerDashboard from './screens/OwnerDashboard';
import HomeScreen from './screens/HomeScreen';

export const AuthContext = createContext();

import AddEmployee from './screens/sample';

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DrawerMenu">
        {/* <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
        <Stack.Screen name="OwnerSignup" component={OwnerSignup} /> */}
        <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} /> 

        <Stack.Screen name="AddEmployee" component={AddEmployee} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
