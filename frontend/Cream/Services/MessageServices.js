import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import {getToken} from "../Helpers/GetToken";
import { getMyInfo } from '../Services/ProfileServices';

import { getApiBaseUrl } from "../Helpers/GetApiBaseUrl";

export const getUsersForMessages = async () => {
    try {
        // Get the token from the appropriate storage based on the platform
        const token = Platform.OS === "web"
            ? localStorage.getItem('token')
            : await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error("No token found");
        }

        const url = getApiBaseUrl() + 'Cream/Me/Matches?pageNumber=1&pageSize=10000000';

        console.log("URL:: ",url);

        // const url = Platform.OS === "web"
        //     ? `${getApiBaseUrl()}/Cream/Me/Matches?pageNumber=1&pageSize=10000000`
        //     : `${getApiBaseUrl()}/Cream/Me/Matches?pageNumber=1&pageSize=10000000`;

            // ? http://localhost:8080/Cream/Users
            // : http://10.0.2.2:8080/Cream/Users;

            // ? `http://localhost:8080/Cream/Me/Matches?pageNumber=1&pageSize=10000000`
            // : `http://10.0.2.2:8080/Cream/Me/Matches?pageNumber=1&pageSize=10000000`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the response to see if the data is being fetched
        console.log("Response Status:", response.status);

        if (response.ok) {
            const users = await response.json();
            console.log("Fetched Users:", users.data);  // Add log to see the actual data

            return users.data;  // Assuming your API returns a "data" object with users
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.log("Error fetching users for messages", error);
        return [];
    }
};

export const fetchLoggedInUserId = async () => {
    try {
        const token = await getToken();
        if (!token) {
            console.error("Token not found");
            return null;
        }

        const response = await fetch("http://localhost:8080/Cream/Messages/GetLoggedIn", {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': `Bearer ${token}`,
            }
        });

        console.log("eeeee", await response.text())

        if (response.ok) {
            const userIdText = await response.text(); // Parse the response as plain text
            const userId = parseInt(userIdText, 10); // Convert the text to an integer
            console.log("Logged-in User ID:", userId);
            return userId;
        } else {
            console.log("Failed to fetch logged-in user ID. Status:", response.status);
            return null;
        }
    } catch (error) {
        console.log("Error fetching logged-in user ID:", error);
        return null;
    }
};