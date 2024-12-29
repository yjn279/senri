import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from 'react-native';
import Svg, { Polygon, Circle, Text as SvgText, Line } from 'react-native-svg';
import { getGoals, getProgress } from '../../utils/storage';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.8;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;
const RADIUS = CHART_SIZE * 0.4;

export default function LifetimeProgress() {
  const [goals, setGoals] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [averageProgress, setAverageProgress] = useState(0);

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
    
    const yearlyProgress = savedProgress.filter(p => p.period === 'yearly');
    if (yearlyProgress.length > 0) {
      setProgressData(yearlyProgress);
      const total = yearlyProgress.reduce((acc, curr) => acc + curr.progress, 0);
      setAverageProgress(Math.round(total / yearlyProgress.length));
    }
  };

  const getProgressPoints = () => {
    const points = categories.map((category, index) => {
      const progress = progressData.find(p => p.category === category)?.progress || 0;
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      const progressRadius = (progress / 100) * RADIUS;
      const x = CENTER_X + progressRadius * Math.cos(angle);
      const y = CENTER_Y + progressRadius * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const renderAxisLines = () => {
    return categories.map((_, index) => {
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      const x2 = CENTER_X + RADIUS * Math.cos(angle);
      const y2 = CENTER_Y + RADIUS * Math.sin(angle);
      return (
        <Line
          key={index}
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={x2}
          y2={y2}
          stroke="#3f464c"
          strokeWidth="1"
        />
      );
    });
  };

  const renderLabels = () => {
    return categories.map((category, index) => {
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      const x = CENTER_X + (RADIUS + 20) * Math.cos(angle);
      const y = CENTER_Y + (RADIUS + 20) * Math.sin(angle);
      return (
        <SvgText
          key={index}
          x={x}
          y={y}
          fill="#fff"
          fontSize="12"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {category}
        </SvgText>
      );
    });
  };

  const renderCircles = () => {
    return [0.25, 0.5, 0.75, 1].map((scale, index) => (
      <Circle
        key={index}
        cx={CENTER_X}
        cy={CENTER_Y}
        r={RADIUS * scale}
        stroke="#3f464c"
        strokeWidth="1"
        fill="none"
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>生涯目標の進捗</Text>
          <Text style={styles.headerSubtitle}>
            各カテゴリーの達成状況をレーダーチャートで確認できます
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            {renderAxisLines()}
            {renderCircles()}
            <Polygon
              points={getProgressPoints()}
              fill="#4A90E2"
              fillOpacity="0.3"
              stroke="#4A90E2"
              strokeWidth="2"
            />
            {renderLabels()}
            <SvgText
              x={CENTER_X}
              y={CENTER_Y}
              fill="#fff"
              fontSize="32"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {averageProgress}%
            </SvgText>
          </Svg>
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>生涯目標</Text>
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
