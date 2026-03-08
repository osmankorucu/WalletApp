import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { useWalletStore } from '../store/walletStore';

export default function AddTransactionScreen({ route, navigation }: any) {
  const { accountId } = route.params || {};
  const { accounts, categories, addTransaction, transactions, settings, autoSuggestCategories } = useWalletStore();

  const [selectedAccountId, setSelectedAccountId] = useState(accountId || (accounts[0]?.id ?? ''));
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCategories = categories.filter(c => c.type === type);

  const transactionSuggestions = useMemo(() => {
    if (!name.trim()) return [];
    const lowerName = name.toLowerCase();
    const uniqueNames = [...new Set(
      transactions
        .filter(t => t.name.toLowerCase().includes(lowerName))
        .map(t => t.name)
    )];
    return uniqueNames.slice(0, 5);
  }, [name, transactions]);

  const handleSave = () => {
    if (!selectedAccountId) {
      Alert.alert('Hata', 'Lütfen bir hesap seçin');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir tutar girin');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen işlem adı girin');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin');
      return;
    }

    addTransaction({
      accountId: selectedAccountId,
      amount: parseFloat(amount.replace(',', '.')),
      type,
      name: name.trim(),
      category: selectedCategory,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
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
          <Text style={styles.title}>Yeni İşlem</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
              Gider
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
              Gelir
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hesap</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
            {accounts.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                style={[styles.accountChip, selectedAccountId === acc.id && styles.accountChipActive]}
                onPress={() => setSelectedAccountId(acc.id)}
              >
                <Text style={styles.accountChipIcon}>{acc.icon}</Text>
                <Text style={[styles.accountChipText, selectedAccountId === acc.id && styles.accountChipTextActive]}>
                  {acc.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tutar</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>İşlem Adı</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (autoSuggestCategories && text.length > 1) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Örn: Market Alışverişi"
            placeholderTextColor="#6B7280"
          />
          {showSuggestions && transactionSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              {transactionSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setName(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categoryGrid}>
            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, selectedCategory === cat.name && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Not (Opsiyonel)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="Açıklama ekle..."
            placeholderTextColor="#6B7280"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>İşlemi Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { fontSize: 16, color: '#6366F1' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#1F2937' },
  typeButtonActive: { backgroundColor: '#EF4444' },
  typeButtonActiveIncome: { backgroundColor: '#22C55E' },
  typeButtonText: { fontSize: 16, fontWeight: '600', color: '#9CA3AF' },
  typeButtonTextActive: { color: '#FFFFFF' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 8 },
  input: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, fontSize: 16, color: '#FFFFFF' },
  noteInput: { height: 80, textAlignVertical: 'top' },
  accountScroll: { marginHorizontal: -4 },
  accountChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 4, borderWidth: 2, borderColor: 'transparent' },
  accountChipActive: { borderColor: '#6366F1', backgroundColor: '#6366F120' },
  accountChipIcon: { fontSize: 16, marginRight: 6 },
  accountChipText: { fontSize: 14, color: '#9CA3AF' },
  accountChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 2, borderColor: 'transparent' },
  categoryChipActive: { borderColor: '#6366F1', backgroundColor: '#6366F120' },
  categoryIcon: { fontSize: 16, marginRight: 6 },
  categoryText: { fontSize: 14, color: '#9CA3AF' },
  categoryTextActive: { color: '#FFFFFF', fontWeight: '600' },
  suggestions: { backgroundColor: '#1F2937', borderRadius: 8, marginTop: 4, overflow: 'hidden' },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#374151' },
  suggestionText: { color: '#FFFFFF', fontSize: 14 },
  saveButton: { backgroundColor: '#6366F1', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
