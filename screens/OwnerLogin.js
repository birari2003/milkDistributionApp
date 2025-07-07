// import React, { useState, useRef, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Button,
//   Alert,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AuthContext } from '../App';

// const { width } = Dimensions.get('window');

// export default function LoginScreen({ navigation }) {
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [mobileError, setMobileError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [showPass, setShowPass] = useState(false);
//   const passwordInputRef = useRef(null);

//   const { setRole } = useContext(AuthContext);

//   const validateMobile = (value) => {
//     const trimmed = value.trim();
//     if (!trimmed) return 'Please fill this field';
//     if (!/^[6-9]\d{9}$/.test(trimmed)) return 'Enter a valid Indian mobile number';
//     return '';
//   };

//   const validatePassword = (value) => {
//     if (!value.trim()) return 'Please fill this field';
//     if (
//       !/^.*(?=.{5,})(?=.*[a-z]).*$/.test(
//         value
//       )
//     ) {
//       return 'Password must be 6+ chars, include upper, lower, number & special symbol';
//     }
//     return '';
//   };

//   const handleLogin = async () => {
//     setSuccessMsg('');

//     const mobileValidation = validateMobile(mobile);
//     const passwordValidation = validatePassword(password);

//     setMobileError(mobileValidation);
//     setPasswordError(passwordValidation);

//     if (mobileValidation || passwordValidation) {
//       if (mobileValidation && passwordInputRef.current) passwordInputRef.current.blur();
//       else if (passwordValidation && passwordInputRef.current) passwordInputRef.current.focus();
//       return;
//     }

//     try {
//       const response = await fetch('http://192.168.43.175:3000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone: mobile, password }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         await AsyncStorage.setItem('token', data.token);
//         await AsyncStorage.setItem('user', JSON.stringify(data.user));
//         await AsyncStorage.setItem('role', data.role);
//         setRole(data.role);
//         setSuccessMsg('Login successful');
//       } else {
//         Alert.alert('Login Failed', data.message || 'Invalid credentials');
//         alert(data.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.flex}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
//         <View style={styles.container}>
//           <View style={styles.loginCard}>
//             <Text style={styles.loginTitle}>LOGIN</Text>
//             <Text style={styles.loginSubtitle}>Sign in to your account</Text>
//             <TextInput
//               style={[styles.input, mobileError ? styles.inputError : null]}
//               placeholder="Mobile No."
//               value={mobile}
//               onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
//               keyboardType="phone-pad"
//               maxLength={10}
//               autoCapitalize="none"
//               returnKeyType="next"
//               onSubmitEditing={() => passwordInputRef.current?.focus()}
//             />
//             {mobileError ? <Text style={styles.errorMessage}>{mobileError}</Text> : null}

//             <View style={styles.passwordRow}>
//               <TextInput
//                 ref={passwordInputRef}
//                 style={[styles.inputPassword, passwordError ? styles.inputError : null]}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPass}
//                 returnKeyType="done"
//                 onSubmitEditing={handleLogin}
//               />
//               <TouchableOpacity
//                 style={styles.eyeIcon}
//                 onPress={() => setShowPass((prev) => !prev)}
//                 activeOpacity={0.6}
//               >
//                 <MaterialIcons
//                   name={showPass ? 'visibility' : 'visibility-off'}
//                   size={20}
//                   color="#8b5cf6"
//                 />
//               </TouchableOpacity>
//             </View>
//             {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

//             <Button title="Login" onPress={handleLogin} />

//             <TouchableOpacity>
//               <Text style={styles.forgetText}>Forgot password?</Text>
//             </TouchableOpacity>
//             {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }
// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     // height: '100%',
//     // minHeight: height,
//     minWidth: width,
//   },
//   imageStyle: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   flex: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     // minHeight: height,
//   },
//   loginCard: {
//     backgroundColor: 'rgba(255,255,255,0.93)',
//     borderRadius: 18,
//     width: width > 400 ? 360 : '90%',
//     paddingTop: 36,
//     paddingBottom: 28,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     shadowColor: '#03c9ec',
//     shadowOffset: { width: 10, height: 10 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 8,
//     marginTop: -100,
//   },
//   loginTitle: {
//     fontSize: 21,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: 'black',
//   },
//   loginSubtitle: {
//     fontSize: 16,
//     color: '#22c55e', // green
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#e0e6ed',
//     borderRadius: 8,
//     fontSize: 16,
//     backgroundColor: '#f7fafd',
//     color: '#222',
//   },
//   inputPassword: {
//     flex: 1,
//     fontSize: 16,
//     color: "#222",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: "#f7fafd",
//   },
//   passwordRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f7fafd",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e0e6ed",
//     width: "100%",
//     marginBottom: 8,
//     paddingRight: 6,
//   },
//   eyeIcon: {
//     padding: 3,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // height: '100%',
//   },
//   inputError: {
//     borderColor: '#ef4444',
//     borderWidth: 2,
//   },
//   button: {
//     width: '100%',
//     padding: 12,
//     backgroundColor: '#2563eb',
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '500',
//   },
//   forgetText: {
//     color: '#ef4444',
//     fontWeight: '700',
//     marginBottom: 10,
//     marginTop: 14,
//     fontSize: 15,
//     textAlign: 'center',
//   },
//   signupText: {
//     color: '#222',
//     fontSize: 15,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   signupLink: {
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   errorMessage: {
//     color: '#ef4444',
//     fontSize: 14,
//     marginBottom: 8,
//     marginTop: -8,
//   },
//   successMsg: {
//     color: '#22c55e',
//     fontSize: 15,
//     marginTop: 12,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   }
// });






import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Button,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../App';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const passwordInputRef = useRef(null);

  const { setRole } = useContext(AuthContext);

  const validateMobile = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please fill this field';
    if (!/^[6-9]\d{9}$/.test(trimmed)) return 'Enter a valid Indian mobile number';
    return '';
  };

  const validatePassword = (value) => {
    if (!value.trim()) return 'Please fill this field';
    if (!/^.*(?=.{5,})(?=.*[a-z]).*$/.test(value)) {
      return 'Password must be 6+ chars, include upper, lower, number & special symbol';
    }
    return '';
  };

  const handleLogin = async () => {
    setSuccessMsg('');

    const mobileValidation = validateMobile(mobile);
    const passwordValidation = validatePassword(password);

    setMobileError(mobileValidation);
    setPasswordError(passwordValidation);

    if (mobileValidation || passwordValidation) {
      if (mobileValidation && passwordInputRef.current) passwordInputRef.current.blur();
      else if (passwordValidation && passwordInputRef.current) passwordInputRef.current.focus();
      return;
    }

    try {
      const response = await fetch('http://192.168.43.175:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, password }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('role', data.role);
        setRole(data.role);
        setSuccessMsg('Login successful');

        if (data.role === 'owner') {
          navigation.navigate('OwnerDashboard'); // or whatever your owner screen is
        } else if (data.role === 'employee') {
          navigation.navigate('EmployeeDashboard', {
            employee_id: data.user.id, // pass the correct employee ID from backend response
          });
        }
      }
      else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../images/login.png')} // ✅ Local image
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.loginCard}>
              <Text style={styles.loginTitle}>LOGIN</Text>
              <Text style={styles.loginSubtitle}>Sign in to your account</Text>

              <TextInput
                style={[styles.input, mobileError ? styles.inputError : null]}
                placeholder="Mobile No."
                placeholderTextColor="#555"
                value={mobile}
                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
                maxLength={10}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              {mobileError ? <Text style={styles.errorMessage}>{mobileError}</Text> : null}

              <View style={styles.passwordRow}>
                <TextInput
                  ref={passwordInputRef}
                  style={[styles.inputPassword, passwordError ? styles.inputError : null]}
                  placeholder="Password"
                  placeholderTextColor="#555"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPass((prev) => !prev)}
                  activeOpacity={0.6}
                >
                  <MaterialIcons
                    name={showPass ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

              <Button title="Login" onPress={handleLogin} color="#0ea5e9" />

              <TouchableOpacity>
                <Text style={styles.forgetText}>Forgot password?</Text>
              </TouchableOpacity>
              {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginCard: {
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent card
    borderRadius: 18,
    width: width > 400 ? 360 : '90%',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#fff',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#000',
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    marginBottom: 8,
    paddingRight: 6,
  },
  eyeIcon: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  forgetText: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 14,
    fontSize: 14,
    textAlign: 'center',
  },
  successMsg: {
    color: '#22c55e',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
  },
});
