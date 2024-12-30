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
  const [yearlyGoals, setYearlyGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [monthlyAverages, setMonthlyAverages] = useState<number[]>([]);

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

  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 仮の年間目標データ
    const mockYearlyGoals = [
      { category: 'career', goal: '新しい職務資格を取得する' },
      { category: 'finance', goal: '年間貯蓄目標を達成する' },
      { category: 'health', goal: '健康診断の数値を改善する' },
      { category: 'family', goal: '家族旅行を2回実施する' },
      { category: 'relationship', goal: 'コミュニティ活動に参加する' },
      { category: 'spirituality', goal: '定期的な瞑想習慣を確立する' },
      { category: 'recreation', goal: '長期休暇を取得して充実させる' },
      { category: 'environment', goal: '環境負荷の少ない生活様式への移行' }
    ];
    setYearlyGoals(mockYearlyGoals);
    
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
            fill={getProgressColor(category)}
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

  const getYearlyAverage = () => {
    if (monthlyAverages.length === 0) return 0;
    return Math.round(
      monthlyAverages.reduce((acc, curr) => acc + curr, 0) / 
      monthlyAverages.length
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>
                {new Date().getFullYear()}年の進捗
              </Text>
              <Text style={styles.headerSubtitle}>
                月ごとのカテゴリー達成率と平均達成率の推移
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.averageSection}>
          <Text style={styles.averageLabel}>総合達成率</Text>
          <Text style={styles.averageValue}>{getYearlyAverage()}%</Text>
        </View>

        <View style={styles.chartSection}>
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

          <View style={styles.legendContainer}>
            {categories.map((category) => (
              <View key={category} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor,
                    { backgroundColor: getProgressColor(category) }
                  ]} 
                />
                <Text style={styles.legendText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>年間目標</Text>
          {yearlyGoals.map((goal, index) => (
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  averageContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
  },
  averageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSection: {
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3f464c',
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
}); 
