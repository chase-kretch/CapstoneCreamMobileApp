import React, {useCallback, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { getUsersForMessages, fetchLoggedInUserId } from '../Services/MessageServices';
import { getMyInfo } from '../Services/ProfileServices';
import { MaterialIcons } from "@expo/vector-icons";
const screen = Dimensions.get("screen");
const MessagePage = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    
    const fetchUsers = async () => {
        try {
            let userId;
            // if (!userId) {
            //     console.error("Failed to get logged-in user ID from fetchLoggedInUserId().");
            // }

            const userInfo = await getMyInfo();
            console.log("User Info:", userInfo);

            if (userInfo && userInfo.id) {
                userId = userInfo.id;
            }

            if (userId) {
                setLoggedInUserId(userId);
                console.log("Logged-in User ID:", userId);
            } else {
                console.error("No valid logged-in user ID found.");
                return;
            }

            const fetchedUsers = await getUsersForMessages();
            if (fetchedUsers && fetchedUsers.items) {
                setUsers(fetchedUsers.items);
            } else {
                console.log("No users were fetched.");
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setUsers([]);  // Clear previous likes
            fetchUsers();

            return () => {
                //console.log('Screen unfocused, resetting likes...'); // Debugging line
                setUsers([]); // Reset likes when navigating away
            };

        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                if (loggedInUserId) {
                    navigation.navigate('IndividualMessagePage', {
                        userName: item.matchedUser.firstName,
                        userId: loggedInUserId,
                        recipientId: item.matchedUser.id,
                        profilePicture: item.matchedUser.profilePicture ? item.matchedUser.profilePicture.url : 'https://via.placeholder.com/50/FFB6C1/FFFFFF?text=+' // Pass profile picture URL
                    });
                } else {
                    console.error("Logged-in user ID is not available.");
                }
            }}
        >
            <View style={styles.messageItem}>
                <Image source={{ uri: item.matchedUser.profilePicture ? item.matchedUser.profilePicture.url : 'https://via.placeholder.com/50/FFB6C1/FFFFFF?text=+' }} style={styles.avatar} />
                <View style={styles.messageTextContainer}>
                    <Text style={styles.nameText}>{item.matchedUser.firstName}</Text>
                    <Text style={styles.messageText} numberOfLines={1}>{""}</Text>
                </View>
                {item.newMessage && <View style={styles.newMessageIndicator} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("AppTabNavigator", {initialRoute: 'HomePage'})}>
                    <MaterialIcons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>messages</Text>
                </View>
                <View style = {styles.blankContainer}></View>
            </View>

            {/*<View style={styles.divider} />*/}

            {users.length > 0 ? (
                <FlatList
                    style = {[styles.container, {paddingHorizontal: screen.width * 0.05,}]}
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    
                />
            ) : (
                <Text style = {{alignSelf: 'center', marginTop: screen.height * 0.02,}}>Matches will appear here</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: screen.width * 0.01,
    },
    headerContainer: {
        height: screen.height * 0.07,
        width: screen.width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 0: screen.height * 0.03,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 15,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center', // Center the text container
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#ec8094',
        textTransform: 'lowercase',
        marginBottom: screen.height * 0.01,
    },
    navButton: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: screen.width*0.11,
        height: screen.height*0.05,
        borderRadius: 25,
        paddingRight: 0,
    },
    divider: {
        height: 2,
        backgroundColor: '#000',
        marginVertical: 10,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    avatar: {
        width: screen.height * 0.06,
        height: screen.height * 0.06,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 0, // Add some left padding for the profile photo
    },
    messageTextContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    messageText: {
        fontSize: 14,
        color: '#000',
    },
    newMessageIndicator: {
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    blankContainer:{
        width: screen.width*0.11,
        height: screen.height*0.05,
    }
});

export default MessagePage;
