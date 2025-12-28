import React from 'react';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

// Tab Icons
export const TabIcons = {
  Medication: ({ size = 24, color = '#002BE0' }: IconProps) => (
    <MaterialIcons name="medication" size={size} color={color} />
  ),
  Water: ({ size = 24, color = '#002BE0' }: IconProps) => (
    <MaterialIcons name="local-drink" size={size} color={color} />
  ),
  Daily: ({ size = 24, color = '#002BE0' }: IconProps) => (
    <MaterialIcons name="bar-chart" size={size} color={color} />
  ),
};

// Action Icons
export const ActionIcons = {
  Add: ({ size = 24, color = '#FFFFFF' }: IconProps) => (
    <Ionicons name="add" size={size} color={color} />
  ),
  Edit: ({ size = 20, color = '#6B7280' }: IconProps) => (
    <MaterialIcons name="edit" size={size} color={color} />
  ),
  Delete: ({ size = 20, color = '#EF4444' }: IconProps) => (
    <MaterialIcons name="delete" size={size} color={color} />
  ),
  Check: ({ size = 20, color = '#FFFFFF' }: IconProps) => (
    <Ionicons name="checkmark" size={size} color={color} />
  ),
  CheckCircle: ({ size = 20, color = '#10B981' }: IconProps) => (
    <Ionicons name="checkmark-circle" size={size} color={color} />
  ),
  Time: ({ size = 16, color = '#6B7280' }: IconProps) => (
    <MaterialIcons name="access-time" size={size} color={color} />
  ),
  Download: ({ size = 16, color = '#FFFFFF' }: IconProps) => (
    <MaterialIcons name="download" size={size} color={color} />
  ),
  Cancel: ({ size = 20, color = '#EF4444' }: IconProps) => (
    <MaterialIcons name="cancel" size={size} color={color} />
  ),
  Hourglass: ({ size = 20, color = '#F59E0B' }: IconProps) => (
    <MaterialIcons name="hourglass-empty" size={size} color={color} />
  ),
};

// Status Icons
export const StatusIcons = {
  Success: ({ size = 20, color = '#10B981' }: IconProps) => (
    <Ionicons name="checkmark-circle" size={size} color={color} />
  ),
  Error: ({ size = 20, color = '#EF4444' }: IconProps) => (
    <MaterialIcons name="error" size={size} color={color} />
  ),
  Warning: ({ size = 20, color = '#F59E0B' }: IconProps) => (
    <MaterialIcons name="warning" size={size} color={color} />
  ),
};

// Water Icons
export const WaterIcons = {
  Drop: ({ size = 24, color = '#002BE0' }: IconProps) => (
    <MaterialIcons name="local-drink" size={size} color={color} />
  ),
};

