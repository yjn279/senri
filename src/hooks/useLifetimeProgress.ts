import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LifetimeProgress, Goal } from '../lib/types';

export const useLifetimeProgress = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progressData, setProgressData] = useState<LifetimeProgress[]>([]);
  const [averageProgress, setAverageProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLifetimeProgress();
  }, []);

  const fetchLifetimeProgress = async () => {
    try {
      setIsLoading(true);
      
      // Fetch lifetime goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('life_goals')
        .select('*');

      if (goalsError) throw goalsError;
      
      if (goalsData) {
        setGoals(goalsData);

        // Fetch latest progress for each category
        const { data: progressData, error: progressError } = await supabase
          .from('daily_progress')
          .select('*')
          .order('date', { ascending: false });

        if (progressError) throw progressError;

        if (progressData) {
          // Process progress data by category
          const categoryProgress = goalsData.map(goal => {
            const categoryData = progressData.filter(p => p.category === goal.category);
            const latestProgress = categoryData.length > 0
              ? categoryData[0].progress
              : 0;

            return {
              category: goal.category,
              progress: latestProgress
            };
          });

          setProgressData(categoryProgress);
          
          // Calculate average progress
          const totalProgress = categoryProgress.reduce((acc, curr) => acc + curr.progress, 0);
          setAverageProgress(Math.round(totalProgress / categoryProgress.length));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { error } = await supabase
        .from('life_goals')
        .update(updates)
        .eq('id', goalId);

      if (error) throw error;

      await fetchLifetimeProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    goals,
    progressData,
    averageProgress,
    isLoading,
    error,
    updateGoal,
    refreshProgress: fetchLifetimeProgress
  };
}; 
