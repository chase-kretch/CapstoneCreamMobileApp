import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_URL } from '@env';

export const getApiBaseUrl = () => {
    if (Platform.OS === 'web') {
        // Running in browser
        return 'http://localhost:8080/';
    } else if (API_URL) {
        // Running on a real device
        return API_URL;
    } else {
        // Running in an emulator
        return 'http://10.0.2.2:8080/';
    }
};