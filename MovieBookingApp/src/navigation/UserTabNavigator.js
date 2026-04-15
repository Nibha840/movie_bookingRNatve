// src/navigation/UserTabNavigator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, label, focused }) => (
  <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
    <Text style={styles.tabEmoji}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

export default function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎟️" label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 70,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    gap: 2,
    minWidth: 64,
  },
  tabItemFocused: {
    backgroundColor: COLORS.primaryGlow,
  },
  tabEmoji: { fontSize: 20 },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },
  tabLabelFocused: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
});
