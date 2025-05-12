import {StyleSheet, Image, Text, TouchableOpacity, View, Dimensions, Platform} from "react-native";
import React, {useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";
import iconImage from '../assets/icon.png'

const screen = Dimensions.get("screen");
const CandidateView = ({id, firstName, 
                           hobbies, 
                           photos, 
                           age, 
                           location, onPressCandidate}) => {
    const navigation = useNavigation();

    const [screenDimensions, setScreenDimensions] = useState({
        screen: screen
    })
   
    
    
//redundant
/*const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear()-1970);
}*/

    const getPhoto = (index) => {
        //console.log("gyatt " + photos);
        const photo = photos[index];
        //console.log(JSON.stringify(photo));
        return photo; //? photo.url : "https://thispersondoesnotexist.com/";
    };

    

    const getHobby= (index) => {
        //console.log("gyatt " + hobbies);
        const hobby = hobbies[index];
        //console.log(JSON.stringify(photo));
        return hobby; //? photo.url : "https://thispersondoesnotexist.com/";
    };

    const images = [
        getPhoto(0) ? {uri: getPhoto(0).url} : iconImage, // First image
        getPhoto(1) ? {uri: getPhoto(1).url} : iconImage, // Second image
        getPhoto(2) ? {uri: getPhoto(2).url} : iconImage, // Third image
    ];
    
    return (
    <LinearGradient
        //colors={['#FFB6C1', '#FFFFD7']}
        colors={['#fefefe', '#fefefe']}
        style={styles.candidateContainer}
        //start = {{ x: 0.5, y: 0.25 }}
        //end = {{ x: 0.5, y: 0.75 }}
    >
        {/* Routes to candidates profile on press */}
        <TouchableOpacity activeOpacity={1} onPress={() => {navigation.navigate("ProfilePage", {id: id, parent: 'HomePage'})}}
                          style= {[styles.container, {backgroundColor: "#fff"}]}>

            {/* Candidate Information | Header */}
            <View style = {[styles.infoContainer, {flexDirection: 'row'}]}>

                {/* Name */}
                <View style = {styles.nameContainer}>
                    <Text style = {styles.nameText} numberOfLines={1} adjustsFontSizeToFit={true}>{firstName}</Text>
                    <Text style = {[styles.nameText, {marginBottom: 0}]} numberOfLines={1} adjustsFontSizeToFit={true}>{age}</Text>
                </View>

                {/* Hobbies */}
                <View style = {styles.hobbyContainer}>
                    <Text style = {styles.hobbyText} numberOfLines={1} adjustsFontSizeToFit={true}>{getHobby(0) ? getHobby(0).name: null}</Text>
                    <Text style = {styles.hobbyText} numberOfLines={1} adjustsFontSizeToFit={true}>{getHobby(1) ? getHobby(1).name: null}</Text>
                    <Text style = {[styles.hobbyText, {marginBottom: 0}]} numberOfLines={1} adjustsFontSizeToFit={true}>{getHobby(2) ? getHobby(2).name: null}</Text>
                </View>
            </View>

            {/* Middle and Footer wrapper*/}
            <View style = {[styles.container, {flex:2.5}]}>
                
                {/*<CandidateCarousel photos = {photos} iconImage = {iconImage}/>*/}

                {/* Candidate Photos */}
                <View style = {[styles.imagesContainer]}>

                     {/*Center image*/} 
                    <Image
                        source={getPhoto(0) ? {uri: getPhoto(0).url} : iconImage}
                        
                        style={styles.topImage}
                    />

                     {/*Left image*/} 
                    <Image
                        source={getPhoto(1) ? {uri: getPhoto(1).url} : iconImage}
                        style={[styles.bottomImage, styles.leftImage]}
                        blurRadius = {5}
                    />

                     {/*Right image */}
                    <Image
                        source={getPhoto(2) ? {uri: getPhoto(2).url} : iconImage}
                        style={[styles.bottomImage, styles.rightImage]}
                        blurRadius = {5}
                    />

                </View>

                {/* Age and Gender*/}
                <View style = {[styles.ageGenderContainer]}>
                    <Text style={styles.ageGenderText}>{location.city}</Text>
                </View>

            </View>
        </TouchableOpacity>
    </LinearGradient>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: screen.height * 0.7,
        width: screen.width * 0.9,
        paddingBottom: 0,
        borderRadius: 15,
        backgroundColor: "#fff"
    },
    candidateContainer: {
        height: Platform.OS === 'ios' ? screen.height * 0.7 : screen.height * 0.74,
        width: screen.width * 0.9,
        backgroundColor: '#FFB6C1',
        borderRadius: 15,
        marginVertical: screen.height * 0.02,
        marginHorizontal: screen.width * 0.015,
        /*shadowColor: '#000',
        shadowOffset: {width: 2, height:2},
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,*/
        paddingBottom: 0,
        borderColor: "black",
        borderStyle: 'solid',
        borderWidth: 1,
        overflow: "hidden",
    },
    infoContainer:{
        flex: 1,
        alignItems: 'center',
    },
    nameContainer:{
        flex:5,
    },
    hobbyContainer: {
        flex: 3,
        alignItems: 'flex-end',
    },
    nameText:{
        color: '#ec8094',
        fontSize: 45,
        fontWeight: 'bold',
        marginLeft: 14,
        marginBottom: -18,
    },
    hobbyText:{
        color: '#ec8094',
        fontSize: 19,
        fontWeight: 'bold',
        marginRight: 14,
        marginBottom: -5,
    },
    ageGenderContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: 'space-around',
    },
    ageGenderText: {
        //color: '#FFB6C1',
        color: '#ec8094',
        fontSize: 35,
        fontWeight: 'bold',
    },
    imagesContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    topImage: {
        height: screen.height * 0.39,
        width: screen.width * 0.68,
        zIndex: 3,
        position: 'absolute',
        borderRadius: 10,
    },
    bottomImage: {
        height: screen.height * 0.33,
        width: screen.width * 0.57,
        position: 'absolute',
        zIndex: 2,
        borderRadius: 10,
    },
    leftImage: {
        left: 15,
    },
    rightImage: {
        right: 15,
    },
})
export default CandidateView