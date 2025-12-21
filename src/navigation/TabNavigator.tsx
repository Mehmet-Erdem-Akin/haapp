import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedicationsScreen from '../screens/MedicationsScreen';
import WaterScreen from '../screens/WaterScreen';
import DailyScreen from '../screens/DailyScreen';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{
          tabBarLabel: 'İlaçlar',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>💊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Water"
        component={WaterScreen}
        options={{
          tabBarLabel: 'Su',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>💧</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Daily"
        component={DailyScreen}
        options={{
          tabBarLabel: 'Günlük',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }}>📊</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

