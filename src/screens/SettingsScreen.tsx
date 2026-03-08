import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, Alert } from 'react-native';
import { useWalletStore } from '../store/walletStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCIES = [
  { code: 'TRY', symbol: '₺', name: 'Türk Lirası' },
  { code: 'USD', symbol: '$', name: 'Amerikan Doları' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

const THEMES = [
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Karanlık' },
  { value: 'system', label: 'Sistem' },
];

const FONT_SIZES = [
  { value: 'small', label: 'Küçük' },
  { value: 'medium', label: 'Orta' },
  { value: 'large', label: 'Büyük' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'İsme Göre' },
  { value: 'balance', label: 'Bakiyeye Göre' },
  { value: 'createdAt', label: 'Tarihe Göre' },
];

export default function SettingsScreen() {
  const { settings, updateSettings, accounts, transactions, categories } = useWalletStore();

  const handleExportData = () => {
    const data = JSON.stringify({ accounts, transactions, categories, settings }, null, 2);
    Alert.alert('Veri Dışa Aktarım', 'Veriler JSON formatında hazırlandı. (Gerçek uygulamada dosya olarak kaydedilecek)', [
      { text: 'Tamam' }
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Verileri Temizle',
      'Tüm verileriniz silinecek. Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Temizle', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Başarılı', 'Tüm veriler temizlendi. Uygulamayı yeniden başlatın.');
          }
        }
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const SettingRow = ({ label, value, onPress, isLast }: { label: string; value?: string; onPress?: () => void; isLast?: boolean }) => (
    <TouchableOpacity style={[styles.settingRow, !isLast && styles.settingRowBorder]} onPress={onPress} disabled={!onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
    </TouchableOpacity>
  );

  const SettingSwitch = ({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (val: boolean) => void }) => (
    <View style={[styles.settingRow, styles.settingRowBorder]}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#374151', true: '#6366F1' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const handleCurrencySelect = () => {
    Alert.alert(
      'Para Birimi',
      'Para biriminizi seçin',
      CURRENCIES.map(c => ({
        text: `${c.symbol} ${c.name}`,
        onPress: () => updateSettings({ currency: c.code })
      }))
    );
  };

  const handleThemeSelect = () => {
    Alert.alert(
      'Tema',
      'Tema seçin',
      THEMES.map(t => ({
        text: t.label,
        onPress: () => updateSettings({ theme: t.value as 'light' | 'dark' | 'system' })
      }))
    );
  };

  const handleFontSizeSelect = () => {
    Alert.alert(
      'Yazı Boyutu',
      'Yazı boyutunu seçin',
      FONT_SIZES.map(f => ({
        text: f.label,
        onPress: () => updateSettings({ fontSize: f.value as 'small' | 'medium' | 'large' })
      }))
    );
  };

  const handleSortSelect = () => {
    Alert.alert(
      'Hesap Sıralama',
      'Hesapları nasıl sıralamak istersiniz?',
      SORT_OPTIONS.map(s => ({
        text: s.label,
        onPress: () => updateSettings({ sortAccountsBy: s.value as 'name' | 'balance' | 'createdAt' })
      }))
    );
  };

  const currentCurrency = CURRENCIES.find(c => c.code === settings.currency);
  const currentTheme = THEMES.find(t => t.value === settings.theme);
  const currentFontSize = FONT_SIZES.find(f => f.value === settings.fontSize);
  const currentSort = SORT_OPTIONS.find(s => s.value === settings.sortAccountsBy);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayarlar</Text>
        </View>

        <SettingSection title="Hesap Yönetimi">
          <SettingRow 
            label="Para Birimi" 
            value={`${currentCurrency?.symbol} ${currentCurrency?.name}`} 
            onPress={handleCurrencySelect} 
          />
          <SettingRow 
            label="Hesap Sıralama" 
            value={currentSort?.label} 
            onPress={handleSortSelect} 
          />
        </SettingSection>

        <SettingSection title="İşlem Ayarları">
          <SettingSwitch
            label="Otomatik Kategori Önerisi"
            value={settings.autoSuggestCategories}
            onValueChange={(val) => updateSettings({ autoSuggestCategories: val })}
          />
        </SettingSection>

        <SettingSection title="Görünüm">
          <SettingRow label="Tema" value={currentTheme?.label} onPress={handleThemeSelect} />
          <SettingRow label="Yazı Boyutu" value={currentFontSize?.label} onPress={handleFontSizeSelect} />
        </SettingSection>

        <SettingSection title="Veri">
          <SettingRow label="Verileri Dışa Aktar" value="" onPress={handleExportData} />
          <SettingRow label="Verileri Temizle" value="" onPress={handleClearData} isLast />
        </SettingSection>

        <SettingSection title="Güvenlik">
          <SettingSwitch
            label="Biyometrik Kilit"
            value={settings.biometricEnabled}
            onValueChange={(val) => updateSettings({ biometricEnabled: val })}
          />
        </SettingSection>

        <SettingSection title="Bildirimler">
          <SettingSwitch
            label="Bütçe Uyarıları"
            value={settings.budgetAlerts}
            onValueChange={(val) => updateSettings({ budgetAlerts: val })}
          />
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WalletApp v1.0.0</Text>
          <Text style={styles.footerText}>Tüm hakları saklıdır.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', marginBottom: 8, textTransform: 'uppercase' },
  sectionContent: { backgroundColor: '#1F2937', borderRadius: 16, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingLabel: { fontSize: 16, color: '#FFFFFF' },
  settingValue: { fontSize: 14, color: '#9CA3AF' },
  footer: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  footerText: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
});
