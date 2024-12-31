import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MonthlyProgress, Goal } from '../lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const useMonthlyProgress = (goals: Goal[]) => {
  const [progressData, setProgressData] = useState<MonthlyProgress[]>([]);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlyProgress();
  }, [goals]);

  const fetchMonthlyProgress = async () => {
    try {
      setIsLoading(true);
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      if (error) throw error;

      if (data) {
        // Get all days in the month
        const days = eachDayOfInterval({ start, end });
        
        // Process data for each day
        const processedData = days.map(day => {
          const dayData = data.filter(d => d.date === format(day, 'yyyy-MM-dd'));
          const dayProgress = dayData.reduce((acc, curr) => acc + curr.progress, 0);
          const average = dayData.length > 0 ? dayProgress / dayData.length : 0;
          
          return {
            date: format(day, 'yyyy-MM-dd'),
            progress: average
          };
        });

        setProgressData(processedData);
        
        // Calculate monthly average
        const totalProgress = processedData.reduce((acc, curr) => acc + curr.progress, 0);
        setMonthlyAverage(Math.round(totalProgress / processedData.length));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    progressData,
    monthlyAverage,
    isLoading,
    error,
    refreshProgress: fetchMonthlyProgress
  };
}; 
