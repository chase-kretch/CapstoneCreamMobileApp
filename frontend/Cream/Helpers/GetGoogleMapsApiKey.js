import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '@env';

export const getGoogleMapsApiKey = () => {
    return GOOGLE_MAPS_API_KEY;
};