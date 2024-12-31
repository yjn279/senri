import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types/database';

// ストレージのキー
const STORAGE_KEYS = {
  GOALS: '@balance_wheel_goals',
  PROGRESS: '@balance_wheel_progress',
};

// 目標データの型定義
export type Goal = {
  category: Category;
  goal: string;
};

// 進捗データの型定義
export type Progress = {
  category: string;
  progress: number;
  period: 'monthly' | 'yearly';
  date: string;
};

// 目標の保存
export const saveGoals = async (goals: Goal[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error saving goals:', error);
    return false;
  }
};

// 目標の取得
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const goalsJson = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
    return goalsJson ? JSON.parse(goalsJson) : [];
  } catch (error) {
    console.error('Error getting goals:', error);
    return [];
  }
};

// 進捗の保存
export const saveProgress = async (progress: Progress[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

// 進捗の取得
export const getProgress = async (): Promise<Progress[]> => {
  try {
    const progressJson = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progressJson ? JSON.parse(progressJson) : [];
  } catch (error) {
    console.error('Error getting progress:', error);
    return [];
  }
}; 
