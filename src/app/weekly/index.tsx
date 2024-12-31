import { endOfWeek, startOfWeek } from 'date-fns';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { CartesianChart, StackedBar } from 'victory-native';
import { useFont } from "@shopify/react-native-skia";
import { useDailyGoals } from '@/src/hooks/useDailyGoals';
import { useMonthlyGoals } from '@/src/hooks/useMonthlyGoals';
import { useWeeklyProgress } from '@/src/hooks/useWeeklyProgress';
import { Categories, CategoryColors } from '@/src/lib/enums';
import { Category } from '@/src/lib/types';

const { width } = Dimensions.get('window');
const start = startOfWeek(new Date());
const end = endOfWeek(new Date());

export default function WeeklyIndex() {
  const { goals: dailyGoals } = useDailyGoals(start, end);
  const { goals: monthlyGoals } = useMonthlyGoals();
  const { progress, progressList } = useWeeklyProgress(dailyGoals);
  const font = useFont(require("../../assets/fonts/SpaceMono-Regular.ttf"), 12);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        {/* チャート */}
        <View style={styles.chartSection}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>スコア</Text>
            <Text style={styles.progressValue}>{progress}</Text>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chartWrapper}>
              <View style={styles.chartSubContainer}>
                {progressList.length > 0 && (
                  <CartesianChart
                    data={progressList}
                    xKey="day"
                    yKeys={[
                      'career',
                      'finance',
                      'health',
                      'family',
                      'relationship',
                      'spirituality',
                      'recreation',
                      'environment',
                    ]}
                    axisOptions={{
                      font: font,
                      formatXLabel: (value) => value,
                    }}
                    domain={{ y: [0, 1] }}
                  >
                    {({ points, chartBounds }) => {
                      const categoryPoints = [
                        points.career,
                        points.finance,
                        points.health,
                        points.family,
                        points.relationship,
                        points.spirituality,
                        points.recreation,
                        points.environment,
                      ];

                      return (
                        <StackedBar
                          chartBounds={chartBounds}
                          colors={Object.values(CategoryColors).filter(
                            (_, index) => index < categoryPoints.length
                          )}
                          points={categoryPoints}
                        />
                      );
                    }}
                  </CartesianChart>
                )}
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
          {monthlyGoals.map((goal) => {
            const category = goal.life_goals?.category as Category
            const color = CategoryColors[category]
            
            return (
              <View key={goal.id} style={styles.taskItem}>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskCategory,
                    { color: color }
                  ]}>
                    {category}
                  </Text>
                  <Text style={styles.taskTitle}>
                    {goal.title}
                  </Text>
                </View>
              </View>
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
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressLabel: {
    fontSize: 24,
    color: '#666666',
  },
}); 
