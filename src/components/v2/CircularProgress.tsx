import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { ReactNode } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface CircularProgressProps {
  percentage: number;
  totalToday: number;
  total: number;
  icon: ReactNode;
  unit?: string;
  gradientColors?: [string, string];
  onPress?: () => void;
  successMessage?: string;
  defaultMessage?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  totalToday,
  total,
  icon,
  unit = '',
  gradientColors = ['#3B82F6', '#06B6D4'],
  onPress,
  successMessage = 'Günlük hedefinizin tamamlandı',
  defaultMessage = 'Günlük hedefiniz',
}) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gradientId = `progressGradient-${Math.random().toString(36).substr(2, 9)}`;

  const content = (
    <View className="items-center justify-center mb-6">
      <View className="relative items-center justify-center" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>

        {/* Progress Circle */}
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Defs>
            <SvgLinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
              <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Content */}
        <View className="items-center justify-center">
          <View className="mb-2">{icon}</View>
          <Text className="text-4xl font-bold text-gray-900 mb-1">{totalToday}</Text>
          <Text className="text-base text-gray-500">/ {total} {unit}</Text>
        </View>
      </View>
      
      {/* Alt bilgiler - Yüzde ve hedef durumu */}
      <View className="items-center mt-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</Text>
          {onPress && (
            <MaterialIcons name="edit" size={18} color="#6B7280" />
          )}
        </View>
        <Text className="text-sm text-gray-500 mt-1 text-center">
          {percentage >= 100 ? successMessage : defaultMessage}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel="Hedefi ayarla"
        accessibilityRole="button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default CircularProgress;

