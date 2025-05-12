import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import {getToken} from "../Helpers/GetToken";
import {getApiBaseUrl} from "../Helpers/GetApiBaseUrl";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import LoadingDots from "../Helpers/LoadingDots";
import {LinearGradient} from "expo-linear-gradient";
import iconImage from "../assets/icon.png";
import { formatDistanceToNow } from 'date-fns';

const ActivityView = ({route}) => {
    const [likes, setLikes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingDisplay, setLoadingDisplay] = useState(false);
    const { endPoint } = route.params;
    const [prefix, setPrefix] = useState("");
    

    const navigation = useNavigation();

    // Function to fetch likes data

    const getLikes = async (page) => {
        try {
            // Get the token from the appropriate storage based on the platform
            const token = await getToken()
            if (!token) {
                throw new Error("No token found");
            }

            let query = endPoint === 'Candidates' || endPoint === 'Hidden' ? `?page=${page}` : `?pageNumber=${page}`;
            
            // Using the emulator requires using address 10.0.2.2 (Host machine localhost)
            const url = getApiBaseUrl() + 'Cream/Me/' + endPoint + query;
            

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("url", url, "response", response.status);
            if (response.ok) {
                const j = await response.json();
                return j;
            } else if (response.status === 404) {
                return response.status;
            }else {
                // Handle HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error getting users", error);
            return null;
        }
    }
    const fetchLikes = async (currentPage) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {

            let likesInfo = await getLikes(currentPage);
            console.log("LikesInfo " + likesInfo + " currentPage: " + currentPage + " endpoint: " + endPoint);

            if (likesInfo === 404) {
                setHasMore(false);
                console.log("404");
            } else {
                setLikes(prevLikes => [...prevLikes, ...likesInfo.data.items]);
                setPage(prevPage => prevPage + 1);
                //console.log(endPoint + " after fetch" + JSON.stringify(likesInfo.data.items));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoadingDisplay(true);
            setLikes([]);  // Clear previous likes
            setPage(1);    // Reset page to 1
            setHasMore(true);
            fetchLikes(1);
            setLoadingDisplay(false);

            if (endPoint === 'Likes/Given') {
                setPrefix("liked");
            } else if (endPoint === 'Likes/Received') {
                setPrefix("liked");
            } else if (endPoint === 'Matches') {
                setPrefix("matched");
                //console.log("reached matchedUser" + user);
            } else if (endPoint === 'Hidden') {
                setPrefix("hidden");
                //console.log("reached hidden" + user);    
            }

            return () => {
                //console.log('Screen unfocused, resetting likes...'); // Debugging line
                setLikes([]); // Reset likes when navigating away
                setPage(1);   // Reset page to 1
                setHasMore(true); // Reset hasMore to true
            };

        }, [])
    );

    
    const getPhotoUrlById = (user, photoId) => {
        console.log("photos " + JSON.stringify(user.photos) + " " + photoId);
        const photo = user.photos.find((p) => p.id === photoId);
        return photo //? photo.url : "https://thispersondoesnotexist.com/";
    };

    const renderItem = ({ item }) => {
        let user;

        if (endPoint === 'Likes/Given') {
            user = item.likee;
        } else if (endPoint === 'Likes/Received') {
            user = item.liker;
        } else if (endPoint === 'Matches') {
            user = item.matchedUser;
            //console.log("reached matchedUser" + user);
        } else if (endPoint === 'Hidden') {
            user = item.hidden;
            //console.log("reached hidden" + user);    
        } else {
            user = item; // Default case, e.g., for Candidates or other cases
        }

        
        //console.log(item.timestamp)
        const photo1 = user.profilePicture
        let timeAgo
        if (item.timestamp){
            const utcDate = new Date(item.timestamp);
            const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
            timeAgo = formatDistanceToNow(localDate, { addSuffix: true });
            if (timeAgo.startsWith('about ')) {
                timeAgo = timeAgo.replace('about ', '');
            }
            
        } else{
            timeAgo = item.timestamp;
        }

        

        return (
            <TouchableOpacity onPress={() => navigation.navigate("ProfilePage", { id: user.id, parent: endPoint === 'Matches' ? 'Match' : null })}>
                <View style={styles.activityItem}>
                    <Image source={photo1 ? {uri: photo1.url} : iconImage} style={styles.avatar} />
                    <View style={styles.activityTextContainer}>
                        <Text style={styles.nameText}>{user.firstName}</Text>
{/*
                        <Text style={styles.activityText} numberOfLines={1}>{formatDistanceToNow(item.timestamp, {addSuffix: true})}</Text>
*/}
{/*
                        <Text style={styles.activityText} numberOfLines={1}>{item.timestamp ? formatDistanceToNow(new Date(Date.parse(item.timestamp)), {addSuffix: true}) : item.timestamp}</Text>
*/}
                        <Text style={styles.activityText} numberOfLines={1}>{prefix + " " + timeAgo}</Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    // Render the list
    return (

        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={likes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => fetchLikes(page)}
                //onEndReached={() => console.log('End Reached')}
                onEndReachedThreshold={1}
                ListFooterComponent={likes.length > 0 ? null : null}
            />
            {/* Loading Overlay */}
            {loadingDisplay && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#ec8094" />
                </View>
            )}
        </View>
    );
};

export default ActivityView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff', // Semi-transparent black
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Ensure the overlay is above other components
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',  // Light gray border for each message
        backgroundColor: '#fff',  // White background for each message item
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    activityTextContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',  // Black text for names
    },
    activityText: {
        fontSize: 14,
        color: '#000',  // Black text for message previews
    },

});