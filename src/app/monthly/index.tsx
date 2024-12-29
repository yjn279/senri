import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { getGoals, getProgress } from '../../utils/storage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 64) / 7);
const PADDING = 16;

export default function MonthlyProgress() {
  const [monthlyGoals, setMonthlyGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 仮の月間目標データ
    const mockMonthlyGoals = [
      { category: 'Health', goal: '週3回以上のジム通い' },
      { category: 'Career', goal: 'オンライン講座の修了' },
      { category: 'Finance', goal: '月の支出を10%削減' },
      { category: 'Family', goal: '週末の家族行事を計画' },
      { category: 'Social', goal: '友人との定期的な交流' },
      { category: 'Personal Growth', goal: '新しい資格の取得' },
      { category: 'Recreation', goal: '新しい趣味を始める' },
      { category: 'Spirituality', goal: 'マインドフルネスの習慣化' }
    ];
    setMonthlyGoals(mockMonthlyGoals);
    
    // 月間の進捗データを生成
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const mockData = days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      progress: Math.floor(Math.random() * 100)
    }));
    
    setProgressData(mockData);
  };

  const getProgressOpacity = (progress: number) => {
    return (progress / 100) * 0.9 + 0.1; // 最小値を0.1にして完全な透明を避ける
  };

  const renderCalendar = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const firstDayOfWeek = startDate.getDay();

    // 曜日の表示
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekDayLabels = weekDays.map((day, index) => (
      <SvgText
        key={`weekday-${index}`}
        x={PADDING + CELL_SIZE * index + CELL_SIZE / 2}
        y={PADDING}
        fill="#fff"
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {day}
      </SvgText>
    ));

    // 日付とヒートマップの表示
    const cells = days.map((day, index) => {
      const row = Math.floor((index + firstDayOfWeek) / 7);
      const col = (index + firstDayOfWeek) % 7;
      const dayProgress = progressData.find(p => p.date === format(day, 'yyyy-MM-dd'));
      const progress = dayProgress?.progress || 0;

      return (
        <View key={`day-${index}`}>
          <Rect
            x={PADDING + col * CELL_SIZE}
            y={PADDING * 2 + row * CELL_SIZE}
            width={CELL_SIZE - 2}
            height={CELL_SIZE - 2}
            fill="#4A90E2"
            opacity={getProgressOpacity(progress)}
          />
          <SvgText
            x={PADDING + col * CELL_SIZE + CELL_SIZE / 2}
            y={PADDING * 2 + row * CELL_SIZE + CELL_SIZE / 2}
            fill="#fff"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {format(day, 'd')}
          </SvgText>
        </View>
      );
    });

    return (
      <Svg width={width - 32} height={CELL_SIZE * 7}>
        {weekDayLabels}
        {cells}
      </Svg>
    );
  };

  const getMonthlyAverage = () => {
    if (progressData.length === 0) return 0;
    return Math.round(
      progressData.reduce((acc, curr) => acc + curr.progress, 0) / 
      progressData.length
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {format(currentDate, 'yyyy年M月', { locale: ja })}
          </Text>
          <Text style={styles.headerSubtitle}>
            月間の達成状況をカレンダーで確認できます
          </Text>
        </View>

        <View style={styles.averageSection}>
          <Text style={styles.averageLabel}>総合達成率</Text>
          <Text style={styles.averageValue}>{getMonthlyAverage()}%</Text>
        </View>

        <View style={styles.calendarContainer}>
          {renderCalendar()}
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>月間目標</Text>
          {monthlyGoals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalCategory}>{goal.category}</Text>
              <Text style={styles.goalText}>{goal.goal}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: 16,
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
  averageSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2f353a',
    borderRadius: 12,
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  averageValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  calendarContainer: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  goalsContainer: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalCategory: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
}); 
