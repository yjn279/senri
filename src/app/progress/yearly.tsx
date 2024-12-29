import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import Svg, { 
  Rect, 
  Line, 
  Text as SvgText,
  Path,
  Circle
} from 'react-native-svg';
import { getGoals, getProgress } from '../../utils/storage';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 300;
const PADDING = 40;
const BAR_WIDTH = 20;

export default function YearlyProgress() {
  const [goals, setGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [monthlyAverages, setMonthlyAverages] = useState<number[]>([]);

  const categories = [
    'Health', 'Career', 'Finance', 'Family',
    'Social', 'Personal Growth', 'Recreation', 'Spirituality'
  ];

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedGoals = await getGoals();
    const savedProgress = await getProgress();
    
    setGoals(savedGoals);
    
    // 仮のデータを生成（実際のアプリでは保存されたデータを使用）
    const mockData = months.map(month => 
      categories.map(category => ({
        category,
        progress: Math.floor(Math.random() * 100),
        month
      }))
    ).flat();
    
    setProgressData(mockData);

    // 月ごとの平均を計算
    const averages = months.map(month => {
      const monthData = mockData.filter(d => d.month === month);
      return Math.round(
        monthData.reduce((acc, curr) => acc + curr.progress, 0) / 
        categories.length
      );
    });
    setMonthlyAverages(averages);
  };

  const getBarHeight = (progress: number) => {
    return (progress / 100) * (CHART_HEIGHT - PADDING * 2);
  };

  const getLinePoints = () => {
    let pathData = '';
    monthlyAverages.forEach((average, index) => {
      const x = PADDING + (index * ((CHART_WIDTH - PADDING * 2) / 11));
      const y = CHART_HEIGHT - PADDING - getBarHeight(average);
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });
    return pathData;
  };

  const renderBars = () => {
    return months.map((month, monthIndex) => {
      let accumulatedHeight = 0;
      return categories.map((category, categoryIndex) => {
        const data = progressData.find(
          d => d.month === month && d.category === category
        );
        if (!data) return null;

        const height = getBarHeight(data.progress);
        const x = PADDING + (monthIndex * ((CHART_WIDTH - PADDING * 2) / 11)) - BAR_WIDTH / 2;
        const y = CHART_HEIGHT - PADDING - height - accumulatedHeight;

        accumulatedHeight += height;

        return (
          <Rect
            key={`${month}-${category}`}
            x={x}
            y={y}
            width={BAR_WIDTH}
            height={height}
            fill={`hsl(${210 + categoryIndex * 30}, 70%, 60%)`}
            opacity={0.7}
          />
        );
      });
    });
  };

  const renderAveragePoints = () => {
    return monthlyAverages.map((average, index) => {
      const x = PADDING + (index * ((CHART_WIDTH - PADDING * 2) / 11));
      const y = CHART_HEIGHT - PADDING - getBarHeight(average);
      return (
        <Circle
          key={`point-${index}`}
          cx={x}
          cy={y}
          r={3}
          fill="#fff"
        />
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>年間の進捗</Text>
          <Text style={styles.headerSubtitle}>
            月ごとのカテゴリー達成率と平均達成率の推移
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Y軸 */}
            <Line
              x1={PADDING}
              y1={PADDING}
              x2={PADDING}
              y2={CHART_HEIGHT - PADDING}
              stroke="#3f464c"
              strokeWidth="1"
            />
            {/* X軸 */}
            <Line
              x1={PADDING}
              y1={CHART_HEIGHT - PADDING}
              x2={CHART_WIDTH - PADDING}
              y2={CHART_HEIGHT - PADDING}
              stroke="#3f464c"
              strokeWidth="1"
            />

            {/* 積み上げ棒グラフ */}
            {renderBars()}

            {/* 折れ線グラフ */}
            <Path
              d={getLinePoints()}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            />

            {/* 平均値のポイント */}
            {renderAveragePoints()}

            {/* X軸ラベル */}
            {months.map((month, index) => (
              <SvgText
                key={month}
                x={PADDING + (index * ((CHART_WIDTH - PADDING * 2) / 11))}
                y={CHART_HEIGHT - PADDING + 20}
                fill="#fff"
                fontSize="10"
                textAnchor="middle"
              >
                {month}
              </SvgText>
            ))}

            {/* Y軸ラベル */}
            {[0, 25, 50, 75, 100].map(value => (
              <SvgText
                key={value}
                x={PADDING - 10}
                y={CHART_HEIGHT - PADDING - (value / 100) * (CHART_HEIGHT - PADDING * 2)}
                fill="#fff"
                fontSize="10"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {value}%
              </SvgText>
            ))}
          </Svg>
        </View>

        <View style={styles.legendContainer}>
          {categories.map((category, index) => (
            <View key={category} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor,
                  { backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)` }
                ]} 
              />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>年間目標</Text>
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
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
