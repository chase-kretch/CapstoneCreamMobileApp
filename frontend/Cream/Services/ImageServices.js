import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";

export const uploadImages = async (imageFormData, token) => {
  try {
    
    const url = getApiBaseUrl() + "Cream/Me/Photos/Gallery"
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      body: imageFormData,
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Image upload failed", error);
    throw new Error(`Image upload failed, status: ${response.status}`, {cause: error});
  }
};

export const uploadProfileImage = async (imageFormData, token) => {
  try {

    const url = getApiBaseUrl() + "Cream/Me/Photos/ProfilePicture"
    

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      body: imageFormData,
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Image upload failed", error);
    throw new Error(`Image upload failed, status: ${response.status}`, {cause: error});
  }
};

export const deleteImage = async (photoId, token) => {
  try {

    const url = getApiBaseUrl() + `Cream/Me/Photos/Gallery/${photoId}`
    

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Image deletion failed", error);
    throw new Error(`Image deletion failed, status: ${response.status}`, {cause: error});
  }
};