import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

import Carousel from 'react-native-reanimated-carousel'

const screenWidth = Dimensions.get('window').width;

const UploadImageCarousel = ({ imageUrls, pickImage, removeImage }) => {
  
  return (
    <Carousel
      loop={false}
      width={screenWidth * 0.95}
      height={screenWidth * 0.95 + 100}
      data={imageUrls}
      mode='parallax'
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 100,
      }}
      scrollAnimationDuration={500}
      renderItem={({ item }) => (
        <View style={styles.addImageContainer}>
          
          {item.key === 0 ? (
            <Text style={styles.pfpText}>Profile Photo</Text>
          ): <View style={{paddingTop: 20}}></View>}
          
          <TouchableOpacity
            style={styles.addImageButton}
            activeOpacity={0.8}
            onPress={() => { pickImage(item.key) }}
          >
            {item.url ? (
              <Image source={{ uri: item.url }} style={styles.image} />
            ) : (
              <Text style={styles.addImageText}>+</Text>
            )}
          </TouchableOpacity>
          
          {item.url ? (
            <TouchableOpacity
              style={styles.removeImageButton}
              activeOpacity={0.8}
              onPress={() => { removeImage(item.key) }}
            >
              <Text style={styles.removeImageText}>Remove Photo</Text>
            </TouchableOpacity>
          ) : <></>}

        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  addImageContainer: {
    height: screenWidth * 0.95 + 50
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pfpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  addImageButton: {
    width: screenWidth * 0.95 * 3 / 4,
    height: screenWidth * 0.95,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center'
  },
  addImageText: {
    fontSize: 32,
    fontWeight: '100',
    color: 'white'
  },
  removeImageButton: {
    alignSelf: 'center',
    backgroundColor: '#ec8094',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: 'white',
    borderStyle: 'dashed'
  },
  removeImageText: {
    color: 'white'
  }
})

export default UploadImageCarousel