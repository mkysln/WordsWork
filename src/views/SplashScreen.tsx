import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import colors from '../assets/Colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  // TEXT animasyonları
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1.2)).current;

  // LOGO animasyonları
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // 1️⃣ Yazı aşağı kay + küçül
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: height * 0.25,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2️⃣ Logo ortaya fade + scale
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3️⃣ Menüye geç
    const timer = setTimeout(() => {
      navigation.replace('Menu');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* KOCAMAN YAZI */}
      <Animated.Text
        style={[
          styles.bigText,
          {
            transform: [{ translateY: textTranslateY }, { scale: textScale }],
          },
        ]}
      >
        Kolay Gelsin{'\n'}Ümit Abe
      </Animated.Text>

      {/* LOGO */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigText: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 42,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: height / 2 - 80,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
});

export default SplashScreen;
