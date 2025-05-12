import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Animated,
    Dimensions,
    Easing, FlatList, SafeAreaView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMyInfo } from "../Services/ProfileServices";
import { ActivityIndicator } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUser } from "../Services/GetUserServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomePage from "./HomePage";
import LottieView from 'lottie-react-native';
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";
import Carousel from "react-native-reanimated-carousel";
import {useFocusEffect, useNavigation} from "@react-navigation/native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const pfpOffset = -(screenHeight * 0.65 / 4 * 3 - screenWidth) / 2



const ProfilePage = ({route}) => {
    const dislikeButtonPosition = useRef(new Animated.Value(20)).current;
    const { id } = route.params;
    const { parent } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relationshipStatus, setRelationshipStatus] = useState("Unrelated")
    const [isDisliked, setDisliked] = useState(false)
/*    const likeAnimationRef = useRef(null);*/
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselRef = useRef(null);

    const navigation = useNavigation();
    
    /*useFocusEffect(
        useCallback(() => {
            setCarouselIndex(0);
            // Function that runs when the screen is focused
            return () => {
                // Reset the carousel index when the screen loses focus
                
                console.log("Reset the photo index", carouselIndex);
            };
        }, [])
    );
    

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                
                console.log('id is' + id)
                const userInfo = await getUser(id);
                setUser(userInfo);
                
                setRelationshipStatus(userInfo.relationshipStatus)
                console.log(userInfo);
                if(userInfo.relationshipStatus === "CurrentUserHasLiked" || userInfo.relationshipStatus === "Matched") {
                    dislikeButtonPosition.setValue(20)
                } else {
                    dislikeButtonPosition.setValue(-50)
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            } 
        };

        fetchUserInfo();
    }, []);*/

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            setCarouselIndex(0);
            console.log("Carousel Index initial: ", carouselIndex);
            if (carouselRef.current) {
                carouselRef.current.scrollTo({ index: 0, animated: false });
            }
            const fetchUserInfo = async () => {
                
                try {
                    console.log('id is' + id);
                    const userInfo = await getUser(id);
                    setUser(userInfo);
                    setRelationshipStatus(userInfo.relationshipStatus);
                    console.log(userInfo);
                    if(userInfo.relationshipStatus === "CurrentUserHasHidden"){
                        setDisliked(true)
                    } else {
                        setDisliked(false)
                    }
                    if (userInfo.relationshipStatus === "CurrentUserHasLiked" || userInfo.relationshipStatus === "Matched" || userInfo.relationshipStatus === "CurrentUserHasHidden") {
                        dislikeButtonPosition.setValue(20);
                    } else {
                        dislikeButtonPosition.setValue(-50);
                    }
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserInfo();

            // Cleanup function if needed when the screen loses focus
            return () => {
                setCarouselIndex(0);
                console.log("Reset the photo index", carouselIndex);
                
            };
        }, [id])
    );
    
    
    const moveDislikeButton = () => {
        
        Animated.timing(dislikeButtonPosition, {
            toValue: 20,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start();
    }
    
/*    function triggerLikeAnimation () {
        
        if (likeAnimationRef.current) {
            console.log("hello??")
            likeAnimationRef.current.play(0); 
        }
    }*/
    
    

    const restartDislikeButtonAnimation = () => {
        dislikeButtonPosition.setValue(-50); // Reset to starting position
        moveDislikeButton(); // Start the animation
    };
    const resetDislikeButton = () => {
        Animated.timing(dislikeButtonPosition, {
            toValue: -50,
            duration: 350,
            easing: Easing.elastic(1.5),
            useNativeDriver: true,
        }).start();
        //dislikeButtonPosition.setValue(-50); // Reset to starting position
        // Start the animation
    };
    
    
    
    
    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        return Math.abs(ageDate.getUTCFullYear()-1970);
    }
    
    const likeUser = async () => {
        try{
            
            
            
            const token = Platform.OS === "web"
                ? localStorage.getItem('token')
                : await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error("No token found");
            }
            // Using the emulator requires using address 10.0.2.2 (Host machine localhost)

            const url = getApiBaseUrl() + `Cream/Me/Likes`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({likeeId: id}),
                credentials: 'include'
            });
            if(response.ok) {
                
                const data = await response.json();
                console.log("isMatch: ", JSON.stringify(data.data.isMatch));
                if(data.data.isMatch){
                    setRelationshipStatus("Matched")
                    Alert.alert("You have matched!")
                } else {
                    setRelationshipStatus("CurrentUserHasLiked")
                }
                //triggerLikeAnimation()
                moveDislikeButton()
                
                return;
            } else {
                const j = await response.json();
                throw new Error(`HTTP error!: ${response.status}, ${j.message}`)
            }
        } catch (error) {
            console.error(error);
            return null;
        }
        
    }
    
    const dislikeUser = async () => {
        try{
            const token = Platform.OS === "web"
                ? localStorage.getItem('token')
                : await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error("No token found");
            }
            // Using the emulator requires using address 10.0.2.2 (Host machine localhost)

            const url = getApiBaseUrl() + `Cream/Me/Hidden`
            
            console.log(id);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({userId: id}),
                credentials: 'include'
            });
            if(response.ok) {

                const data = await response.json();
                setDisliked(true)
                setRelationshipStatus("CurrentUserHasHidden")
                moveDislikeButton();
                return;
            } else {
                const j = await response.json();
                throw new Error(`HTTP error!: ${response.status}, ${j.message}`)
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    const unDislikeUser = async () => {
        try{
            const token = Platform.OS === "web"
                ? localStorage.getItem('token')
                : await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error("No token found");
            }
            // Using the emulator requires using address 10.0.2.2 (Host machine localhost)

            const url = getApiBaseUrl() + `Cream/Me/Hidden/${id}`

            console.log(id);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({userId: id}),
                credentials: 'include'
            });
            if(response.ok) {

                const data = await response.json();
                console.log(data)
                setRelationshipStatus("Unrelated")
                setDisliked(false)
                resetDislikeButton()
                return;
            } else {
                const j = await response.json();
                console.log(j)
                throw new Error(`HTTP error!: ${response.status}, ${j.message}`)
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#ec8094" />
            /*<LinearGradient
                colors={['#ec8094', '#fefefe']}
                style={styles.container}
                
            >
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.header}>Loading...</Text>
            </LinearGradient>*/
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
    
    const chatRoute = () =>{
        navigation.navigate('IndividualMessagePage', {
            userName: user.firstName,
            userId: true,
            recipientId: id,
            profilePicture: user.profilePicture ? user.profilePicture.url : 'https://via.placeholder.com/50/FFB6C1/FFFFFF?text=+' // Pass profile picture URL
        })
    }
        
    return (
        
        <>
            
            <View style={styles.container}>



                <View style={[styles.carouselContainer]}>
                    <Carousel
                        ref={carouselRef}
                        loop={false}
                        width={screenHeight * 0.65 * 3 / 4}
                        height={screenHeight * 0.65}
                        data={user.photos}
                        scrollAnimationDuration={500}
                        renderItem={({item}) => (
                            <Image source={{uri: item.url}}
                                   style={styles.profileImage}
                                   onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
                            />
                        )}
                        index={carouselIndex} // Set the index to the state variable
                        onSnapToItem={(index) => setCarouselIndex(index)} // Update state when carousel changes
                    />
                </View>
                {renderDots()}
                <SafeAreaView style={styles.navContainer}>
                    <View style = {{flex: 1}}>
                        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={24} color="#ec8094"/>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                {parent === "Match" &&
                <SafeAreaView style={styles.chatContainer}>
                    <View style = {{flex: 1}}>
                        <TouchableOpacity style={styles.chatButton} onPress={chatRoute}>
                            <MaterialIcons name="chat" size={24} color="#ec8094"/>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>}
                
                <View style = {styles.profileContainer}>
                    
                    <View style={styles.profileCard}>
                        <Text style={styles.nameText}>
                            {user.firstName}, {user.age}
                        </Text>
                        <View style={styles.quickDetailsContainer}>
                            <View style={styles.locationContainer}>
                                <AntDesign name="enviroment" size={24} color="#ec8094" />
                                <Text style={styles.infoText}> {user.location.city}, {user.location.country}</Text>
                            </View>
                            <View style={[styles.hobbiesContainer, {backgroundColor: '#fff'}]}>
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
                        </View>
                        <View style = {styles.dividerContainer}>
                            <View style={styles.divider}/>
                        </View>
                        <Text style={styles.bioText}>
                            {user.bio}
                        </Text>
                        

                        
                    </View>
                    
                        <Animated.View
                            style={[
                                { transform: [{ translateX: dislikeButtonPosition }], backgroundColor: "#000", position: "absolute", zIndex: 999, right: 0, },
                            ]}
                        >
                            <TouchableOpacity style={styles.dislikeButton} onPress={async () => {
                                setDisliked(!isDisliked);
                                if(isDisliked) {
                                    await unDislikeUser();
                                } else {
                                    await dislikeUser()
                                }
                            }}>
                                <Ionicons name={isDisliked ? "eye" : "eye-off"} size={30} color="#ec8094"/>
                            </TouchableOpacity>
                            
                            
                            {relationshipStatus !== 'CurrentUserHasLiked' && relationshipStatus !== 'Matched' && relationshipStatus !== 'CurrentUserHasHidden' && (
                                <TouchableOpacity style={styles.likeButton} onPress={() => likeUser()}>
                                    <Ionicons name="heart" size={30} color="#ec8094" />

                                </TouchableOpacity>
                            )}
                        </Animated.View> 
                    
                    {/*<TouchableOpacity style={styles.resetButton} onPress={() => resetDislikeButton()}>
                        <AntDesign name="closecircle" size={30} color="#ec8094" />
    
                    </TouchableOpacity>*/}
                </View>
                {/*<LottieView
                    ref={likeAnimationRef}
                    source={require('../assets/matched4.json')}
                    autoPlay
                    loop={false}
                    style={[ {zIndex: 1000}, styles.lottie,]}
                    pointerEvents= "none"
                />*/}
            </View>


        </>
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
        height: "37%",
        alignItems: "center",
    },
    profileCard: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFF',
        //borderRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
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
        marginVertical: 15,
    },
    infoText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 5,
    },
    bioText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 10,
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
        margin: 1,
    },
    quickDetailsContainer: {
        marginBottom: 10,
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
        left: -35,
        top: -20,
        
    },
    dislikeButton: {
        zIndex: 1,
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
        top: -20,
        left: -105,
    },
    dislikeButtonBefore: {
        zIndex: 1,
        position: "relative",
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
        right: screenWidth * 0.05,
        bottom: 100,
    },
    resetButton: {
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
        right: 300,
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
        flex:1,
        position: "absolute",
        width: screenWidth * 1.1,
        height: '100%',
        marginBottom: "20%" 
        
    },
    photoContainer: {
        position: "absolute",
        flex: 1,
        justifyContent: "flex-start"
        
    },
    lottie: {
        
        position: "absolute",
        top: 0, bottom: 0, right: 0, left: 0,
        zIndex: 1000,
        pointerEvents: "none",
        
        

    },
    carouselContainer: {
        position: "absolute",
        top: 0,
        //left: pfpOffset,
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
    chatContainer: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    chatButton: {
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
        right: 20,
        top: Platform.OS === 'ios' ? 0: screenHeight * 0.035,
    },
});

export default ProfilePage;
