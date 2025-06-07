import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(status === 'true');
    };
    checkLoginStatus();
  }, []);

  const login = async (user) => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('ownerData', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('ownerData');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
