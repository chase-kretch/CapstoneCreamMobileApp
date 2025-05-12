import React, {useState} from 'react';
import {StyleSheet, Dimensions, Platform, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import ActivityView from "./ActivityView";
import profilePage from "./ProfilePage";
import {MaterialIcons} from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

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

function ActivityNavigator() {
    const [screenDimensions, setScreenDimensions] = useState({
        screen: screen
    })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center'}}>
            <View style={styles.headerContainer}>
                <View style = {styles.blankContainer}></View>

                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>activity</Text>
                </View>
                <View style = {styles.blankContainer}></View>
            </View>
            <View style = {{flex:1, width: screen.width}}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarShowLabel: true,
                        tabBarActiveTintColor: '#ec8094',
                        tabBarInactiveTintColor: '#000',
                        tabBarActiveBackgroundColor: '#fff',
                        tabBarInactiveBackgroundColor: '#ffffff',
                        tabBarStyle: {
                            borderTopColor: "#000",
                            height: screen.height * 0.06,
                            borderBottomColor: '#000',
                        },
                        tabBarItemStyle: {
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: '#ec8094', // Customize the indicator color if needed
                            elevation: 0, // Remove shadow on Android
                            shadowOpacity: 0, // Remove shadow on iOS
                        },
                        pressColor: 'transparent', // Removes the gray ripple effect when pressing
                        
                       
                    })}
                >
        
                    <Tab.Screen
                        name="LikesReceived"
                        component={ActivityView}
                        options={{
                            title: 'received',
                        }}
                        initialParams={{ endPoint: 'Likes/Received' }}
                    />

                    <Tab.Screen
                        name="Matches"
                        component={ActivityView}
                        options={{
                            title: 'matches',
                        }}
                        initialParams={{ endPoint: 'Matches' }}
                    />
        
                    <Tab.Screen
                        name="LikesGiven"
                        component={ActivityView}
                        options={{
                            title: 'given',
                        }}
                        initialParams={{ endPoint: 'Likes/Given' }}
                    />
                    
                    {/*<Tab.Screen
                        name="Candidates"
                        component={ActivityView}
                        options={{
                            title: 'Candidates',
                        }}
                        initialParams={{ endPoint: 'Candidates' }}
                    />*/}
    
                    <Tab.Screen
                        name="Hidden"
                        component={ActivityView}
                        options={{
                            title: 'hidden',
                        }}
                        initialParams={{ endPoint: 'Hidden' }}
                    />
        
                </Tab.Navigator>
            </View>
        </SafeAreaView>
    );
}

export default ActivityNavigator;

const styles = StyleSheet.create({
    headerContainer: {
        height: screen.height * 0.07,
        width: screen.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 0: screen.height * 0.03,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    blankContainer:{
        width: screen.width*0.11,
        height: screen.height*0.05,
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#ec8094',
        textTransform: 'lowercase',
        marginBottom: screen.height * 0.005,
    },
})