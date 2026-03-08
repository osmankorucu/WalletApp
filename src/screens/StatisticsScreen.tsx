import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useWalletStore } from '../store/walletStore';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { accounts, transactions, settings } = useWalletStore();
  const currencySymbol = settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€';

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { totalIncome, totalExpense, net: totalIncome - totalExpense, topCategories };
  }, [transactions]);

  const accountBalances = useMemo(() => {
    return accounts
      .map(a => ({ name: a.name, balance: a.balance, icon: a.icon }))
      .sort((a, b) => b.balance - a.balance);
  }, [accounts]);

  const maxCategoryAmount = stats.topCategories[0]?.[1] || 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>İstatistik</Text>
          <Text style={styles.subtitle}>Bu Ay</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Toplam Gelir</Text>
              <Text style={[styles.summaryAmount, { color: '#22C55E' }]}>
                +{currencySymbol}{stats.totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Toplam Gider</Text>
              <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>
                -{currencySymbol}{stats.totalExpense.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.netRow}>
            <Text style={styles.netLabel}>Net</Text>
            <Text style={[styles.netAmount, { color: stats.net >= 0 ? '#22C55E' : '#EF4444' }]}>
              {stats.net >= 0 ? '+' : ''}{currencySymbol}{stats.net.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategorilere Göre Harcamalar</Text>
          {stats.topCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Veri yok</Text>
            </View>
          ) : (
            stats.topCategories.map(([category, amount], index) => {
              const percentage = (amount / maxCategoryAmount) * 100;
              return (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryAmount}>
                      {currencySymbol}{amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: COLORS[index % COLORS.length] }]} />
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap Bakiyeleri</Text>
          {accountBalances.map((acc) => (
            <View key={acc.name} style={styles.accountItem}>
              <View style={styles.accountLeft}>
                <Text style={styles.accountIcon}>{acc.icon}</Text>
                <Text style={styles.accountName}>{acc.name}</Text>
              </View>
              <Text style={[styles.accountBalance, { color: acc.balance >= 0 ? '#22C55E' : '#EF4444' }]}>
                {currencySymbol}{acc.balance.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  summaryCard: { backgroundColor: '#1F2937', borderRadius: 16, padding: 20, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', marginBottom: 16 },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  summaryAmount: { fontSize: 20, fontWeight: 'bold' },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151', paddingTop: 16 },
  netLabel: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  netAmount: { fontSize: 24, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
  categoryItem: { marginBottom: 16 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryName: { fontSize: 14, color: '#FFFFFF' },
  categoryAmount: { fontSize: 14, color: '#9CA3AF' },
  progressBar: { height: 8, backgroundColor: '#374151', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  accountItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 12, padding: 16, marginBottom: 8 },
  accountLeft: { flexDirection: 'row', alignItems: 'center' },
  accountIcon: { fontSize: 24, marginRight: 12 },
  accountName: { fontSize: 16, color: '#FFFFFF' },
  accountBalance: { fontSize: 16, fontWeight: '600' },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#9CA3AF' },
});
