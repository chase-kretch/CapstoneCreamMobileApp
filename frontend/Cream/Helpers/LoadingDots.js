import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const LoadingDots = () => {
    const animation1 = useRef(new Animated.Value(0)).current;
    const animation2 = useRef(new Animated.Value(0)).current;
    const animation3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (animation) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: -10,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateDot(animation1);
        setTimeout(() => animateDot(animation2), 200);
        setTimeout(() => animateDot(animation3), 400);
    }, [animation1, animation2, animation3]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    { transform: [{ translateY: animation1 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    { transform: [{ translateY: animation2 }] },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    { transform: [{ translateY: animation3 }] },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#ec8094', // Change this color as needed
    },
});

export default LoadingDots;