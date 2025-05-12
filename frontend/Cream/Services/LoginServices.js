import {Platform} from "react-native";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";

export const login = async (credentials) => {
    try {
        const url = getApiBaseUrl() + 'Cream/Users/Login';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Login failed", error);
        return { error: error.message };
    }
};