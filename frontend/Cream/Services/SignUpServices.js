import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";

export const signUp = async (credentials) => {
  const url = getApiBaseUrl() + 'Cream/Users/Register';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  
  return await response.json();
}