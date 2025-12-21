import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './src/components/AppProviders';
import TabNavigator from './src/navigation/TabNavigator';
import * as Notifications from 'expo-notifications';
import './global.css';

// Bildirim handler ayarları
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
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

        // Bildirim tıklama olaylarını dinle
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content.data;
            // Bildirimden gelen veriye göre işlem yapılabilir
            // Örneğin: medicationId varsa ilaç ekranına yönlendir
        });

        return () => subscription.remove();
    }, []);

    return (
        <AppProviders>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                <StatusBar style="auto" />
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </SafeAreaView>
        </AppProviders>
    );
};

export default App;

