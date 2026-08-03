/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../assets/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../schema/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WordRealmContext } from '../schema/realmConfig';
import { Word } from '../schema/database';
import { Divider } from 'react-native-paper';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { BlurView } from '@react-native-community/blur';

type Props = NativeStackScreenProps<RootStackParamList, 'Archived'>;

const { useQuery, useRealm } = WordRealmContext;

export default function ArchivedScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [randomWord, setRandomWord] = useState<Word | null>(null);
  const [showTurkish, setShowTurkish] = useState(false);
  const realm = useRealm();

  // Arşivlenmiş kelimeleri çekiyoruz
  const words = useQuery(Word)
    .filtered('isArchived == true')
    .sorted('english', false);

  // Arşivden Çıkarma Fonksiyonu (Seviye 5 olarak geri döner)
  const unarchiveWord = (item: Word) => {
    realm.write(() => {
      item.isArchived = false;
      item.level = 1;
    });
  };

  // Silme Fonksiyonu (Onay mekanizmalı)
  const deleteWord = (item: Word) => {
    Alert.alert(
      'Delete Permanent',
      'Are you sure you want to delete this word?',
      [
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
      ],
    );
  };
  // --- FLASHCARD FONKSİYONLARI ---
  const handleRandomCard = () => {
    if (words.length === 0) {
      Alert.alert('Empty', 'Your archive is empty.');
      return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
    setShowTurkish(false);
    setModalVisible(true);
  };
  // Arşiv Modalı: Kullanıcı DOĞRU bildiyse
  const handleCorrect = () => {
    // Arşivdeki kelimeyi bildiği için şimdilik sadece sıradaki karta geçiyoruz.
    // İsterseniz burada 'bilinme sayısını' artıracak bir field ekleyebilirsiniz.
    handleNextCard();
  };

  // Arşiv Modalı: Kullanıcı YANLIŞ bildiyse
  const handleIncorrect = (item: Word) => {
    // Opsiyonel: Eğer yanlış bildiyse arşivden çıkarıp Level 1'e geri göndermek isterseniz:

    realm.write(() => {
      item.isArchived = false;
      item.level = 1;
    });
    /*
    setModalVisible(false); // Kelime listeden kaybolacağı için modalı kapatmak mantıklı olur
    */

    // Şimdilik sadece sıradaki karta geçiyoruz:
    handleNextCard();
  };
  const handleNextCard = () => {
    if (words.length === 0) {
      setModalVisible(false);
      return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    setRandomWord(words[randomIndex]);
    setShowTurkish(false);
  };
  const renderWordItem = ({ item }: { item: Word }) => {
    // Arşiv sayfası için menü seçenekleri
    const menuOptions = [
      { label: 'Unarchive', value: 'unarchive', icon: 'archive-outline' },
      { label: 'Delete', value: 'delete', icon: 'trash-outline' },
    ];

    return (
      <View style={styles.card}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          data={menuOptions}
          labelField="label"
          valueField="value"
          placeholder=""
          onChange={(record) => {
            if (record.value === 'unarchive') unarchiveWord(item);
            if (record.value === 'delete') deleteWord(item);
          }}
          renderRightIcon={() => (
            <View style={styles.optionButtonPlaceholder}>
              <Text style={styles.optionText}>Options</Text>
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
        <Divider style={styles.cardDivider} />
        <Text style={styles.turkishText}>{item.turkish}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
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
            />
            <Text style={styles.emptyText}>Archive is empty</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // Kartlar arası boşluk
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity style={styles.fab} onPress={handleRandomCard}>
        <Ionicons name="create-outline" color="white" size={30} />
      </TouchableOpacity>

      {/* FLASHCARD MODAL */}
      {/* FLASHCARD MODAL */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <BlurView style={styles.absolute} blurType="light" blurAmount={7} />
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
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
                <Text style={styles.modalLabel}>ARCHIVE REVIEW</Text>
                <Text style={styles.modalEnglishText}>
                  {randomWord.english}
                </Text>
                <Divider style={styles.modalDivider} />

                {!showTurkish ? (
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
                  <View style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.modalTurkishText}>
                      {randomWord.turkish}
                    </Text>

                    <Text
                      style={{ color: colors.textSecondary, marginBottom: 10 }}
                    >
                      Did you remember this?
                    </Text>

                    <View style={styles.actionButtonsContainer}>
                      {/* ❌ YANLIŞ BUTONU */}
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: '#ff4444' },
                        ]}
                        onPress={() => handleIncorrect(randomWord)}
                      >
                        <Ionicons
                          name="close-outline"
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>

                      {/* ✅ DOĞRU BUTONU */}
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
}

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
    elevation: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  englishText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  turkishText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  cardDivider: {
    backgroundColor: colors.secondary,
    height: 1.5,
    marginVertical: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 90,
    zIndex: 100,
  },
  dropdownContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    width: 150,
  },
  optionButtonPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionText: {
    color: colors.textPrimary,
    marginRight: 5,
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginTop: 10,
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
});
