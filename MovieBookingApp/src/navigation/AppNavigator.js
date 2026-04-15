// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTabNavigator from './UserTabNavigator';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AddMovieScreen from '../screens/AddMovieScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {isAdmin ? (
        // Admin flow
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AddMovie" component={AddMovieScreen} />
        </>
      ) : (
        // User flow
        <>
          <Stack.Screen name="MainApp" component={UserTabNavigator} />
          <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
          <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen
            name="BookingConfirmation"
            component={BookingConfirmationScreen}
            options={{ gestureEnabled: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
