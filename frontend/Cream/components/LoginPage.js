import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from 'expo-linear-gradient';

import { login } from "../Services/LoginServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

import UserInput from '../Helpers/UserInput'
import Button from '../Helpers/Button'

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const signInHandler = async () => {

    if (loading === true) {return}

    setLoading(true)

    if (email === '') {
      Alert.alert('Enter your email to log in', '', [
        { text: 'OK' }
      ]);

    } else if (password === '') {
      Alert.alert('Enter your password to log in', '', [
        { text: 'OK' }
      ]);

    } else {
      try {
        const credentials = { email, password };
        const data = await login(credentials);
        
        if (data) {
          const token = data.token;
          if (Platform.OS === "web") {
            localStorage.setItem('token', token);
          } else {
            await AsyncStorage.setItem('token', token);
          }

          navigation.navigate("AppTabNavigator");

        } else {
          console.log("Login failed", response.statusText);
          Alert.alert('Incorrect Password or Email', 'The password or email you entered is incorrect. Try again.', [
            { text: 'OK' }
          ])
        }
      } catch (error) {
        Alert.alert('Incorrect Password or Email', 'The password or email you entered is incorrect. Try again.', [
          { text: 'OK' }
        ])
        console.error("Login failed", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  }

  const forgotPasswordHandler = () => {

  }

  const createAccountHandler = () => {
    navigation.navigate("SignUpPage")
  }




  return (
    <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>

      <LinearGradient
        colors={['#ec8094', '#fefefe']}
        style={styles.container}
      >

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={32}
        >
          <Text style={styles.header}>cream.</Text>

          {/* Container to hold all login components */}
          <View style={styles.loginContainer}>

            {/* 
          Input area for phone number, changes phoneNumber const so that when signIn button is clicked the phone number can be accessed 
          Using UserInput component
          */}
            <UserInput onChangeText={setEmail} placeholder='Email Address' keyboardType='email-address' style={styles.textInput} />

            {/* Similar to phone number input, but for password */}
            <UserInput onChangeText={setPassword} placeholder='Password' style={styles.textInput} isSecureTextEntry={true}/>

            {/* Sign in button, calls function signInHandler */}
            <Button style={styles.signInButton} displayText={loading ? 'Loading...' : 'Sign In'} textStyle={styles.signInButtonText} onPress={signInHandler} />

            {/* Forgot Password Button, calls function forgotPasswordHandler */}
            {/*<Button style={styles.forgotPasswordButton} displayText='Forgot Password?' textStyle={styles.forgotPasswordButtonText} onPress={forgotPasswordHandler} />*/}

            <Button style={styles.createAccountButton} displayText='Create New Account' textStyle={styles.forgotPasswordButtonText} onPress={createAccountHandler} />

          </View>

        </KeyboardAvoidingView>

      </LinearGradient>

    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flex: 2,
    color: '#FFF',
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 100,
  },
  loginContainer: {
    width: '80%',
    justifyContent: 'flex-end',
    paddingBottom: 32
  },
  textInput: {
    borderBottomWidth: 4,
    borderBottomColor: 'black',
    height: 40,
    marginBottom: 4,
  },
  signInButton: {
    backgroundColor: 'black',
    borderRadius: 35,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  forgotPasswordButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent',
    marginTop: 10,
    alignSelf: 'center'
  },
  forgotPasswordButtonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'light',
  },
  createAccountButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent',
    marginTop: 16,
    alignSelf: 'center'
  },
});

export default LoginPage;
