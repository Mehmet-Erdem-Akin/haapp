import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { ActionIcons } from '../../utils/icons';

interface WaterGoalModalProps {
  visible: boolean;
  currentGoal: number;
  onClose: () => void;
  onSave: (goal: number) => Promise<void>;
}

const WaterGoalModal: React.FC<WaterGoalModalProps> = ({
  visible,
  currentGoal,
  onClose,
  onSave,
}) => {
  const [goal, setGoal] = useState(currentGoal.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const goalNumber = parseInt(goal, 10);
    
    if (isNaN(goalNumber) || goalNumber <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir hedef girin (0\'dan büyük bir sayı).');
      return;
    }

    if (goalNumber > 10000) {
      Alert.alert('Hata', 'Hedef 10000ml\'den fazla olamaz.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(goalNumber);
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Hedef kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const quickGoals = [1500, 2000, 2500, 3000, 3500, 4000];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">Günlük Su Hedefi</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full items-center justify-center bg-gray-100"
              activeOpacity={0.7}
            >
              <ActionIcons.Cancel size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-600 mb-4">
            Günlük su içme hedefinizi ml cinsinden girin
          </Text>

          <TextInput
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
            placeholder="Örn: 2500"
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 mb-4"
            style={{ fontSize: 18 }}
            autoFocus
          />

          <Text className="text-xs text-gray-500 mb-3">Hızlı Seçim:</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {quickGoals.map((quickGoal) => (
              <TouchableOpacity
                key={quickGoal}
                onPress={() => setGoal(quickGoal.toString())}
                className={`px-4 py-2 rounded-xl border ${
                  goal === quickGoal.toString()
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-semibold ${
                    goal === quickGoal.toString()
                      ? 'text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  {quickGoal}ml
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-semibold">İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-blue-600 items-center"
              activeOpacity={0.7}
              style={{ opacity: isSaving ? 0.5 : 1 }}
            >
              <Text className="text-white font-semibold">
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WaterGoalModal;

