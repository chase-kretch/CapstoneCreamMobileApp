import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";
import {getToken} from "../Helpers/GetToken";

export const getUsers = async (page, randomizationToken) => {
    try {
        // Get the token from the appropriate storage based on the platform
        const token = await getToken()
        if (!token) {
            throw new Error("No token found");
        }
        
        let query = page ? `?page=${page}` : '';
        // Using the emulator requires using address 10.0.2.2 (Host machine localhost)
        const url = getApiBaseUrl() + 'Cream/Me/Candidates' + query + `&randomizationToken=${randomizationToken}`;
        //console.log(url);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const j = await response.json();
            return j;
        } else if (response.status === 404) {
            return response.status;
        }else {
            // Handle HTTP errors
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error getting users", error);
        return null;
    }
};

export const getUser = async (id) => {
    try {
        // Get the token from the appropriate storage based on the platform
        const token = Platform.OS === "web"
            ? localStorage.getItem('token')
            : await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error("No token found");
        }
        // Using the emulator requires using address 10.0.2.2 (Host machine localhost)
        const url = getApiBaseUrl() + `Cream/Users/${id}`;

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
            // Handle HTTP errors
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error getting user", error);
        return null;
    }
};