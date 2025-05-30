// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import OwnerDashboard from './screens/OwnerDashboard';
// import OwnerLogin from './screens/OwnerLogin';
// import OwnerSignup from './screens/OwnerSignup';
// import AssignMilk from './screens/AssignMilk';
// import ReturnMilk from './screens/ReturnMilk';
// import ManageEmployees from './screens/ManageEmployees';
// import ViewReports from './screens/ViewReports';
// import ManageCustomers from './screens/ManageCustomers';
// import ViewCustomers from './screens/ViewCustomers';
// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="OwnerLogin">
//         <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
//         <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
//         <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
//         <Stack.Screen name="AssignMilk" component={AssignMilk} />
//         <Stack.Screen name="ReturnMilk" component={ReturnMilk} />
//         <Stack.Screen name="ManageEmployees" component={ManageEmployees} />
//         <Stack.Screen name="ViewReports" component={ViewReports} />
//         <Stack.Screen name="ManageCustomers" component={ManageCustomers} />
//         <Stack.Screen name="ViewCustomers" component={ViewCustomers} />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerLogin from './screens/OwnerLogin';
import OwnerSignup from './screens/OwnerSignup';
import DrawerMenu from './components/DrawerMenu';
import OwnerDashboard from './screens/OwnerDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="OwnerLogin">
        <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
        <Stack.Screen name="OwnerSignup" component={OwnerSignup} />
        <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
