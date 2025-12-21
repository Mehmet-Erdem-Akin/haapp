import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MedicationProvider } from './src/context/MedicationContext';
import HomeScreen from './src/screens/HomeScreen';
import * as Notifications from 'expo-notifications';

// Bildirim handler ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App: React.FC = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  useEffect(() => {
    // Bildirim izinlerini kontrol et ve iste
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Bildirim izni verilmedi! İlaç hatırlatmaları çalışmayabilir.');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <MedicationProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <HomeScreen />
      </SafeAreaView>
    </MedicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;

