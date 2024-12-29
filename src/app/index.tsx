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

const { width } = Dimensions.get('window');
const BAR_HEIGHT = 24;

export default function DailyProgress() {
  const [goals, setGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#4A90E2';
    if (progress >= 40) return '#FF9800';
    if (progress >= 20) return '#FF5722';
    return '#666666';
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
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

        <View style={styles.chartContainer}>
          {renderProgressBars()}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>本日の平均達成率</Text>
          <Text style={[
            styles.summaryValue,
            { color: getProgressColor(getDailyAverage()) }
          ]}>
            {getDailyAverage()}%
          </Text>
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
