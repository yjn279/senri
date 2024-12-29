import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Link } from 'expo-router';

type Period = 'lifetime' | 'yearly' | 'monthly' | 'weekly' | 'daily';

export default function Progress() {
  const periods: { id: Period; title: string; description: string }[] = [
    {
      id: 'lifetime',
      title: '生涯目標の進捗',
      description: 'カテゴリごとの達成状況をレーダーチャートで確認'
    },
    {
      id: 'yearly',
      title: '年間の進捗',
      description: 'カテゴリごとの年間達成率を積み上げグラフで確認'
    },
    {
      id: 'monthly',
      title: '月間の進捗',
      description: '月間カレンダーで日々の達成率をヒートマップ表示'
    },
    {
      id: 'weekly',
      title: '週間の進捗',
      description: 'カテゴリごとの週間達成率を横棒グラフで確認'
    },
    {
      id: 'daily',
      title: '本日の進捗',
      description: 'カテゴリごとの本日の達成状況を確認'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>進捗管理</Text>
          <Text style={styles.headerSubtitle}>
            期間を選択して進捗状況を確認できます
          </Text>
        </View>

        {periods.map(period => (
          <Link
            key={period.id}
            href={`/progress/${period.id}`}
            asChild
          >
            <TouchableOpacity style={styles.periodCard}>
              <Text style={styles.periodTitle}>{period.title}</Text>
              <Text style={styles.periodDescription}>{period.description}</Text>
              <View style={styles.arrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2f353a',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  periodCard: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  periodDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  arrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  arrowText: {
    color: '#4A90E2',
    fontSize: 24,
  },
}); 
