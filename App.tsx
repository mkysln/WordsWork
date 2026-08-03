import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { Word } from './src/schema/database';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/views/MenuScreen';
import WordScreen from './src/views/WordScreen';
import InputScreen from './src/views/InputScreen';
import { RootStackParamList } from './src/schema/navigation';
import colors from './src/assets/Colors';
import { WordRealmContext } from './src/schema/realmConfig';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ArchivedScreen from './src/views/ArchivedScreen';
import { PaperProvider } from 'react-native-paper';
import SplashScreen from './src/views/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const { RealmProvider } = WordRealmContext;
function App() {
  return (
    <RealmProvider schema={[Word]}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerShown: false,
                statusBarTranslucent: false, // 👈 ÇOK ÖNEMLİ
                statusBarStyle: 'light',
                statusBarHidden: false,
                statusBarAnimation: 'slide',
                statusBarBackgroundColor: '#000000',
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />

              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen
                name="Word"
                component={WordScreen}
                options={({ route, navigation }) => ({
                  headerShown: true,
                  headerTitle: `Level ${route.params.level}`,
                  headerStyle: {
                    backgroundColor: '#263d4a',
                    statusBarBackgroundColor: 'black',
                  },
                  headerTintColor: colors.textPrimary,
                  headerTitleAlign: 'center',
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()} // Geri gitme işlemi
                      style={{ marginLeft: -10 }} // Bazen ikon çok içeride kalabilir, sola çekmek için
                    >
                      <Ionicons
                        name="caret-back-outline" // İstediğin ikon ismi (arrow-back, close vb.)
                        size={30}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="Input"
                component={InputScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  headerTitle: 'Add Word',
                  headerStyle: { backgroundColor: '#263d4a' },
                  headerTintColor: colors.textPrimary,
                  headerTitleAlign: 'center',
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()} // Geri gitme işlemi
                      style={{ marginLeft: -10 }} // Bazen ikon çok içeride kalabilir, sola çekmek için
                    >
                      <Ionicons
                        name="caret-back-outline" // İstediğin ikon ismi (arrow-back, close vb.)
                        size={30}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="Archived"
                component={ArchivedScreen}
                options={({ navigation }) => ({
                  headerShown: true,
                  headerTitle: 'Archive',
                  headerStyle: { backgroundColor: '#263d4a' },
                  headerTintColor: colors.textPrimary,
                  headerTitleAlign: 'center',
                  headerLeft: () => (
                    <TouchableOpacity
                      onPress={() => navigation.goBack()} // Geri gitme işlemi
                      style={{ marginLeft: -10 }} // Bazen ikon çok içeride kalabilir, sola çekmek için
                    >
                      <Ionicons
                        name="caret-back-outline" // İstediğin ikon ismi (arrow-back, close vb.)
                        size={30}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                  ),
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </RealmProvider>
  );
}

export default App;
