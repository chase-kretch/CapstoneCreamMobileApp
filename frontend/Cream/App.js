import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from "react-native-gesture-handler";

import LoginPage from './components/LoginPage';

import SignUpPage from './components/SignUpPage';
import ImageUploadPage from "./components/ImageUploadPage"
import AppTabNavigator from "./components/AppTabNavigator";
import SettingsPage from "./components/SettingsPage";
import MyProfilePage from "./components/MyProfilePage";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import MessagePage from "./components/MessagePage";
import IndividualMessagePage from "./components/IndividualMessagePage";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    //{/*Container allows for navigation between different pages of the app*/}
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {/* Stack navigator means the pages function in a stack style, e.g. navigating to a new page pushes the page onto the stack, going back pops the most recent page off the stack and renders the one beneath. The initial page on the stack is the LoginPage */}
        <Stack.Navigator initialRouteName="LoginPage">
          {/* Links the LoginPage component to its name, default header is removed */}
          <Stack.Screen name="AppTabNavigator" component={AppTabNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown: false}}/>
          <Stack.Screen name="SignUpPage" component={SignUpPage} options={{headerShown: false}}/>
          <Stack.Screen name="ImageUploadPage" component={ImageUploadPage} options={{headerShown: false}}/>
          <Stack.Screen name="SettingsPage" component={SettingsPage} options={{headerShown: false}}/>
          <Stack.Screen name="MyProfilePage" component={MyProfilePage} options={{headerShown: false}}/>
          <Stack.Screen name="ProfilePage" component={ProfilePage} options={{headerShown: false}}/>
          <Stack.Screen name="HomePage" component={HomePage} options={{headerShown: false}}/>
          <Stack.Screen name="MessagePage" component={MessagePage} options={{headerShown: false}}/>
          <Stack.Screen name="IndividualMessagePage" component={IndividualMessagePage} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>


  );
}