import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert, Dimensions, TouchableOpacity, Platform, SafeAreaView} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import UploadImageCarousel from '../Helpers/UploadImageCarousel';

import {deleteImage, uploadImages, uploadProfileImage} from '../Services/ImageServices'
import {useNavigation, useIsFocused} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PhotoUpload = ({route}) => {

  const user = route.params.user;
  const isFocused = useIsFocused();

  const [imageUrls, setImageUrls] = useState([
    {url: null, key: 0, dbID: null}, {url: null, key: 1, dbID: null}, {url: null, key: 2, dbID: null}, {
      url: null,
      key: 3,
      dbID: null
    },
    {url: null, key: 4, dbID: null}, {url: null, key: 5, dbID: null}, {url: null, key: 6, dbID: null}, {
      url: null,
      key: 7,
      dbID: null
    }
  ]);

  const [removedImages, setRemovedImages] = useState([]);

  const [numImagesUploaded, setNumImagesUploaded] = useState(0)

  const [savingImages, setSavingImages] = useState(false)

  const navigation = useNavigation();

  useEffect(() => {
    setRemovedImages([])
    setNumImagesUploaded(0)
    setSavingImages(false)

    if (user !== null && isFocused) {
      const userPhotos = [];

      for (let i = 0; i < user.photos.length; i++) {
        const currentPhoto = user.photos[i]
        userPhotos.push({dbID: currentPhoto.id, url: currentPhoto.url, key: i});
      }

      setNumImagesUploaded(userPhotos.length);

      for (let i = 0; i < 8 - user.photos.length; i++) {
        userPhotos.push({dbID: null, url: null, key: i + user.photos.length});
      }
      setImageUrls([...userPhotos]);
    }
  }, [isFocused])


  const saveImagesHandler = async () => {
    setSavingImages(true)
    let setPFP = true

    try {

      const token = Platform.OS === "web"
        ? localStorage.getItem('token')
        : await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error("No token found");
      }

      await uploadPhotos(token)

      user ? navigation.navigate("AppTabNavigator", {initialRoute: 'MyProfilePage'}) : navigation.navigate("SettingsPage", {user: null});


    } catch (error) {
      Alert.alert('Error uploading details', error.message, [
        {text: 'OK'}
      ]);
    } finally {
      setSavingImages(false)
    }
  }

  const uploadPhotos = async (token) => {
    
    let setPFP = true

    const promises = [];

    for (const image of removedImages) {
      const photoId = image.dbID
      promises.push(deleteImage(photoId, token));
    }

    for (const image of imageUrls) {
      if (image.url !== null) {
        const formData = new FormData();
        const imageType = image.url.split('.').pop();
        let mimeType = ''
        switch (imageType) {
          case 'heic':
            mimeType = 'image/heic';
            break;
          case 'jpg':
            mimeType = 'image/jpg';
            break;
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          default:
            mimeType = 'image/png';
        }

        const imagePackage = {
          uri: image.url,
          name: `${Date.now()}_image_${image.key}`,
          type: mimeType
        }

        formData.append('file', imagePackage);

        promises.push(uploadImages(formData, token));

        if (setPFP === true && image.key === 0) {
          promises.push(uploadProfileImage(formData, token));
          setPFP = false;
        }
      }
    }

    for (const image of imageUrls) {
      if (image.dbID !== null && image.url !== null) {
        const photoId = image.dbID;
        promises.push(deleteImage(photoId, token));
      }
    }

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw new Error(error.message);
    }
  }

  const pickImage = async (key) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Allow permission to access your camera roll", '', [
        {text: 'OK'}
      ]);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [3, 4],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedImageUrls = imageUrls.map((item) => (item.key === key ? {
        url: result.assets[0].uri,
        key: key,
        dbID: null
      } : item))
      setImageUrls(updatedImageUrls);
      setNumImagesUploaded((prevItem) => prevItem + 1);
    }
  };

  const removeImage = (key) => {
    const removedImage = imageUrls.find((item) => item.key === key);

    if (removedImage.dbID !== null) {
      setRemovedImages((prevItem) => [...prevItem, removedImage]);
    }

    const updatedImageUrls = imageUrls.map((item) => (item.key === key ? {url: null, key: key} : item))
    setImageUrls(updatedImageUrls);
    setNumImagesUploaded((prevItem) => prevItem - 1);
  }


  return (
    <LinearGradient
      colors={['#ec8094', '#fefefe']}
      style={styles.container}
    >

      {user && numImagesUploaded !== 0 && <SafeAreaView style={styles.navContainer}>
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ec8094"/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      }


      <Text style={styles.header}>cream.</Text>

      <Text style={styles.subHeader}>add up to 8 photos.</Text>

      <View style={styles.addImageContainer}>

        <UploadImageCarousel imageUrls={imageUrls} pickImage={pickImage} removeImage={removeImage}/>

        <View style={styles.saveImagesContainer}>

          <TouchableOpacity
            style={savingImages || numImagesUploaded === 0 || imageUrls[0].url === null ? styles.saveImagesButtonDisabled : styles.saveImagesButtonEnabled}
            disabled={numImagesUploaded === 0 || savingImages || imageUrls[0].url === null}
            onPress={saveImagesHandler}
          >

            <Text style={styles.saveImagesText}>{savingImages ? 'Saving Photos...' : 'Save Photos'}</Text>

          </TouchableOpacity>

        </View>

      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    top: Platform.OS === 'ios' ? 0 : screenHeight * 0.035,
  },
  header: {
    flex: 3,
    color: '#FFF',
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 100,
  },
  subHeader: {
    flex: 1,
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4
  },
  addImageContainer: {
    flex: 15,
    width: '100%',
    paddingHorizontal: screenWidth * 0.025,
  },
  saveImagesButtonEnabled: {
    marginBottom: 16,
    backgroundColor: 'black',
    borderRadius: 4,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
    height: 40,
  },
  saveImagesButtonDisabled: {
    marginBottom: 16,
    backgroundColor: 'dimgrey',
    borderRadius: 4,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
    height: 40,
  },
  saveImagesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  saveImagesContainer: {
    height: 90,
    width: '80%',
    alignSelf: 'center'
  }
});

export default PhotoUpload;
