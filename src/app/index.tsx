import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Circle, Text as SvgText, G } from 'react-native-svg';

export default function Index() {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const radius = (windowWidth * 0.8) / 2;
  const center = radius;

  const categories = [
    'Health', 'Career', 'Finance', 'Family',
    'Social', 'Personal Growth', 'Recreation', 'Spirituality'
  ];

  const renderBalanceWheel = () => {
    return (
      <Svg height={radius * 2} width={radius * 2}>
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((scale, index) => (
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        ))}
        
        {/* Category labels */}
        {categories.map((category, index) => {
          const angle = (index * 45 - 90) * Math.PI / 180;
          const x = center + (radius * 0.85) * Math.cos(angle);
          const y = center + (radius * 0.85) * Math.sin(angle);
          
          return (
            <SvgText
              key={index}
              x={x}
              y={y}
              fill="white"
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {category}
            </SvgText>
          );
        })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        {renderBalanceWheel()}
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/goals')}
        >
          <Text style={styles.menuText}>Set Goals</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/progress')}
        >
          <Text style={styles.menuText}>View Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  menuContainer: {
    width: '100%',
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
