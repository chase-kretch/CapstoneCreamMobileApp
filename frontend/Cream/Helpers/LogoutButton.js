import React, {useState} from 'react'
import {TouchableOpacity, Text, StyleSheet, Platform, Dimensions} from 'react-native'
import {MaterialIcons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screen = Dimensions.get("screen");
const LogoutButton = ({ style, onPress}) => {
    const [screenDimensions, setScreenDimensions] = useState({
        screen: screen
    })
    
    const navigation = useNavigation();
    const resetToken = async () => {
        if (Platform.OS === "web") {
            localStorage.setItem('token', '');
        } else {
            await AsyncStorage.setItem('token', '');
        }
    };
    return (
        <TouchableOpacity onPress={() => {resetToken()
            navigation.navigate('LoginPage')}}
                          style= {styles.paperPlaneContainer}>
            <MaterialIcons name="logout" size={30} color="#000" />
        </TouchableOpacity>
    )
}

export default LogoutButton

const styles = StyleSheet.create({
    paperPlaneContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: screen.width*0.13,
        height: screen.height*0.06,
        borderRadius: 25,
        paddingRight: 0,
    },
})