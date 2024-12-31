import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { useDailyGoals } from '../hooks/useDailyGoals';
import { useDailyProgress } from '../hooks/useDailyProgress';

const { width } = Dimensions.get('window');
const CHART_PADDING = 20;

export default function DailyProgress() {
  const { goals, handleGoal } = useDailyGoals();
  const { progress, progressList } = useDailyProgress(goals);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        {/* チャート */}
        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <View style={styles.pieChartWrapper}>
              <View style={styles.pieChartContainer}>
                <PolarChart
                  data={progressList}
                  labelKey={"label"}
                  valueKey={"value"}
                  colorKey={"color"}
                >
                  <Pie.Chart
                    innerRadius={'75%'}
                    startAngle={-90}
                  />
                </PolarChart>
                <View style={styles.progressOverlay}>
                  <Text style={styles.progressOverlayValue}>{progress}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 目標一覧 */}
        <View style={styles.tasksContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={styles.taskItem}
              onPress={() => handleGoal(goal.id)}
            >
              <View style={styles.taskCheckbox}>
                {goal.completed && (
                  <View style={styles.taskCheckboxInner} />
                )}
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskCategory}>{goal.life_goals?.category}</Text>
                <Text style={[
                  styles.taskTitle,
                  goal.completed && styles.taskCompleted
                ]}>
                  {goal.monthly_goals?.title}
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
    marginVertical: 16,
    paddingHorizontal: CHART_PADDING,
    justifyContent: 'center',
  },
  pieChartWrapper: {
    width: width - 64,
    height: width - 64,
    alignSelf: 'center',
  },
  pieChartContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
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
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlayValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 
