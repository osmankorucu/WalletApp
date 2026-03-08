import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { Account } from '../types';

export default function AccountsScreen({ navigation }: any) {
  const { accounts, settings, sortAccountsBy } = useWalletStore();

  const currencySymbol = settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€';

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#22C55E';
    if (balance < 0) return '#EF4444';
    return '#FFFFFF';
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'cash': return 'Nakit';
      case 'bank': return 'Banka Hesabı';
      case 'credit_card': return 'Kredi Kartı';
      default: return type;
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    switch (sortAccountsBy) {
      case 'balance': return b.balance - a.balance;
      case 'createdAt': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return a.name.localeCompare(b.name);
    }
  });

  const renderAccount = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
    >
      <View style={styles.accountLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.accountIcon}>{item.icon}</Text>
        </View>
        <View>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountType}>{getAccountTypeName(item.type)}</Text>
        </View>
      </View>
      <View style={styles.accountRight}>
        <Text style={[styles.balance, { color: getBalanceColor(item.balance) }]}>
          {currencySymbol}{item.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hesaplarım</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAccount')}
        >
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      {accounts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💳</Text>
          <Text style={styles.emptyTitle}>Henüz Hesap Yok</Text>
          <Text style={styles.emptySubtitle}>
            İlk hesabını eklemek için + Ekle butonuna tıkla
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedAccounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountIcon: {
    fontSize: 24,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  accountType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  accountRight: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
