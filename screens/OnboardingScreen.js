import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
    require('../images/milk3.png'),
    require('../images/milk1.png'),
    require('../images/milk2.png'),
    require('../images/milk5.png'),
    require('../images/milk1.png'),
];

export default function OnboardingScreen({ navigation }) {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showSlider, setShowSlider] = useState(true);

    // Milk Mate animations
    const titlePosition = useRef(new Animated.Value(height / 2)).current;
    const titleScale = useRef(new Animated.Value(0.5)).current;
    const titleOpacity = useRef(new Animated.Value(0.5)).current;

    // Image opacity animation
    const imageOpacity = useRef(new Animated.Value(0)).current;

    // Milk Mate animation first
    useEffect(() => {
        Animated.parallel([
            Animated.timing(titlePosition, {
                toValue: 80,
                duration: 1500,
                useNativeDriver: false,
            }),
            Animated.timing(titleScale, {
                toValue: 1.6,
                duration: 1500,
                useNativeDriver: false,
            }),
            Animated.timing(titleOpacity, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setShowSlider(true);
            // Animate image opacity after title animation completes
            Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    // Auto-scroll images every 2 sec
    const indexRef = useRef(0); // 👈 useRef for tracking index


useEffect(() => {
  if (!showSlider) return;

  const interval = setInterval(() => {
    indexRef.current += 1;

    if (indexRef.current < slides.length) {
      flatListRef.current?.scrollToOffset({
        offset: indexRef.current * width,
        animated: true,
      });
      setCurrentIndex(indexRef.current);
    }

    // Reset to real first image (index 0) after reaching duplicate (index 3)
    if (indexRef.current === slides.length - 1) {
      setTimeout(() => {
        indexRef.current = 0;
        flatListRef.current?.scrollToOffset({
          offset: 0,
          animated: false, // jump silently
        });
        setCurrentIndex(0);
      }, 500); // slight delay to allow previous animation
    }
  }, 3000);

  return () => clearInterval(interval);
}, [showSlider]);



    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Animated.Image
                source={item}
                style={[
                    styles.image,
                    { opacity: imageOpacity },
                ]}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Milk Mate Title */}
            <Animated.View style={[styles.titleWrapper, {
                top: titlePosition,
                transform: [{ scale: titleScale }],
                opacity: titleOpacity,
            }]}>
                <Text style={styles.title}>Milk Mate</Text>
            </Animated.View>

            {/* Image Slider appears after title animation */}
            {showSlider && (
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    keyExtractor={(_, i) => i.toString()}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                    initialScrollIndex={0}
                    style={styles.slider}
                />

            )}

            {/* Get Started Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace('OwnerLogin')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0077B6',
    },
    titleWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1.2,
    },
    slider: {
        flexGrow: 0,
        height: height * 0.6,
        marginTop: height * 0.18,
    },
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.9,
        height: height * 0.5,
        resizeMode: 'cover',
        borderRadius: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 42,
        borderRadius: 40,
        elevation: 8,
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
    },
});
