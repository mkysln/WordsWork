/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../schema/navigation';
import { WordRealmContext } from '../schema/realmConfig';
import { Word } from '../schema/database';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from 'react-native-paper';
import colors from '../assets/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BlurView } from '@react-native-community/blur';
import { Dropdown } from 'react-native-element-dropdown';

type Props = NativeStackScreenProps<RootStackParamList, 'Word'>;

const { useQuery, useRealm } = WordRealmContext;

const WordScreen = ({ route, navigation }: Props) => {
  const realm = useRealm();
  const { level } = route.params;

  // --- STATE TANIMLAMALARI ---
  const [modalVisible, setModalVisible] = useState(false);
  const [randomWord, setRandomWord] = useState<Word | null>(null);
  const [showTurkish, setShowTurkish] = useState(false);
  // --- VERİ ÇEKME ---
  const words = useQuery(Word)
    .filtered(`level == $0 && isArchived == false`, level)
    .sorted('english', false);

  // --- FONKSİYONLAR ---
  // 1. Level Yükseltme
  const updateLevel = (item: Word) => {
    realm.write(() => {
      if (item.level !== 5) {
        item.level += 1;
      } else {
        item.isArchived = true;
      }
    });
  };

  // 2. Level Düşürme
  const decreaseLevel = (item: Word) => {
    realm.write(() => {
      if (item.level > 1) {
        item.level -= 1;
      }
    });
  };

  // 3. Silme
  const deleteWord = (item: Word) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          realm.write(() => {
            realm.delete(item);
          });
        },
      },
    ]);
  };

  // 4. Rastgele Kart Seçme (FAB Butonu için)
  const handleRandomCard = () => {
    if (words.length === 0) {
      Alert.alert('Empty', 'There are no words in this level to review.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
    setShowTurkish(false); // Cevabı gizle
    setModalVisible(true); // Modalı aç
  };

  // 5. Kart açıkken sıradaki kelimeye geçme
  const handleNextCard = () => {
    if (words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
    setShowTurkish(false);
  };
  // KULLANICI DOĞRU BİLDİYSE
  const handleCorrect = () => {
    if (!randomWord) return;

    realm.write(() => {
      // Eğer seviye 5 değilse arttır, 5 ise arşivle
      if (randomWord.level < 5) {
        randomWord.level += 1;
      } else {
        randomWord.isArchived = true;
      }
    });

    // İşlem bitince hemen sonraki karta geç
    handleNextCard();
  };

  // KULLANICI YANLIŞ BİLDİYSE
  // KULLANICI YANLIŞ BİLDİYSE
  const handleIncorrect = () => {
    if (!randomWord) return;

    realm.write(() => {
      // Yanlış bilindiğinde seviyeyi 1'e düşürür
      randomWord.level = 1;
    });

    // Sonraki karta geç
    handleNextCard();
  };

  // --- LİSTE ELEMANI ---
  const renderWordItem = ({ item }: { item: Word }) => {
    const id = item._id.toHexString();
    const menuOptions = [
      { label: 'Level Up', value: 'up', icon: 'caret-up-outline' },
      ...(item.level > 1
        ? [
            {
              label: 'Level Down',
              value: 'down',
              icon: 'caret-down-outline',
            },
          ]
        : []),
      { label: 'Delete', value: 'delete', icon: 'trash-outline' },
    ];
    return (
      <View style={styles.card}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          data={menuOptions}
          onChange={(record) => {
            if (record.value === 'up') updateLevel(item);
            if (record.value === 'down') decreaseLevel(item);
            if (record.value === 'delete') deleteWord(item);
          }}
          labelField={'label'}
          valueField={'value'}
          placeholder=""
          renderRightIcon={() => (
            <View style={styles.optionButtonPlaceholder}>
              <Text
                style={{
                  color: colors.textPrimary,
                  marginRight: 5,
                  fontSize: 12,
                }}
              >
                Options
              </Text>
              <Ionicons
                name="caret-down-outline"
                size={14}
                color={colors.textPrimary}
              />
            </View>
          )}
          renderItem={(menuItem) => (
            <View style={styles.menuItem}>
              <Ionicons
                name={menuItem.icon as any}
                size={18}
                color={
                  menuItem.value === 'delete' ? '#ff4444' : colors.textPrimary
                }
              />
              <Text
                style={[
                  styles.menuText,
                  menuItem.value === 'delete' && { color: '#ff4444' },
                ]}
              >
                {menuItem.label}
              </Text>
            </View>
          )}
        />

        <Text style={styles.englishText}>{item.english}</Text>
        <Divider
          style={{
            backgroundColor: colors.secondary,
            height: 2,
            width: '100%',
            marginTop: 2,
            marginBottom: 2,
            elevation: 14,
            shadowColor: colors.secondary,
          }}
        />
        <Text style={styles.turkishText}>{item.turkish}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={words}
          keyExtractor={(item) => item._id.toHexString()}
          renderItem={renderWordItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="planet-outline"
                color={colors.textPrimary}
                size={150}
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.emptyText}>This level is empty</Text>
            </View>
          }
          ItemSeparatorComponent={
            <Divider style={{ backgroundColor: colors.secondary, height: 1 }} />
          }
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        />
      </View>

      {/* FAB BUTONU */}
      <TouchableOpacity style={styles.fab} onPress={handleRandomCard}>
        <Ionicons name="create-outline" color="white" size={30} />
      </TouchableOpacity>

      {/* --- FLASHCARD MODAL (AÇILIR PENCERE) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={7}
          reducedTransparencyFallbackColor="blue"
        />
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Kapatma Butonu */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons
                name="close-circle"
                size={35}
                color={colors.secondary}
              />
            </TouchableOpacity>

            {randomWord && (
              <>
                <Text style={styles.modalLabel}>WHAT IS THIS WORD?</Text>
                <Text style={styles.modalEnglishText}>
                  {randomWord.english}
                </Text>

                <Divider style={styles.modalDivider} />
                {!showTurkish ? (
                  // "Cevabı Gör" Butonu
                  <TouchableOpacity
                    style={styles.revealButton}
                    onPress={() => setShowTurkish(true)}
                  >
                    <Text style={styles.revealButtonText}>Show Answer</Text>
                    <Ionicons
                      name="eye-outline"
                      size={20}
                      color="white"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                ) : (
                  // CEVAP GÖRÜNDÜĞÜNDE ÇIKACAK OLAN BUTONLAR
                  <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.modalTurkishText}>
                      {randomWord?.turkish}
                    </Text>

                    <Text
                      style={{ color: colors.textSecondary, marginBottom: 10 }}
                    >
                      Did you know this?
                    </Text>

                    {/* YAN YANA İKİ BUTON İÇİN CONATINER */}
                    <View style={styles.actionButtonsContainer}>
                      {/* ❌ YANLIŞ (FALSE) BUTONU */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: '#ff4444' },
                        ]}
                        onPress={handleIncorrect}
                      >
                        <Ionicons
                          name="close-outline"
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>

                      {/* ✅ DOĞRU (TRUE) BUTONU */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: '#00C851' },
                        ]}
                        onPress={handleCorrect}
                      >
                        <Ionicons
                          name="checkmark-outline"
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 15 },
  card: {
    position: 'relative',
    backgroundColor: colors.background,
    width: '100%',
    padding: 20,
    paddingTop: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 14,
    shadowColor: colors.secondary,
    shadowOffset: { width: 2, height: 10 },
  },
  englishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  turkishText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 30,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  // FAB STİLLERİ
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 999,
  },
  // MODAL STİLLERİ
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalEnglishText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  modalDivider: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.secondary,
    height: 1,
  },
  modalTurkishText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700', // Altın Sarısı
    textAlign: 'center',
    marginBottom: 20,
  },
  revealButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  revealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row', // Yan yana dizmek için
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
    gap: 15, // Butonlar arası boşluk
  },
  actionButton: {
    flex: 1, // Eşit genişlikte olmaları için
    flexDirection: 'column', // İkon üstte yazı altta olsun
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  optionButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
    padding: 3.5,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 14,
    shadowColor: 'orange',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 90, // Buton genişliği
    zIndex: 100,
  },
  dropdownContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    width: 140, // Açılan menü genişliği
  },
  optionButtonPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});

export default WordScreen;
