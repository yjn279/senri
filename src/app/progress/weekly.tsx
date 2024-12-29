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
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const BAR_HEIGHT = 24;
const PADDING = 16;
const CHART_WIDTH = width - 120;

export default function WeeklyProgress() {
  const [goals, setGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [currentDate] = useState(new Date());

  const categories = [
    'Health', 'Career', 'Finance', 'Family',
    'Social', 'Personal Growth', 'Recreation', 'Spirituality'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedGoals = await getGoals();
    const savedProgress = await getProgress();
    
    setGoals(savedGoals);
    
    // 仮のデータを生成（実際のアプリでは保存されたデータを使用）
    const mockData = categories.map(category => ({
      category,
      progress: Math.floor(Math.random() * 100)
    }));
    
    setProgressData(mockData);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#4A90E2';
    if (progress >= 40) return '#FF9800';
    if (progress >= 20) return '#FF5722';
    return '#666666';
  };

  const getWeekRange = () => {
    const start = startOfWeek(currentDate, { locale: ja });
    const end = endOfWeek(currentDate, { locale: ja });
    return `${format(start, 'M/d')} 〜 ${format(end, 'M/d')}`;
  };

  const renderProgressBars = () => {
    return progressData.map((data, index) => (
      <View key={data.category} style={styles.barContainer}>
        <Text style={styles.barLabel}>{data.category}</Text>
        <View style={styles.barWrapper}>
          <View 
            style={[
              styles.bar, 
              { 
                width: `${data.progress}%`,
                backgroundColor: getProgressColor(data.progress)
              }
            ]} 
          />
          <Text style={styles.barValue}>{data.progress}%</Text>
        </View>
      </View>
    ));
  };

  const getWeeklyAverage = () => {
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
            {getWeekRange()}の進捗
          </Text>
          <Text style={styles.headerSubtitle}>
            カテゴリーごとの週間達成率を確認できます
          </Text>
        </View>

        <View style={styles.chartContainer}>
          {renderProgressBars()}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>週間平均達成率</Text>
          <Text style={[
            styles.summaryValue,
            { color: getProgressColor(getWeeklyAverage()) }
          ]}>
            {getWeeklyAverage()}%
          </Text>
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>週間目標</Text>
          {goals.map((goal, index) => (
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
  chartContainer: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  barContainer: {
    marginBottom: 16,
  },
  barLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  barValue: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    minWidth: 40,
  },
  summaryCard: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
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
