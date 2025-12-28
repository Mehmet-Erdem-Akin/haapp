import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { WaterIcons } from '../../utils/icons';

interface CircularProgressProps {
  percentage: number;
  totalToday: number;
  dailyGoal: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  totalToday,
  dailyGoal,
}) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
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
            <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Content */}
        <View className="items-center justify-center">
          <View className="mb-2">
            <WaterIcons.Drop size={32} color="#3B82F6" />
          </View>
          <Text className="text-4xl font-bold text-gray-900 mb-1">{totalToday}</Text>
          <Text className="text-base text-gray-500">/ {dailyGoal} ml</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-2">{Math.round(percentage)}%</Text>
          <Text className="text-sm text-gray-500 mt-1 text-center">
            {percentage >= 100 ? 'Günlük hedefinizin tamamlandı' : 'Günlük hedefiniz'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CircularProgress;

