import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import MedicationsScreen from '../screens/MedicationsScreen';
import WaterScreen from '../screens/WaterScreen';
import DailyScreen from '../screens/DailyScreen';
import { TabIcons } from '../utils/icons';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#002BE0',
                tabBarInactiveTintColor: '#D4AEFF',
                tabBarStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255, 255, 255, 0.5)',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarBackground: () => (
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                ),
            }}
        >
            <Tab.Screen
                name="Medications"
                component={MedicationsScreen}
                options={{
                    tabBarLabel: 'İlaçlar',
                    tabBarIcon: ({ color }) => (
                        <TabIcons.Medication size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Water"
                component={WaterScreen}
                options={{
                    tabBarLabel: 'Su',
                    tabBarIcon: ({ color }) => (
                        <TabIcons.Water size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Daily"
                component={DailyScreen}
                options={{
                    tabBarLabel: 'Günlük',
                    tabBarIcon: ({ color }) => (
                        <TabIcons.Daily size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;

