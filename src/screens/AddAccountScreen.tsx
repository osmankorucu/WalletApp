import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { AccountType } from '../types';

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: string }[] = [
  { type: 'cash', label: 'Nakit', icon: '💵' },
  { type: 'bank', label: 'Banka Hesabı', icon: '🏦' },
  { type: 'credit_card', label: 'Kredi Kartı', icon: '💳' },
];

const COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#F97316'];
const ICONS = ['💵', '🏦', '💳', '🏠', '🚗', '✈️', '🎮', '📱', '👗', '🎁'];

export default function AddAccountScreen({ navigation }: any) {
  const { addAccount, settings } = useWalletStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('cash');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [initialBalance, setInitialBalance] = useState('0');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen bir hesap adı girin');
      return;
    }

    const balance = parseFloat(initialBalance.replace(',', '.')) || 0;

    addAccount({
      name: name.trim(),
      type,
      balance,
      color,
      icon,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Yeni Hesap</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hesap Adı</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Örn: İş Bankası"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hesap Türü</Text>
            <View style={styles.typeContainer}>
              {ACCOUNT_TYPES.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={[styles.typeButton, type === item.type && styles.typeButtonActive]}
                  onPress={() => setType(item.type)}
                >
                  <Text style={styles.typeIcon}>{item.icon}</Text>
                  <Text style={[styles.typeLabel, type === item.type && styles.typeLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>İkon</Text>
            <View style={styles.iconGrid}>
              {ICONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.iconButton, icon === item && styles.iconButtonActive]}
                  onPress={() => setIcon(item)}
                >
                  <Text style={styles.iconText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Renk</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.colorButton, { backgroundColor: item }, color === item && styles.colorButtonActive]}
                  onPress={() => setColor(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Başlangıç Bakiyesi</Text>
            <TextInput
              style={styles.input}
              value={initialBalance}
              onChangeText={setInitialBalance}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#6B7280"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Hesabı Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    color: '#6366F1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F120',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  typeLabelActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonActive: {
    borderColor: '#6366F1',
  },
  iconText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
