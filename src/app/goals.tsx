import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { saveGoals, getGoals, Goal } from '../utils/storage';

export default function Goals() {
  const [categories, setCategories] = useState<Goal[]>([
    { category: 'Health', goal: '' },
    { category: 'Career', goal: '' },
    { category: 'Finance', goal: '' },
    { category: 'Family', goal: '' },
    { category: 'Social', goal: '' },
    { category: 'Personal Growth', goal: '' },
    { category: 'Recreation', goal: '' },
    { category: 'Spirituality', goal: '' },
  ]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const savedGoals = await getGoals();
    if (savedGoals.length > 0) {
      setCategories(savedGoals);
    }
  };

  const updateGoal = (categoryIndex: number, value: string) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].goal = value;
    setCategories(newCategories);
  };

  const handleSave = async () => {
    const success = await saveGoals(categories);
    if (success) {
      Alert.alert('成功', '目標を保存しました');
    } else {
      Alert.alert('エラー', '目標の保存に失敗しました');
    }
  };

  const renderGoalInput = (category: Goal, index: number) => {
    return (
      <View key={category.category} style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category.category}</Text>
        
        <View style={styles.goalsContainer}>
          <View style={styles.goalSection}>
            <Text style={styles.periodLabel}>生涯目標</Text>
            <TextInput
              style={styles.input}
              value={category.goal}
              onChangeText={(value) => updateGoal(index, value)}
              placeholder="あなたの生涯目標を入力してください"
              placeholderTextColor="#666"
              multiline
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>生涯目標の設定</Text>
          <Text style={styles.headerSubtitle}>
            各カテゴリーにおいて、あなたが人生で達成したい目標を設定してください。
          </Text>
        </View>

        {categories.map((category, index) => renderGoalInput(category, index))}
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>目標を保存</Text>
        </TouchableOpacity>
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
  categoryContainer: {
    marginBottom: 24,
    backgroundColor: '#2f353a',
    borderRadius: 12,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  goalsContainer: {
    gap: 16,
  },
  goalSection: {
    marginBottom: 12,
  },
  periodLabel: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1d20',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
