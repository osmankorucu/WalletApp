import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useWalletStore } from '../store/walletStore';

const ACCOUNTS_DATA = [
  { key: 'home', icon: '🏠', title: 'Hesaplarım', route: 'Accounts' },
  { key: 'daily', icon: '📋', title: 'Günlük', route: 'Daily' },
  { key: 'stats', icon: '📊', title: 'İstatistik', route: 'Statistics' },
  { key: 'settings', icon: '⚙️', title: 'Ayarlar', route: 'Settings' },
];

export default function HomeScreen({ navigation }: any) {
  const { accounts, getTotalBalance, settings, loadData, isLoading } = useWalletStore();

  useEffect(() => {
    loadData();
  }, []);

  const totalBalance = getTotalBalance();
  const currencySymbol = settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€';

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#22C55E';
    if (balance < 0) return '#EF4444';
    return '#FFFFFF';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Cüzdan</Text>
          <Text style={styles.subtitle}>Para takibini kolaylaştır</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Toplam Bakiye</Text>
          <Text style={[styles.balanceAmount, { color: getBalanceColor(totalBalance) }]}>
            {currencySymbol}{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.menuGrid}>
          {ACCOUNTS_DATA.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.accountsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hesaplarım</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style={styles.seeAll}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {accounts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyText}>Henüz hesap eklenmemiş</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Accounts', { screen: 'AddAccount' })}
              >
                <Text style={styles.addButtonText}>+ Hesap Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            accounts.slice(0, 3).map((account) => (
              <TouchableOpacity
                key={account.id}
                style={styles.accountItem}
                onPress={() => navigation.navigate('Accounts', { 
                  screen: 'AccountDetail',
                  params: { accountId: account.id }
                })}
              >
                <View style={styles.accountInfo}>
                  <Text style={styles.accountIcon}>{account.icon}</Text>
                  <View>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountType}>
                      {account.type === 'cash' ? 'Nakit' : 
                       account.type === 'bank' ? 'Banka' : 'Kredi Kartı'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.accountBalance, { color: getBalanceColor(account.balance) }]}>
                  {currencySymbol}{account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </Text>
              </TouchableOpacity>
            ))
          )}
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
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  accountsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1F2937',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  accountType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
});
