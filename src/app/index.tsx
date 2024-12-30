import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { getGoals, getProgress } from '../utils/storage';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 240;
const CHART_PADDING = 20;

export default function DailyProgress() {
  const [goals, setGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentDate] = useState(new Date());

  const categories = [
    'career',
    'finance',
    'health',
    'family',
    'relationship',
    'spirituality',
    'recreation',
    'environment',
  ] as const;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedGoals = await getGoals();
    const savedProgress = await getProgress();
    
    setGoals(savedGoals);
    
    // 仮のデータを生成（実際のアプリでは保存されたデータを使用）
    const mockProgressData = categories.map(category => ({
      category,
      progress: Math.floor(Math.random() * 100)
    }));
    
    setProgressData(mockProgressData);

    // 仮のタスクデータを生成
    const mockTasks = categories.map(category => ({
      id: category,
      category,
      title: `${category}の今日のタスク`,
      completed: Math.random() > 0.5
    }));

    setTasks(mockTasks);
  };

  const getProgressColor = (category: typeof categories[number]) => {
    const colors = {
      'career': '#4ECDC4',
      'finance': '#45B7D1',
      'health': '#FF6B6B',
      'family': '#96CEB4',
      'relationship': '#FFEEAD',
      'spirituality': '#D4A5A5',
      'recreation': '#9B9B9B',
      'environment': '#A8E6CF'
    } as const;
    return colors[category] || '#666666';
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const renderStackedBar = () => {
    let accumulatedWidth = 0;
    const totalWidth = CHART_WIDTH - CHART_PADDING * 2;
    const barHeight = 24;

    return progressData.map((data) => {
      const width = (data.progress / 100) * totalWidth;
      const x = CHART_PADDING + accumulatedWidth;
      const segment = (
        <Rect
          key={data.category}
          x={x}
          y={CHART_PADDING}
          width={width}
          height={barHeight}
          fill={getProgressColor(data.category)}
          opacity={0.8}
        />
      );
      accumulatedWidth += width;
      return segment;
    });
  };

  const getDailyAverage = () => {
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
            {format(currentDate, 'M月d日（E）', { locale: ja })}
          </Text>
          <Text style={styles.headerSubtitle}>
            今日の達成状況を確認できます
          </Text>
        </View>

        <View style={styles.averageSection}>
          <Text style={styles.averageLabel}>総合達成率</Text>
          <Text style={styles.averageValue}>{getDailyAverage()}%</Text>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT / 4}>
              {renderStackedBar()}
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
                  <Text style={styles.progressText}>
                    {' '}({progressData.find(d => d.category === category)?.progress || 0}%)
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>本日のタスク</Text>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => toggleTask(task.id)}
            >
              <View style={styles.taskCheckbox}>
                {task.completed && (
                  <View style={styles.taskCheckboxInner} />
                )}
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskCategory}>{task.category}</Text>
                <Text style={[
                  styles.taskTitle,
                  task.completed && styles.taskCompleted
                ]}>
                  {task.title}
                </Text>
              </View>
            </TouchableOpacity>
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
  tasksContainer: {
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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3f464c',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  taskContent: {
    flex: 1,
  },
  taskCategory: {
    fontSize: 12,
    color: '#4A90E2',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    color: '#fff',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
}); 
