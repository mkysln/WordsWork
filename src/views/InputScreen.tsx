// oxlint-disable no-unused-vars
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../schema/navigation';
import colors from '../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BSON } from 'realm';
import { Picker } from '@react-native-picker/picker';
import { WordRealmContext } from '../schema/realmConfig';

type Props = NativeStackScreenProps<RootStackParamList, 'Input'>;
const { useQuery, useRealm } = WordRealmContext;
export default function InputScreen({ navigation }: Props) {
  const [enWord, setEnWord] = useState('');
  const [trWord, setTrWord] = useState('');
  const [level, setLevel] = useState(1);
  const realm = useRealm();
  const handleAddWord = () => {
    if (!enWord.trim() || !trWord.trim()) {
      Alert.alert('Warning!', 'Fields cannot be left blank');
      return;
    }

    try {
      realm.write(() => {
        realm.create('Word', {
          _id: new BSON.ObjectId(),
          english: enWord.trim(),
          turkish: trWord.trim(),
          level: level,
          isArchived: false,
          createdAt: new Date(),
        });
      });
      setEnWord('');
      setTrWord('');
      setLevel(1);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.tfdirection}>
          <TextInput
            style={styles.textfield}
            value={enWord}
            onChangeText={setEnWord}
            placeholder="ENG"
            returnKeyType="next"
          />
          <TextInput
            style={styles.textfield}
            value={trWord}
            onChangeText={setTrWord}
            placeholder="TR"
            returnKeyType="next"
          />
          <View
            style={{
              width: 80,
              borderWidth: 1,
              borderColor: colors.secondary,
              backgroundColor: colors.primary,
              borderRadius: 10,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <Picker
              selectedValue={level}
              onValueChange={(itemValue) => setLevel(itemValue)}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.saveBtn,
            (!enWord.trim() || !trWord.trim()) && {
              opacity: 0.5,
            },
          ]}
          disabled={!enWord.trim() || !trWord.trim()}
          onPress={handleAddWord}
        >
          <Text style={styles.saveBtnText}>Save The Word</Text>
          <Ionicons
            name={'push-outline'}
            style={{ transform: [{ rotate: '180deg' }] }}
            color={colors.textPrimary}
            size={15}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: colors.textPrimary,
  },
  container: {
    width: '100%',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textfield: {
    borderWidth: 1,
    borderColor: colors.secondary,
    width: 100,
    height: 50,
    borderRadius: 10,
    elevation: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    color: colors.textSecondary,
  },
  tfdirection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    height: '15%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    flexDirection: 'row',
  },
  saveBtnText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 10,
    padding: 3,
  },
});
/*{
          <TextInput
            style={styles.textfield}
            value={level}
            onChangeText={(v) => {
              const cleaned = v.replace(/[^0-9]/g, '');

              if (cleaned === '') {
                setLevel('');
                return;
              }

              const num = parseInt(cleaned, 10);
              if (num >= 1 && num <= 5) {
                setLevel(cleaned);
              }
            }}
            placeholder="Level"
            keyboardType="numeric"
            returnKeyType="next"
          />
          }*/
