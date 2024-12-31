import { useState, useEffect } from 'react';
import { Categories, CategoryColors } from '../lib/enums';
import { Category, DailyGoal } from '../lib/types';

export const useDailyProgress = (goals: DailyGoal[]) => {
  const [progress, setProgress] = useState<number>(0);
  const [progressList, setProgressList] = useState<Array<{
    value: number,
    color: string,
    label: string
  }>>([]);

  // データの取得
  useEffect(() => {
    // カテゴリごとの達成率
    const progressList = Object.values(Categories).map(category => {
      // カテゴリに属する目標の取得
      const categoryGoals = goals.filter(goal => goal.life_goals?.category === category);

      // 目標ごとの達成率
      const total = categoryGoals.length
      const completed = categoryGoals.filter(goal => goal.completed).length
      const progress = total ? completed / total : 0

      return {
        value: progress / 8,  // カテゴリの数で割る
        color: CategoryColors[category],
        label: category,
      };
    });

    // 平均達成率
    const completed = progressList.reduce((completed, data) => completed + data.value, 0);
    const averageProgress = Math.round(completed * 100);

    // 残りの達成率
    progressList.push({
      value: 1 - completed,
      color: CategoryColors.remaining,
      label: Categories.remaining,
    });

    setProgressList(progressList);
    setProgress(averageProgress);
  }, [goals]);

  return { progress, progressList };
};
