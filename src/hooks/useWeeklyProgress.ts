import { useState, useEffect } from 'react';
import { startOfWeek, addDays } from 'date-fns';
import { Categories } from '../lib/enums';
import { Category, DailyGoal } from '../lib/types';

export const useWeeklyProgress = (goals: DailyGoal[]) => {
  const [progress, setProgress] = useState<number>(0);
  const [progressList, setProgressList] = useState<Array<{
    day: string,
    career: number,
    finance: number,
    health: number,
    family: number,
    relationship: number,
    spirituality: number,
    recreation: number,
    environment: number,
  }>>([]);

  // データの取得
  useEffect(() => {
    const weekStart = startOfWeek(new Date());
    const days: Array<{
      day: string,
      career: number,
      finance: number,
      health: number,
      family: number,
      relationship: number,
      spirituality: number,
      recreation: number,
      environment: number,
    }> = [];

    // 曜日ごとの達成率
    for (let day = 0; day < 7; day++) {
      const date = addDays(weekStart, day);
      const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dayProgress = {
        day: weekDay,
        career: 0,
        finance: 0,
        health: 0,
        family: 0,
        relationship: 0,
        spirituality: 0,
        recreation: 0,
        environment: 0,
      };

      // カテゴリごとの達成率
      for (const category of Object.keys(Categories) as Category[]) {
        if (category === 'remaining') {
          continue;
        }
        
        const dayCategoryGoals = goals.filter(goal => (
          goal.life_goals?.category === category && goal.day === date.getDay()
        ));

        const completed = dayCategoryGoals.filter(goal => goal.completed).length;
        const total = dayCategoryGoals.length;
        const progress = total ? completed / total : 0;

        dayProgress[category] = progress / 8;  // カテゴリの数で割る
      }

      days.push(dayProgress);
    }

    // 平均達成率
    const completed = goals.filter(goal => goal.completed).length;
    const total = goals.length;
    const averageProgress = Math.round(completed / total * 100);
    
    setProgressList(days);
    setProgress(averageProgress);
  }, [goals]);

  return { progress, progressList };
};
