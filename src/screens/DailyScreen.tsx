import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useWalletStore } from '../store/walletStore';
import { Transaction } from '../types';

export default function DailyScreen() {
  const { transactions, accounts, settings } = useWalletStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const currencySymbol = settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€';

  const dailyTransactions = useMemo(() => {
    return transactions
      .filter(t => t.date.split('T')[0] === selectedDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  const dailySummary = useMemo(() => {
    const income = dailyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dailyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [dailyTransactions]);

  const markedDates = useMemo(() => {
    const marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    transactions.forEach((t) => {
      const dateKey = t.date.split('T')[0];
      marks[dateKey] = { marked: true, dotColor: '#6366F1' };
    });
    marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#6366F1' };
    return marks;
  }, [transactions, selectedDate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getAccountName = (accountId: string) => {
    return accounts.find(a => a.id === accountId)?.name || 'Bilinmiyor';
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.typeIcon, { backgroundColor: item.type === 'income' ? '#22C55E20' : '#EF444420' }]}>
          <Text style={styles.typeIconText}>{item.type === 'income' ? '↑' : '↓'}</Text>
        </View>
        <View>
          <Text style={styles.transactionName}>{item.name}</Text>
          <Text style={styles.transactionMeta}>
            {getAccountName(item.accountId)} • {item.category}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: item.type === 'income' ? '#22C55E' : '#EF4444' }]}>
          {item.type === 'income' ? '+' : '-'}{currencySymbol}{item.amount.toFixed(2)}
        </Text>
        {item.note && <Text style={styles.transactionNote} numberOfLines={1}>{item.note}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Günlük</Text>
        <Text style={styles.subtitle}>{formatDate(selectedDate)}</Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#1F2937',
          calendarBackground: '#1F2937',
          textSectionTitleColor: '#9CA3AF',
          selectedDayBackgroundColor: '#6366F1',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#6366F1',
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#4B5563',
          dotColor: '#6366F1',
          monthTextColor: '#FFFFFF',
          arrowColor: '#6366F1',
        }}
        style={styles.calendar}
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gelir</Text>
          <Text style={[styles.summaryAmount, { color: '#22C55E' }]}>
            +{currencySymbol}{dailySummary.income.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gider</Text>
          <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>
            -{currencySymbol}{dailySummary.expense.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Net</Text>
          <Text style={[styles.summaryAmount, { color: dailySummary.net >= 0 ? '#22C55E' : '#EF4444' }]}>
            {dailySummary.net >= 0 ? '+' : ''}{currencySymbol}{dailySummary.net.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>İşlemler ({dailyTransactions.length})</Text>
      </View>

      {dailyTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Bu günde işlem yok</Text>
        </View>
      ) : (
        <FlatList
          data={dailyTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  calendar: { borderRadius: 12, marginHorizontal: 12 },
  summaryCard: { flexDirection: 'row', margin: 20, backgroundColor: '#1F2937', borderRadius: 16, padding: 16 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  summaryAmount: { fontSize: 14, fontWeight: '600' },
  summaryDivider: { width: 1, backgroundColor: '#374151', marginVertical: 4 },
  transactionsHeader: { paddingHorizontal: 20, marginBottom: 8 },
  transactionsTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  listContent: { padding: 20, paddingTop: 0 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 12, padding: 12, marginBottom: 8 },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  typeIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  typeIconText: { fontSize: 18, fontWeight: 'bold' },
  transactionName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  transactionMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 14, fontWeight: '600' },
  transactionNote: { fontSize: 10, color: '#6B7280', marginTop: 2, maxWidth: 100 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
});
