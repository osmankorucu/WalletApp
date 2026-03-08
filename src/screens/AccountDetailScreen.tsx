import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useWalletStore } from '../store/walletStore';
import { Transaction } from '../types';

export default function AccountDetailScreen({ route, navigation }: any) {
  const { accountId } = route.params;
  const { accounts, getAccountTransactions, settings, deleteTransaction } = useWalletStore();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(true);

  const account = accounts.find((a) => a.id === accountId);
  const currencySymbol = settings.currency === 'TRY' ? '₺' : settings.currency === 'USD' ? '$' : '€';

  const getStartOfMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const transactions = useMemo(() => {
    return getAccountTransactions(
      accountId, 
      getStartOfMonth(selectedMonth), 
      getEndOfMonth(selectedMonth)
    );
  }, [accountId, selectedMonth]);

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#22C55E';
    if (balance < 0) return '#EF4444';
    return '#FFFFFF';
  };

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach((t) => {
      const dateKey = t.date.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }, [transactions]);

  const markedDates = useMemo(() => {
    const marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    transactions.forEach((t) => {
      const dateKey = t.date.split('T')[0];
      marks[dateKey] = { marked: true, dotColor: t.type === 'income' ? '#22C55E' : '#EF4444' };
    });
    marks[selectedMonth] = { ...marks[selectedMonth], selected: true, selectedColor: '#6366F1' };
    return marks;
  }, [transactions, selectedMonth]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!account) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Hesap bulunamadı</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{account.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction', { accountId })}>
          <Text style={styles.addButton}>+ İşlem</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Güncel Bakiye</Text>
        <Text style={[styles.balanceAmount, { color: getBalanceColor(account.balance) }]}>
          {currencySymbol}{account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.calendarToggle}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.calendarToggleText}>
          {showCalendar ? 'Takvimi Gizle' : 'Takvimi Göster'}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          current={selectedMonth}
          onMonthChange={(month) => setSelectedMonth(month.dateString)}
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
      )}

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>
          İşlemler ({transactions.length})
        </Text>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Bu ayda işlem yok</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedTransactions)}
          renderItem={({ item: [date, transList] }) => (
            <View style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              {transList.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={styles.transactionItem}
                  onLongPress={() => deleteTransaction(t.id)}
                >
                  <View style={styles.transactionLeft}>
                    <View style={[styles.typeIcon, { 
                      backgroundColor: t.type === 'income' ? '#22C55E20' : '#EF444420' 
                    }]}>
                      <Text style={styles.typeIconText}>{t.type === 'income' ? '↑' : '↓'}</Text>
                    </View>
                    <View>
                      <Text style={styles.transactionName}>{t.name}</Text>
                      <Text style={styles.transactionCategory}>{t.category}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { 
                      color: t.type === 'income' ? '#22C55E' : '#EF4444' 
                    }]}>
                      {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionTime}>{formatTime(t.date)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={([date]) => date}
          contentContainerStyle={styles.listContent}
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
  backButton: {
    fontSize: 16,
    color: '#6366F1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    fontSize: 16,
    color: '#6366F1',
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  calendarToggle: {
    padding: 16,
    alignItems: 'center',
  },
  calendarToggleText: {
    color: '#6366F1',
    fontSize: 14,
  },
  calendar: {
    borderRadius: 12,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  transactionsHeader: {
    padding: 20,
    paddingTop: 8,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
