import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
    if (Platform.OS === "web") {
        return localStorage.getItem('token');
    } else {
        return await AsyncStorage.getItem('token');
    }
};