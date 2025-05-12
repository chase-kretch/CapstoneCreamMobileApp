import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";
import {getToken} from "../Helpers/GetToken";

export const getMyInfo = async () => {
    try {
        // Get the token from the appropriate storage based on the platform
        const token = await getToken()

        if (!token) {
            throw new Error("No token found");
        }
        // Using the emulator requires using address 10.0.2.2 (Host machine localhost)
        const url = getApiBaseUrl() + 'Cream/Me';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            const j = await response.json();
            return j.data;
        } else {
            const j = await response.json();
            // Handle HTTP errors
            throw new Error(`HTTP error! Status: ${response.status}, ${j.message}`);
        }
    } catch (error) {
        console.error("Error getting user", error);
        return null;
    }
};