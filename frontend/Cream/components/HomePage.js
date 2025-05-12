import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Dimensions,
    RefreshControl, Modal, Platform,
} from 'react-native';
import {getUsers} from "../Services/GetUserServices";
import CandidateView from "../Helpers/CandidateView";
import LogoutButton from "../Helpers/LogoutButton";
import Button from "../Helpers/Button";
import LoadingDots from "../Helpers/LoadingDots";
import {MaterialIcons} from "@expo/vector-icons";


const screen = Dimensions.get("screen");
const HomePage = ({navigation}) => {
    const [candidates, setCandidates] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingDisplay, setLoadingDisplay] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const endPoint = 'Candidates';
    const [numResults, setNumResults] = useState(0);

    const [screenDimensions, setScreenDimensions] = useState({
        screen: screen
    })

    const flatListRef = useRef(0);

    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };

    const scrollToTop = () => {
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
    };

    const generateToken = () => {
        return Math.floor(Math.random() * 1000000);
    };

    const tokenRef = useRef(generateToken());



    const fetchCandidatesInfo = async (currentPage) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {

            let candidatesInfo = await getUsers(currentPage, tokenRef.current);
            //console.log("homepage " + candidatesInfo + " currentPage: " + currentPage + " endpoint: " + endPoint);

            if (candidatesInfo === 404) {
                setHasMore(false);
            } else {
                setCandidates(prevCandidates => [...prevCandidates, ...candidatesInfo.data.items]);
                setPage(prevPage => prevPage + 1);
                setNumResults(candidatesInfo.data.totalItems);
                //console.log(endPoint + " after fetch" + JSON.stringify(likesInfo.data.items));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const routeTo = (location) =>{
        navigation.navigate(location);
    };

    const [isNumResultsVisible, setIsNumResultsVisible] = useState(false);
    
    const onRefresh = () => {
        setRefreshing(true);
        tokenRef.current = generateToken();
        setCandidates([]);
        setPage(1);
        setHasMore(true);
        fetchCandidatesInfo(1);
        console.log(page, tokenRef.current);
        console.log("candidates " + candidates)
        setIsNumResultsVisible(true);
        setTimeout(() => {
            
            setRefreshing(false);
            setTimeout(() => setIsNumResultsVisible(false), 2000);
        }, 700); // Refresh indicator will be visible for at least 1 second
    };
    const emptyComponent = () => {
        return (
            <View style={{flex:1, backgroundColor: '#fff', height: screen.height * 0.93, justifyContent:'center', alignItems: 'center'}}>
                <Text>There are no candidates matching your preferences.</Text>
                <Button style = {styles.refreshButton}
                        displayText = {"Refresh"}
                        textStyle = {styles.refreshText}
                        onPress = {onRefresh}
                ></Button>
            </View>
        );
    };

    const footerComponent =  () => {
        if (candidates.length === 0){
            return null;
        }
        return (
            <View style={[styles.footerContainer]}>
                {hasMore?
                    (<LoadingDots/> ):
                    (<View style = {styles.endResults}>
                        <Text style={styles.refreshText}>
                            End of Results
                        </Text>
                    </View>)}
            </View>

        )
    }
    

    return(
        // Main Container
        <View style={[styles.container, {backgroundColor: '#fff'}]}>
            
            {isNumResultsVisible && 
                <View style={styles.numResultsContainer}>
                    <Text style={styles.numResultsText}>{numResults}  results</Text>
                </View>
            }

            {!isNumResultsVisible && candidates.length > 1 &&
                <TouchableOpacity style={styles.jumpButton} activeOpacity={1}>
                    <MaterialIcons name="arrow-upward" size={24} color="#ec8094" onPress = {scrollToTop}/>
                </TouchableOpacity>
            }

            {/* Header Bar */}
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingTop:0, }}>
                <View style={[styles.headerContainer]}>

                    {/* Logout Icon */}
                    <LogoutButton></LogoutButton>

                    {/* Logo */}
                    <View style={[styles.logoContainer]}>
                        <Text style={styles.logoText}>cream.</Text>
                    </View>

                    {/* Messages Icon */}
                    <TouchableOpacity onPress={() => routeTo('MessagePage')}
                                      style= {styles.paperPlaneContainer}>
                        <Image source={require('../assets/paperplane.png')}
                               style={styles.icon}
                        />
                    </TouchableOpacity>

                </View>
                

                {/* Main Body */}
                <View style = {[styles.bodyContainer, {backgroundColor: '#fff'}]}>

                    {/* Rounded Candidate Boxes */}
                    <FlatList
                        ref = {flatListRef}
                        data={candidates}
                        renderItem={({ item }) => (
                            <CandidateView
                                id = {item.id}
                                firstName= {item.firstName}
                                age = {item.age}
                                gender = {item.gender}
                                bio = {item.bio}
                                profilePicture = {item.profilePicture}
                                photos = {item.photos}
                                location = {item.location}
                                hobbies = {item.hobbies}
                                onPressCandidate = {routeTo}
                            ></CandidateView>
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal = {false}
                        pagingEnabled={true}
                        snapToOffsets={candidates.map((_, index) => Platform.OS === 'ios' ? index * screen.height * 0.74 : index * screen.height * 0.78)}
                        snapToAlignment={"start"}
                        decelerationRate={'fast'}
                        //disableIntervalMomentum = {true}
                        //showsVerticalScrollIndicator={true}
                        //verticalScrollIndicatorEnabled={true}
                        onEndReached={() => fetchCandidatesInfo(page)}
                        oneEndReachedThreshold={0.2}
                        ListFooterComponent={footerComponent}
                        ListEmptyComponent={emptyComponent}
                        refreshControl = {
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                        maxToRenderPerBatch={10}
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshing={refreshing}
                        onViewableItemsChanged={onViewableItemsChanged}
                        
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    logoContainer: {

        alignItems: 'center',
        backgroundColor: '#fff',

    },
    logoText: {
        flexShrink:1,
        //color: '#FFB6C1',
        color: "#ec8094",
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'FFF',
        marginTop: screen.height * -0.01,
    },
    paperPlaneContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: screen.width*0.11,
        height: screen.height*0.05,
        borderRadius: 25,
        paddingRight: 0,
    },
    icon :{
        height: 30,
        width: 30,
        resizeMode:'contain',
    },
    bodyContainer: {
        height: screen.height * 0.93,
        width: screen.width ,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    refreshButton: {
        height: screen.height * 0.045,
        width: screen.width * 0.3,
        borderRadius: 20,
        backgroundColor: '#ec8094',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    refreshText: {
        fontSize: 20,
        color: "#fff",
    },
    footerContainer:{
        flex: 1,
        height: screen.height * 0.07,
        marginBottom: screen.width * 0.27,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    endResults:{
        height: screen.height * 0.045,
        width: screen.width * 0.9,
        borderRadius: 20,
        backgroundColor: '#ec8094',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: screen.height * 0.035,
    },
    listHeaderContainer: {
        height: screen.height * 0.04,
        width: screen.width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    arrowContainer: {
        alignItems: 'flex-end',
    },
    listHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    listHeaderContent: {
        marginTop: 10,
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
    },
    
    numResultsContainer: {
        zIndex: 2,
        position: "absolute",
        width: screen.width * 0.4,
        height: screen.height * 0.05,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: screen.height * 0.02,
        left: screen.width * 0.3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    },
    numResultsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "black",
        textAlign: 'center',
        alignSelf: 'center',
    },
    jumpButton: {
        zIndex: 2,
        position: "absolute",
        width: screen.width * 0.12,
        height: screen.width * 0.12,
        backgroundColor: '#fff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: screen.height * 0.02,
        right: screen.width * 0.03,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    }
});

export default HomePage;