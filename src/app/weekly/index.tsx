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
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 240;
const CHART_PADDING = 20;
const BAR_HEIGHT = 24;
const BAR_MARGIN = 8;

export default function WeeklyProgress() {
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [currentDate] = useState(new Date());

  const categories = [
    'Health', 'Career', 'Finance', 'Family',
    'Social', 'Personal Growth', 'Recreation', 'Spirituality'
  ] as const;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 仮の週間目標データ
    const mockWeeklyGoals = [
      { category: 'Health', goal: '毎日30分のジョギング' },
      { category: 'Career', goal: '新しい技術の学習を3時間' },
      { category: 'Finance', goal: '支出を記録する' },
      { category: 'Family', goal: '家族との夕食を3回' },
      { category: 'Social', goal: '友人とビデオ通話' },
      { category: 'Personal Growth', goal: '本を1冊読む' },
      { category: 'Recreation', goal: '趣味の時間を確保' },
      { category: 'Spirituality', goal: '毎朝10分の瞑想' }
    ];
    setWeeklyGoals(mockWeeklyGoals);
    
    // 1週間分の進捗データを生成
    const start = startOfWeek(currentDate, { locale: ja });
    const end = endOfWeek(currentDate, { locale: ja });
    const days = eachDayOfInterval({ start, end });
    
    const mockData = days.map(day => ({
      date: day,
      progress: categories.map(category => ({
        category,
        progress: Math.floor(Math.random() * 100)
      }))
    }));
    
    setProgressData(mockData);
  };

  const getProgressColor = (category: typeof categories[number]) => {
    const colors = {
      'Health': '#FF6B6B',
      'Career': '#4ECDC4',
      'Finance': '#45B7D1',
      'Family': '#96CEB4',
      'Social': '#FFEEAD',
      'Personal Growth': '#D4A5A5',
      'Recreation': '#9B9B9B',
      'Spirituality': '#A8E6CF'
    } as const;
    return colors[category] || '#666666';
  };

  const getWeekRange = () => {
    const start = startOfWeek(currentDate, { locale: ja });
    const end = endOfWeek(currentDate, { locale: ja });
    return `${format(start, 'M/d')} 〜 ${format(end, 'M/d')}`;
  };

  const renderStackedBars = () => {
    return progressData.map((dayData, dayIndex) => {
      let accumulatedWidth = 0;
      const totalWidth = CHART_WIDTH - CHART_PADDING * 2;
      const y = CHART_PADDING + (BAR_HEIGHT + BAR_MARGIN) * dayIndex;

      const dayLabel = (
        <SvgText
          key={`label-${dayIndex}`}
          x={CHART_PADDING - 8}
          y={y + BAR_HEIGHT / 2}
          fill="#fff"
          fontSize="12"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {format(dayData.date, 'E', { locale: ja })}
        </SvgText>
      );

      const segments = dayData.progress.map((data) => {
        const width = (data.progress / 100) * totalWidth;
        const x = CHART_PADDING + accumulatedWidth;
        const segment = (
          <Rect
            key={`${dayIndex}-${data.category}`}
            x={x}
            y={y}
            width={width}
            height={BAR_HEIGHT}
            fill={getProgressColor(data.category)}
            opacity={0.8}
          />
        );
        accumulatedWidth += width;
        return segment;
      });

      return [dayLabel, ...segments];
    });
  };

  const getWeeklyAverage = () => {
    if (progressData.length === 0) return 0;
    const totalProgress = progressData.reduce((acc, day) => {
      const dayAverage = day.progress.reduce((sum, curr) => sum + curr.progress, 0) / categories.length;
      return acc + dayAverage;
    }, 0);
    return Math.round(totalProgress / progressData.length);
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

        <View style={styles.averageSection}>
          <Text style={styles.averageLabel}>総合達成率</Text>
          <Text style={styles.averageValue}>{getWeeklyAverage()}%</Text>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH} height={(BAR_HEIGHT + BAR_MARGIN) * 7 + CHART_PADDING * 2}>
              {renderStackedBars()}
            </Svg>
          </View>
          <View style={styles.legendContainer}>
            {categories.map((category) => (
              <View key={category} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor,
                    { backgroundColor: getProgressColor(category) }
                  ]} 
                />
                <Text style={styles.legendText}>
                  {category}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>週間目標</Text>
          {weeklyGoals.map((goal, index) => (
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
  chartSection: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chartContainer: {
    marginBottom: 16,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  progressText: {
    color: '#999',
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
