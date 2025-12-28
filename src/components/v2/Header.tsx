import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconGradient?: string[];
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  iconGradient = ['#3B82F6', '#06B6D4'],
  rightAction,
}) => {
  return (
    <View
      className="bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <LinearGradient
            colors={iconGradient as [string, string]}
            style={{ width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
          >
            {icon}
          </LinearGradient>
          <View>
            <Text className="font-bold text-gray-900 text-lg">{title}</Text>
            {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
          </View>
        </View>
        {rightAction && rightAction}
      </View>
    </View>
  );
};

export default Header;


