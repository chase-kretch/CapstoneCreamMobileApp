import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions, FlatList, SafeAreaView
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {getMyInfo} from "../Services/ProfileServices";
import {ActivityIndicator} from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useIsFocused} from "@react-navigation/native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const pfpOffset = -(screenHeight * 0.65 / 4 * 3 - screenWidth) / 2

const MyProfilePage = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const isFocused = useIsFocused()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getMyInfo();
        setUser(userInfo);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchUserInfo();
    }
  }, [isFocused]);

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  if (loading) {
    return (
      <LinearGradient
        colors={['#ec8094', '#fefefe']}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#ffffff"/>
        <Text style={styles.header}>Loading...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#ec8094', '#fefefe']}
        style={styles.container}
      >
        <Text style={styles.header}>Error loading profile</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </LinearGradient>
    );
  }

  const renderDots = () => {
    return (
        <View style={styles.dotsContainer}>
          {user.photos.map((_, index) => (
              <View
                  key={index}
                  style={[
                    styles.dot,
                    carouselIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
              />
          ))}
        </View>
    );
  };

  return (
    <LinearGradient
      colors={['#ec8094', '#fefefe']}
      style={styles.container}
    >

      <View style={styles.carouselContainer}>
        <Carousel
          loop={false}
          width={screenHeight * 0.65 * 3 / 4}
          height={screenHeight * 0.65}
          data={user.photos}
          scrollAnimationDuration={500}
          onSnapToItem={(index) => setCarouselIndex(index)}
          renderItem={({item}) => (
            <Image source={{uri: item.url}}
                   style={styles.profileImage}
                   onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
            />
          )}
        />
      </View>
      {renderDots()}

      
      {/*<SafeAreaView style={styles.navContainer}>
        <View style = {{flex: 1}}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ec8094"/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>*/}
      
      <SafeAreaView style={styles.imageNavContainer}>
        <View style = {{flex:1}}>
          <TouchableOpacity style={styles.imageNavButton}
                            onPress={() => navigation.navigate("ImageUploadPage", {user: user})}>
            <Ionicons name="images-outline" size={24} color="white"/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      

      <View style={styles.profileContainer}>

        <View style={styles.profileCard}>
          <Text style={styles.nameText}>
            {user.firstName} {user.lastName}, {calculateAge(user.dateOfBirth)}
          </Text>
          <View style={styles.locationContainer}>
            <AntDesign name="enviroment" size={24} color="#ec8094"/>
            <Text style={styles.infoText}> {user.location.city}, {user.location.country}</Text>
          </View>
          <View style={styles.hobbiesContainer}>
            <MaterialIcons name="interests" size={24} color="#ec8094"/>

              {user.hobbies && user.hobbies.length > 0 ? (
                <FlatList
                  style={{flex: 1}}
                  data={user.hobbies}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                      <Text style={styles.hobbies}>{item.name}</Text>
                  )}
                />
              ) : (
                <Text style={{marginLeft: 8}}>No hobbies listed</Text>
              )}
            </View>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider}/>
          </View>
          <Text style={styles.infoText}>
            {user.bio ? (
              <Text>{user.bio}</Text>
            ) : (
              <Text>Press the settings icon to edit profile and add a bio.</Text>
            )}
          </Text>
        </View>
        <TouchableOpacity style={styles.likeButton} onPress={() => navigation.navigate("SettingsPage", {user: user})}>
          <Ionicons name="settings-sharp" size={24} color="#ec8094"/>
          {/*<MaterialIcons name="circle-edit-outline" size={30} color="#ec8094" />*/}

        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
  },
  profileContainer: {
    position: "relative",
    width: "100%",
    height: "35%",
    alignItems: "center",
  },
  profileCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    //borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'left',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ec8094',
    marginBottom: 20,
  },
  nameText: {
    //color: '#ec8094',
    color: '#18191A',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoText: {
    color: '#333',
    fontSize: 16,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
  },
  divider: {
    alignItems: "center",
    width: '100%',
    height: 1,
    backgroundColor: '#D3D3D3',
    margin: 10,
  },
  dividerContainer: {
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    right: 20,
    top: -20,

  },
  navContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  navButton: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    left: 20,
    top: Platform.OS === 'ios' ? 0: screenHeight * 0.035,
  },
  imageNavContainer: {
    position: "absolute",
    top: 0,
    left: screenWidth - 65,
  },
  imageNavButton: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: '#ec8094',
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    top: Platform.OS === 'ios' ? 0: screenHeight * 0.035,
  },
  hobbiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: screenWidth * 0.8,
  },
  hobbies: {
    padding: 5,
  },
  profileImage: {
    height: screenHeight * 0.65,
    aspectRatio: 3 / 4
  },
  carouselContainer: {
    position: "absolute",
    top: 0,
    left: pfpOffset,
    height: screenHeight * 0.65,
    width: screenHeight * 0.65 * 3 / 4,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,

  },
  activeDot: {
    backgroundColor: '#ec8094',
  },
  inactiveDot: {
    backgroundColor: '#D3D3D3',
  },
});

export default MyProfilePage;
