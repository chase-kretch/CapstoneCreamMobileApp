import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import platform from "react-native-web/src/exports/Platform";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";


export const addGender = async (gender, token) => {
  try {
    
    const url = getApiBaseUrl() + `Cream/Me/Preferences/Gender?gender=${gender}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(gender),
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Adding gender failed", error);
    throw new Error(`Adding gender failed, status: ${response.status}`, {cause: error});
  }
};

export const deleteGender = async (gender, token) => {
  try {
    
    const url = getApiBaseUrl() + `Cream/Me/Preferences/Gender/${gender}`

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
    console.error("Deleting gender failed", error);
    throw new Error(`Deleting gender failed, status: ${response.status}`, {cause: error});
  }
};
export const addHobby = async (hobby, token) => {
  try {

    const url = getApiBaseUrl() + `Cream/Me/Hobbies`
    


    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(hobby),
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Adding hobby failed", error);
    throw new Error(`Adding hobby failed, status: ${response.status}`, {cause: error});
  }
};

export const deleteHobby = async (id, token) => {
  try {

    const url = getApiBaseUrl() + `Cream/Me/Hobbies/${id}`
    
    
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
    console.error("Deleting hobby failed", error);
    throw new Error(`Deleting hobby failed, status: ${response.status}`, {cause: error});
  }
};

export const changeBio = async (bio, token) => {
  try {


    const url = getApiBaseUrl() + `Cream/Me/Bio?bio=${encodeURIComponent(bio)}`
    
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bio),
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Setting bio failed", error);
    throw new Error(`Setting bio failed, status: ${response.status}`, {cause: error});
  }
};

export const changeAgePreferences = async (ages, token) => {
  try {

    const url = getApiBaseUrl() + `Cream/Me/Preferences/Age`
    

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(ages),
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Changing ages preferences failed", error);
    throw new Error(`Changing ages preferences failed, status: ${response.status}`, {cause: error});
  }
};

export const changeDistancePreferences = async (distance, token) => {
  try {

    const url = getApiBaseUrl() + `Cream/Me/Preferences/Distance`
    

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(distance),
    });

    try {
      return response.json();
    } catch (error) {
      console.error("Error parsing JSON", error);
      throw new Error(`Error parsing JSON, status: ${response.status}`, {cause: error})
    }
  } catch (error) {
    console.error("Changing distance preferences failed", error);
    throw new Error(`Changing distance preferences failed, status: ${response.status}`, {cause: error});
  }
};