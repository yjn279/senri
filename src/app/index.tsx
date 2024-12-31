import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { useDailyGoals } from '@/src/hooks/useDailyGoals';
import { useProgress } from '@/src/hooks/useProgress';
import { Categories, CategoryColors } from '@/src/lib/enums';
import { Category } from '@/src/lib/types';

const { width } = Dimensions.get('window');
const start = new Date();
const end = new Date();
end.setDate(end.getDate() + 1);

export default function DailyIndex() {
  const { goals, handleGoal } = useDailyGoals(start, end);
  const { progress, progressList } = useProgress(goals);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        {/* チャート */}
        <View style={styles.chartSection}>
          <View style={styles.chartContainer}>
            <View style={styles.chartWrapper}>
              <View style={styles.chartSubContainer}>
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
                  <Text style={styles.progressOverlayLabel}>スコア</Text>
                  <Text style={styles.progressOverlayValue}>{progress}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.legendContainer}>
            {Object.keys(CategoryColors).map((category) => {
              // 未達成の判例は表示しない
              if (category === 'remaining') {
                return null
              }

              return (
                <View key={category} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.legendColor,
                      { backgroundColor: CategoryColors[category as Category] }
                    ]} 
                  />
                  <Text style={styles.legendText}>
                    {Categories[category as Category]}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* 目標一覧 */}
        <View style={styles.tasksContainer}>
          {goals.map((goal) => {
            const category = goal.life_goals?.category as Category
            const color = CategoryColors[category]
            
            return (
              <TouchableOpacity
                key={goal.id}
                style={styles.taskItem}
                onPress={() => handleGoal(goal.id)}
              >
                <View style={[
                  styles.taskCheckbox,
                  { borderColor: color }
                ]}>
                  {goal.completed && (
                    <View style={[
                      styles.taskCheckboxInner,
                      { backgroundColor: color }
                    ]} />
                  )}
                </View>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskCategory,
                    { color: color }
                  ]}>
                    {category}
                  </Text>
                  <Text style={[
                    styles.taskTitle,
                    goal.completed && styles.taskCompleted
                  ]}>
                    {goal.monthly_goals?.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  chartSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chartContainer: {
    marginVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  chartWrapper: {
    width: width - 64,
    height: width - 64,
    alignSelf: 'center',
  },
  chartSubContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    color: '#333333',
    fontSize: 12,
  },
  tasksContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskContent: {
    flex: 1,
  },
  taskCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    color: '#333333',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
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
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressOverlayLabel: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 4,
  },
}); 
