/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import colors from '../assets/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../schema/navigation';
import { WordRealmContext } from '../schema/realmConfig';
import { Word } from '../schema/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const { useQuery } = WordRealmContext;
function MenuScreen({ navigation }: Props) {
  const allWords = useQuery(Word);
  const getCount = (levelNumber: number) => {
    return allWords.filtered('level == $0 && isArchived == false', levelNumber)
      .length;
  };
  const levels = [1, 2, 3, 4, 5];
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={{ width: 200, height: 200, marginTop: 20 }}
      />

      <View
        style={{
          flex: 4,
          alignItems: 'center',

          width: '100%',
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('Input');
          }}
        >
          <Ionicons name="add-circle-outline" color={'white'} size={18} />
          <View style={{ padding: 3 }} />
          <Text style={styles.text}>Add Word</Text>
        </TouchableOpacity>

        {levels.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={styles.card}
            // BURASI ÖNEMLİ: 'WordScreen'e giderken { level: lvl } objesini gönderiyoruz
            onPress={() => navigation.navigate('Word', { level: lvl })}
          >
            <Text style={styles.text}>Review Level {lvl}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Archived');
          }}
          style={styles.card}
        >
          <Text style={styles.text}>Archive</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text style={[styles.text, { fontSize: 10, fontWeight: '100' }]}>
          Level1: {getCount(1)} | Level2 : {getCount(2)} | Level3 :{' '}
          {getCount(3)} | Level4 : {getCount(4)} | Level5 : {getCount(5)}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'column',
  },
  text: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  card: {
    backgroundColor: colors.primary,
    width: 150,
    height: 50,
    marginVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: '#66FFFF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 8,
  },
});
export default MenuScreen;
