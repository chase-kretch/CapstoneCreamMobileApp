import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView
} from 'react-native';
import {useIsFocused, useNavigation} from "@react-navigation/native";

import {
  addGender,
  addHobby,
  changeAgePreferences,
  changeBio,
  changeDistancePreferences, deleteGender,
  deleteHobby
} from "../Services/EditProfileServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../Helpers/Button";
import {MaterialIcons} from "@expo/vector-icons";
import {Slider} from "react-native-awesome-slider";
import {useSharedValue} from 'react-native-reanimated';
import Ionicons from "@expo/vector-icons/Ionicons";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get("window").width;
const SettingsPage = ({route}) => {
  const user = route.params.user;
  const isFocused = useIsFocused()

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [preferMale, setPreferMale] = useState(false);
  const [preferFemale, setPreferFemale] = useState(false);
  const [preferNonBinary, setPreferNonBinary] = useState(false);

  const max = useSharedValue(100);

  const minAllowedAge = useSharedValue(18);
  const minPreferredAge = useSharedValue(user?.minAge ? user.minAge : 18);
  const maxPreferredAge = useSharedValue(user?.maxAge ? user.maxAge : 100);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);

  const [hobbies, setHobbies] = useState(user?.hobbies ? user.hobbies.map(item => ({
    name: item.name,
    key: item.id,
    dbID: item.id
  })) : []);
  const [currentHobby, setCurrentHobby] = useState('');
  const [deletedHobbies, setDeletedHobbies] = useState([]);

  const [distance, setDistance] = useState(user?.maxDistanceKilometers ? user.maxDistanceKilometers : 100);
  const distanceSV = useSharedValue(user?.maxDistanceKilometers ? user.maxDistanceKilometers : 100);
  const minDist = useSharedValue(10);

  const [bio, setBio] = useState(user?.bio ? user.bio : '');


  useEffect(() => {

    if (user !== null && isFocused) {

      const userGenderPreferences = user.genderPreferences.map(item => item.gender);

      setPreferMale(userGenderPreferences.includes("Male"));
      setPreferFemale(userGenderPreferences.includes("Female"));
      setPreferNonBinary(userGenderPreferences.includes("NonBinary"));

      setHobbies(user.hobbies ? user.hobbies.map(item => ({
        name: item.name,
        key: item.id,
        dbID: item.id
      })) : [])

      setBio(user.bio ? user.bio : '');

      setMinAge(user.minAge ? user.minAge : 18);
      setMaxAge(user.maxAge ? user.maxAge : 100);
    }
    setLoading(false);
  }, [isFocused]);


  const saveSettingsHandler = async () => {
    setLoading(true)
    if (minAge > maxAge) {
      Alert.alert('Invalid age range.', 'Please choose a minimum preferred age lower than your maximum preferred age.', [
        {text: 'OK'}
      ])
    } else if (!preferMale && !preferFemale && !preferNonBinary) {
      Alert.alert('Please select a preferred gender.', '', [
        {text: 'OK'}
      ])
    } else if (!hobbies || hobbies.length === 0) {
      Alert.alert('Please add a hobby.', '', [
        {text: 'OK'}
      ])
    } else if (bio.length === 0) {
      Alert.alert('Please add a bio.', '', [
        {text: 'OK'}
      ])
    } else {
      let currentProcess = "getting token"

      try {
        const token = Platform.OS === "web"
          ? localStorage.getItem('token')
          : await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error("No token found");
        }

        currentProcess = "setting gender preferences"
        if (user !== null) {
          for (const gender of user.genderPreferences) {
            const response = await deleteGender(gender.gender, token)
          }
        }
        if (preferMale) {
          const response = await addGender("Male", token);
        }
        if (preferFemale) {
          const response = await addGender("Female", token);
        }
        if (preferNonBinary) {
          const response = await addGender("NonBinary", token);
          
        }

        currentProcess = "setting age preferences"
        if (user === null || minAge !== user.minAge || maxAge !== user.maxAge) {
          const response = await changeAgePreferences({minAge: minAge, maxAge: maxAge}, token)
        }

        currentProcess = "setting max distance"
        if (user === null || distance !== user.distance) {
          const response = await changeDistancePreferences({maxKm: distance}, token)
        }

        currentProcess = "setting hobbies"
        if (user === null || hobbies !== user.hobbies) {
          for (const hobby of hobbies) {
            if (hobby.dbID === null) {
              const response = await addHobby({name: hobby.name}, token)
            }
          }
          for (const key of deletedHobbies) {
            const response = await deleteHobby(key, token)
          }
        }

        currentProcess = "setting bio"
        if (user === null || bio !== user.bio) {
          const response = await changeBio(bio, token);
        }

        navigation.navigate("AppTabNavigator", {initialRoute: 'MyProfilePage'})

      } catch (error) {
        Alert.alert('Error saving settings', `Error while ${currentProcess}\n${error.message}`, [
          {text: 'OK'}
        ]);
      }
    }
    setLoading(false)
  }

  const addHobbyHandler = () => {
    if (hobbies) {
      setHobbies((prev) => ([...prev, {name: currentHobby.trim(), key: Math.random().toString(), dbID: null}]))
    } else {
      setHobbies([{name: currentHobby.trim(), key: Math.random().toString(), dbID: null}]);
    }
    setCurrentHobby('')
  }

  const deleteHobbyHandler = (key) => {
    setDeletedHobbies((prev) => ([...prev, key]))
    setHobbies(hobbies.filter((item) => item.key !== key))
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? screenHeight * -0.3 : -100}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          {user?.hobbies && user.hobbies.length > 0 ? (
              <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={30} color="#000" />
              </TouchableOpacity>
          ) : (<View style = {styles.blankContainer}></View>)}
  
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>settings</Text>
          </View>
          <View style = {styles.blankContainer}></View>
        </View>
  
        <View style={{justifyContent: 'space-between', flex: 1, width: '100%', alignItems: 'center'}}>
          <ScrollView showsVerticalScrollIndicator={true} style={styles.detailsContainer} contentContainerStyle={{
            justifyContent: 'flex-end',
            paddingBottom: 32,
            paddingHorizontal: 8,
          }}>
            <View style={{marginBottom: 24}}>
  
              <View style={styles.genderPreferenceContainer}>
                <Button displayText={"Female"}
                        style={preferFemale ? styles.genderPreferenceButtonOn : styles.genderPreferenceButtonOff}
                        textStyle={preferFemale ? styles.genderPreferenceTextOn : styles.genderPreferenceTextOff}
                        onPress={() => {
                          preferFemale ? setPreferFemale(false) : setPreferFemale(true)
                        }}
                />
                <Button displayText={"Male"}
                        style={preferMale ? styles.genderPreferenceButtonOn : styles.genderPreferenceButtonOff}
                        textStyle={preferMale ? styles.genderPreferenceTextOn : styles.genderPreferenceTextOff}
                        onPress={() => {
                          preferMale ? setPreferMale(false) : setPreferMale(true)
                        }}
                />
                <Button displayText={"Non-binary"}
                        style={preferNonBinary ? styles.genderPreferenceButtonOn : styles.genderPreferenceButtonOff}
                        textStyle={preferNonBinary ? styles.genderPreferenceTextOn : styles.genderPreferenceTextOff}
                        onPress={() => {
                          preferNonBinary ? setPreferNonBinary(false) : setPreferNonBinary(true)
                        }}
                />
              </View>
  
              <Text style={styles.subText}>Select your gender preferences.</Text>
            </View>
  
            <View style={{marginBottom: 12}}>
              <Slider
                style={{marginBottom: 8}}
                progress={minPreferredAge}
                minimumValue={minAllowedAge}
                maximumValue={max}
                step={82}
                onSlidingComplete={(value) => {
                  setMinAge(value)
  
                }}
                theme={{
                  maximumTrackTintColor: 'black',
                  minimumTrackTintColor: '#ec8094',
                  cacheTrackTintColor: '#333',
                  bubbleBackgroundColor: '#ec8094',
                  heartbeatColor: '#999',
                }}
                markWidth={0}
              />
              <Text style={styles.subText}>Min. preferred age: {minAge}</Text>
            </View>
  
            <View style={{marginBottom: 24}}>
              <Slider
                style={{marginBottom: 8}}
                progress={maxPreferredAge}
                minimumValue={minAllowedAge}
                maximumValue={max}
                step={82}
                onSlidingComplete={(value) => {
                  setMaxAge(value)
                }}
                theme={{
                  maximumTrackTintColor: 'black',
                  minimumTrackTintColor: '#ec8094',
                  cacheTrackTintColor: '#333',
                  bubbleBackgroundColor: '#ec8094',
                }}
                markWidth={0}
              />
              <Text style={styles.subText}>Max. preferred age: {maxAge}</Text>
  
            </View>
  
            <View style={{marginBottom: 24}}>
              <Slider
                style={{marginBottom: 8}}
                progress={distanceSV}
                minimumValue={minDist}
                maximumValue={max}
                step={90}
                onSlidingComplete={(value) => {
                  setDistance(value)
                }}
                theme={{
                  maximumTrackTintColor: 'black',
                  minimumTrackTintColor: '#ec8094',
                  cacheTrackTintColor: '#333',
                  bubbleBackgroundColor: '#ec8094',
                }}
                markWidth={0}
              />
              <Text style={styles.subText}>Max. preferred distance: {distance}km</Text>
  
            </View>
  
  
            <View style={{marginBottom: 24}}>
              <View style={styles.hobbyInput}>
                <TextInput
                  onChangeText={(val) => setCurrentHobby(val)}
                  placeholder='Add a hobby [max. 18 characters]'
                  maxLength={18}
                  value={currentHobby}
                />
                <Button
                  displayText={"Add"}
                  style={styles.addHobbyButton}
                  textStyle={{color: 'white'}}
                  onPress={addHobbyHandler}
                  disabled={currentHobby.length === 0}
                />
              </View>
              <View style={styles.hobbiesContainer}>
                {hobbies && hobbies.length > 0 ? (
                  <FlatList
                    style={{flex: 1}}
                    data={hobbies}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TouchableOpacity onPress={() => {
                        deleteHobbyHandler(item.key)
                      }}>
                        <Text style={styles.hobbies}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text style={{marginLeft: 8}}>No hobbies listed</Text>
                )}
              </View>
  
              <Text style={styles.subText}>Press a hobby to delete it.</Text>
            </View>
  
            <View style={styles.bioContainer}>
              <TextInput
                placeholder='Add a bio [max. 100 characters]'
                maxLength={100}
                multiline={true}
                onChangeText={setBio}
                value={bio}
              />
            </View>
            <Text style={styles.subText}>{100 - bio.length}/100</Text>
  
          </ScrollView>
  
        </View>
  
        <Button style={styles.saveSettings} textStyle={styles.saveSettingsText}
                displayText={loading ? 'Loading...' : 'Save Settings'} onPress={saveSettingsHandler}/>
      </SafeAreaView>
    </KeyboardAvoidingView>

  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  detailsContainer: {
    marginTop: screenHeight * 0.005,
    width: screenWidth * 0.9,
  },
  subText: {
    fontSize: 12,
    color: '#3C3C43',
    marginLeft: 2
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 5,
    height: 48,
    paddingLeft: 8,
  },
  navContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  navButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth*0.11,
    height: screenHeight*0.05,
    borderRadius: 25,
    paddingRight: 0,
  },
  genderPreferenceContainer: {
    zIndex:999,
    borderWidth: 2,
    borderRadius: 5,
    height: 48,
    flexDirection: "row"
  },
  genderPreferenceButtonOn: {
    flex: 1,
    backgroundColor: '#ec8094',
    alignItems: "center",
    justifyContent: "center"
  },
  genderPreferenceButtonOff: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center"
  },
  genderPreferenceTextOn: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderPreferenceTextOff: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hobbyInput: {
    borderWidth: 2,
    borderRadius: 5,
    height: 48,
    marginBottom: 12,
    paddingLeft: 8,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addHobbyButton: {
    borderRadius: 16,
    backgroundColor: '#ec8094',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    marginRight: 8,
  },
  hobbiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    flexWrap: "wrap",
    alignContent: 'center',
    borderWidth: 1,
    paddingVertical: 6,
    borderRadius: 5,
    height: screenHeight *0.05,
  },
  hobbies: {
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderRadius: 14,
    marginRight: 4,
    marginLeft: 4
  },
  bioContainer: {
    width: '100%',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5
  },
  saveSettings: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
    width: screenWidth * 0.6,
    marginBottom: 32,
    justifySelf: 'flex-end'
  },
  saveSettingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ec8094',
    textTransform: 'lowercase',
    marginBottom: screenHeight * 0.005,
  },
  headerContainer: {
    height: screenHeight * 0.07,
    width: screenWidth * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 0: screenHeight * 0.03,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 15,
  },
  blankContainer:{
    width: screenWidth*0.11,
    height: screenHeight*0.05,
  },
});

export default SettingsPage;
