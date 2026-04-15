// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const role = await AsyncStorage.getItem('role');
      const email = await AsyncStorage.getItem('email');
      const name = await AsyncStorage.getItem('name');

      if (token && userId) {
        setUser({ token, userId, role, email, name });
      }
    } catch (error) {
      console.log('Load user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ token, userId, role, email, name }) => {
    try {
      await AsyncStorage.multiSet([
        ['token', token],
        ['userId', userId],
        ['role', role || 'user'],
        ['email', email || ''],
        ['name', name || ''],
      ]);
      setUser({ token, userId, role: role || 'user', email, name });
    } catch (error) {
      console.log('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId', 'role', 'email', 'name']);
      setUser(null);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
