import React, {useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from "./HomePage";
import MessagePage from "./MessagePage"; // Import the MessagePage component
import {Dimensions} from 'react-native';
import MyProfilePage from "./MyProfilePage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import profilePage from "./ProfilePage";
import IndividualMessagePage from "./IndividualMessagePage";
import SettingsPage from "./SettingsPage";

import ActivityNavigator from "./ActivityNavigator";

const Tab = createBottomTabNavigator();

const screen = Dimensions.get("screen");
function CustomTabIcon({ focused, iconName, size }) {
    return (
        <Ionicons
            name={focused ? iconName : `${iconName}-outline`} // Use outlined version if not focused
            size={focused ? size : size * 0.8} // Larger icon when focused
            color={focused ? '#000' : '#333'} // Change color when focused
        />
    );
}

function AppTabNavigator({route}) {
    const [screenDimensions, setScreenDimensions] = useState({
        screen: screen
    })
    const initialRoute = route.params?.initialRoute || 'Home'
    
    return (
        
        <Tab.Navigator
            initialRouteName={initialRoute}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    let size;

                    if (route.name === 'HomePage') {
                        iconName = 'home'; // Home tab icon
                        size = 30;
                    } else if (route.name === 'MyProfilePage') {
                        iconName = 'person-circle'; // Profile tab icon
                        size = 36;
                    } else if (route.name === 'ActivityNavigator'){
                        iconName = 'heart';
                        size = 36
                    }

                    // Use CustomTabIcon for focused state
                    return <CustomTabIcon focused={focused} iconName={iconName} size = {size}/>;
                },
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#000',        
                tabBarInactiveTintColor: '#fff',      
                tabBarActiveBackgroundColor: '#fff', 
                tabBarInactiveBackgroundColor: '#ffffff',
                tabBarStyle: {
                    borderColor: "#fff",
                    height: screen.width * 0.23,
                },
                tabBarItemStyle: {
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="HomePage"
                component={HomePage}
                options={{
                    title: 'Home',
                }}
            />

            <Tab.Screen
                name="ActivityNavigator"
                component={ActivityNavigator}
                options={{
                    title: 'ActivityNavigator',
                }}
            />

            <Tab.Screen
                name="MyProfilePage"
                component={MyProfilePage}
                options={{
                    title: 'MyProfile',
                }}
            />
            
        </Tab.Navigator>
        
    );
}

export default AppTabNavigator;
