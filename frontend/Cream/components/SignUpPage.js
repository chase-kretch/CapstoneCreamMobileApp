import 'react-native-get-random-values'; // Needed to make google maps work
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {signUp} from "../Services/SignUpServices";
import {login} from "../Services/LoginServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInput from '../Helpers/UserInput';
import Button from '../Helpers/Button';
import DropdownPicker from '../Helpers/DropdownPicker';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {getGoogleMapsApiKey} from "../Helpers/GetGoogleMapsApiKey";
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import { GOOGLE_MAPS_API_KEY } from '@env';


const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;


const EnterNamePage = () => {

  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [location, setLocation] = useState({
    country: "New Zealand",
    city: "Auckland",
    latitude: -36.8485, // default coordinates of Auckland
    longitude: 174.7633,
  });
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const genders = ['Female', 'Male', 'Non-Binary'];


  const enterDetailsHandler = async () => {
    const age = calculateAge(dateOfBirth);

    if (loading || !age) return;

    const validateInput = () => {
      if (phoneNumber === '') {
        Alert.alert('Please enter a phone number', '', [
          {text: 'OK'}
        ])
        return false;
      } 
      if (email === '') {
        Alert.alert('Please enter an email', '', [
          {text: 'OK'}
        ]);
        return false;
      } 
      if (password === '') {
        Alert.alert('Please enter a password', '', [
          {text: 'OK'}
        ]);
        return false;
      } 
      if (password !== passwordAgain) {
        Alert.alert('Your passwords do not match', '', [
          {text: 'OK'}
        ]);
        return false;
      }
      if (!firstName || !lastName) {
        Alert.alert('Please enter your name', '', [{text: 'OK'}]);
        return false;
      }
      if (!dateOfBirth) {
        Alert.alert('Please enter your date of birth', '', [{text: 'OK'}]);
        return false;
      }
      if (age < 18) {
        Alert.alert('Sorry, you\'re too young to sign up', '', [{text: 'OK'}]);
        return false;
      }
      if (age > 130) {
        Alert.alert('Please enter a date of birth less than 130 years ago', '', [{text: 'OK'}]);
        return false;
      }
      if (!gender) {
        Alert.alert('Please enter your gender details', '', [{text: 'OK'}]);
        return false;
      }
      if (!location.latitude || !location.longitude) {
        Alert.alert('Please select your location on the map', '', [{text: 'OK'}]);
        return false;
      }
      return true;
    };

    if (!validateInput()) return;
    

    setLoading(true);

    const credentials = {
      firstName,
      lastName,
      password,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      location,
      bio
    };

    const response = await signUp(credentials);

    if (!response.isSuccess) {
      Alert.alert('Invalid details', response.message, [{text: 'OK'}]);
      setLoading(false);
      return;
    }

    const loginData = await login({email, password});

    const token = loginData.token;
    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
    } else {
      await AsyncStorage.setItem('token', token);
    }

    navigation.navigate("ImageUploadPage", {user: null});
    setLoading(false);
  };


  const loginHandler = () => {
    navigation.navigate("LoginPage")
  }

  const formatPhoneNumber = (text) => {
    const prevLength = phoneNumber.length;
    const newLength = text.length;

    const changeDash = (newLength === 3 || newLength === 7);

    let number = text;

    if (changeDash) {
      if (newLength > prevLength) {
        number += '-';
      } else if (newLength < prevLength) {
        number = text.slice(0, newLength - 1);
      }
    }
    setPhoneNumber(number);
  };


  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const [day, month, year] = dateOfBirth.split('/');
    const birthDate = new Date(`${year}-${month}-${day}`);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatDateOfBirth = (input) => {
    // Remove any non-digit characters
    let value = input.replace(/\D/g, '');

    // Limit to 8 digits
    value = value.slice(0, 8);

    // Only add slashes after the next digit is typed
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    setDateOfBirth(value);
  };


  const validateDetails = () => {
    if (phoneNumber === '') {
      Alert.alert('Please enter a phone number', '', [
        {text: 'OK'}
      ])
    } else if (email === '') {
      Alert.alert('Please enter an email', '', [
        {text: 'OK'}
      ]);
    }
  }

  const validatePassword = () => {
    if (password === '') {
      Alert.alert('Please enter a password', '', [
        {text: 'OK'}
      ]);
    } else if (password !== passwordAgain) {
      Alert.alert('Your passwords do not match', '', [
        {text: 'OK'}
      ]);
    }
  }
  
  const validateYou = () => {
    const age = calculateAge(dateOfBirth);

    if (!dateOfBirth || !age) {
      Alert.alert('Please enter your date of birth', '', [{text: 'OK'}]);
    } else if (age < 18) {
      Alert.alert('Sorry, you\'re too young to sign up', '', [{text: 'OK'}]);
    } else if (age > 130) {
      Alert.alert('Please enter a date of birth less than 130 years ago', '', [{text: 'OK'}]);
    }
  }

  const validateLocation = () => {
    if (!location.latitude || !location.longitude) {
      Alert.alert('Please select your location on the map', '', [{text: 'OK'}]);
    }
  }

  const validateGender = () => {
    if (!gender) {
      Alert.alert('Please enter your gender details', '', [{text: 'OK'}]);
    }
  }


  return (
    <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1, paddingLeft: 30, backgroundColor:'white'}}>
        <ProgressSteps activeStepIconBorderColor={'#ec8094'} activeLabelColor={'#ec8094'} activeStepNumColor={'#ec8094'}
                       completedStepIconColor={'black'} completedProgressBarColor={'black'}
                       completedLabelColor={'black'}
                       borderWidth={1}
                       topOffset={60}
        >

          <ProgressStep label="details."
                        nextBtnTextStyle={{color: '#ec8094'}}
                        onNext={validateDetails}
                        nextBtnDisabled={email === '' || phoneNumber === ''}
                        nextBtnStyle={{position: 'absolute', right: -(screenWidth/10), bottom: -10}}
          >
            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>cream.</Text>
                <Text style={styles.text}>the only dating app that's not trying to scam you.</Text>
              </View>

              <View style={styles.detailsContainer}>
                <UserInput onChangeText={formatPhoneNumber} placeholder='Phone Number' keyboardType='numeric'
                           style={styles.textInput} maxLength={12} value={phoneNumber}/>

                <UserInput onChangeText={setEmail} placeholder='Email Address' keyboardType='email-address'
                           style={styles.textInput} value={email}/>

                <Button style={styles.loginButton} displayText={'Sign In'} textStyle={styles.loginButtonText}
                        onPress={loginHandler}/>
              </View>

            </View>
          </ProgressStep>


          <ProgressStep label="password."
                        nextBtnTextStyle={{color: '#ec8094'}} previousBtnTextStyle={{color: '#ec8094'}}
                        onNext={validatePassword}
                        nextBtnDisabled={password === '' || passwordAgain === ''}
                        nextBtnStyle={{position: 'absolute', right: -(screenWidth/10), bottom: -10}}
                        previousBtnStyle={{position: 'absolute', left: -(screenWidth / 5), bottom: -10}}
                        
          >

            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>cream.</Text>
                <Text style={styles.text}>we keep your secrets private, and our matching algorithms public.</Text>
              </View>

              <View style={styles.detailsContainer}>

                <TextInput
                  style={styles.textInput}
                  secureTextEntry={true}
                  placeholder={'Password'}
                  placeholderTextColor="#000"
                  onChangeText={setPassword}
                  value={password}
                />

                <TextInput
                  style={styles.textInput}
                  secureTextEntry={true}
                  placeholder={'Confirm Password'}
                  placeholderTextColor="#000"
                  onChangeText={setPasswordAgain}
                  value={passwordAgain}
                />

              </View>

            </View>
          </ProgressStep>

          <ProgressStep label="you."
                        nextBtnTextStyle={{color: '#ec8094'}} previousBtnTextStyle={{color: '#ec8094'}}
                        onNext={validateYou}
                        nextBtnDisabled={firstName === '' || lastName === '' || dateOfBirth === ''}
                        nextBtnStyle={{position: 'absolute', right: -(screenWidth/10), bottom: -10}}
                        previousBtnStyle={{position: 'absolute', left: -(screenWidth / 5), bottom: -10}}
          >

            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>cream.</Text>
                <Text style={styles.text}>with no paywalls, our goal is to help <Text
                  style={{textDecorationLine: 'underline'}}>you</Text>, not ourselves.</Text>
              </View>

              <View style={styles.detailsContainer}>
                <UserInput onChangeText={setFirstName} placeholder='First Name' style={styles.textInput} value={firstName}/>
                <UserInput onChangeText={setLastName} placeholder='Last Name' style={styles.textInput} value={lastName}/>
                <TextInput
                  value={dateOfBirth}
                  onChangeText={formatDateOfBirth}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={'black'}
                  keyboardType="numeric"
                  style={styles.textInput}
                  maxLength={10}
                />
              </View>


            </View>

          </ProgressStep>
          <ProgressStep label="location."
                        nextBtnTextStyle={{color: '#ec8094'}} previousBtnTextStyle={{color: '#ec8094'}}
                        onNext={validateLocation}
                        nextBtnStyle={{position: 'absolute', right: -(screenWidth/10), bottom: -10}}
                        previousBtnStyle={{position: 'absolute', left: -(screenWidth / 5), bottom: -10}}
                        scrollable={false}
          >

            <View style={styles.mapsContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>cream.</Text>
                <Text style={styles.text}>get matched with <Text
                  style={{textDecorationLine: 'underline'}}>everyone</Text> you want, no matter where you are.</Text>
              </View>

              <View style={styles.detailsContainer}>
                
                <GooglePlacesAutocomplete
                  placeholder="Search for your address"
                  onPress={(data, details = null) => {
                    const {lat, lng} = details.geometry.location;
                    setLocation({
                      latitude: lat,
                      longitude: lng,
                      country: details.address_components.find(comp => comp.types.includes('country')).long_name,
                      city: details.address_components.find(comp => comp.types.includes('locality')).long_name
                    });
                  }}
                  onFail={(error)=>{console.log(error)}}
                  query={{
                    key: GOOGLE_MAPS_API_KEY, // Replace with your Google API Key
                    language: 'en',
                  }}
                  fetchDetails={true}
                  styles={{
                    textInput: styles.textInput,
                    container: {flex: 0}
                  }}
                />

                <MapView
                  style={styles.map}
                  region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                >
                  <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}}/>
                </MapView>

              </View>

            </View>


          </ProgressStep>

          <ProgressStep label="gender."
                        nextBtnTextStyle={{color: '#ec8094'}} previousBtnTextStyle={{color: '#ec8094'}}
                        finishBtnText={loading ? "Loading..." : "Sign Up"}
                        onSubmit={enterDetailsHandler}
                        nextBtnDisabled={gender === ''}
                        nextBtnStyle={{position: 'absolute', right: -(screenWidth/10), bottom: -10}}
                        previousBtnStyle={{position: 'absolute', left: -(screenWidth / 5), bottom: -10}}
          >

            <View style={styles.container}>
              <View style={styles.textContainer}>
                <Text style={styles.header}>cream.</Text>
                <Text style={styles.text}>if you're looking for love, no matter who you are, we've got your
                  back.</Text>
              </View>

              <View style={styles.detailsContainer}>
                <DropdownPicker placeholder={gender? gender : 'Select Your Gender'} onSelectValue={setGender} pickableValues={genders}/>

              </View>

            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mapsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
    paddingRight: 30,
    height: screenHeight - 200,
  },
  
  
  textContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "bold",
    color: "#ec8094",
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    paddingRight: 30,
    height: screenHeight - 200,
  },
  detailsContainer: {
    width: '100%',
    paddingBottom: 12,
    alignSelf: 'center',
    paddingTop: 32,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 35,
    height: 48,
    marginBottom: 12,
    paddingLeft: 20,
    backgroundColor: 'transparent',
  },
  header: {
    color: '#ec8094',
    fontSize: 60,
    fontWeight: 'bold',
    alignSelf: "center"
  },
  map: {
    width: Dimensions.get('window').width * 0.8,
    alignSelf: 'center',
    height: 200,
    marginBottom: 16,
  },

  loginButton: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent',
    marginTop: 12,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'light',
  },
});

export default EnterNamePage;
