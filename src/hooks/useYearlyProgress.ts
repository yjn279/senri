import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { YearlyProgress, Goal } from '../lib/types';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

export const useYearlyProgress = (goals: Goal[]) => {
  const [progressData, setProgressData] = useState<YearlyProgress[]>([]);
  const [monthlyAverages, setMonthlyAverages] = useState<number[]>([]);
  const [yearlyAverage, setYearlyAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchYearlyProgress();
  }, [goals]);

  const fetchYearlyProgress = async () => {
    try {
      setIsLoading(true);
      const start = startOfYear(new Date());
      const end = endOfYear(new Date());
      
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'));

      if (error) throw error;

      if (data) {
        // Get all months in the year
        const months = eachMonthOfInterval({ start, end });
        
        // Process data for each month
        const processedData = months.map(month => {
          const monthData = data.filter(d => {
            const date = new Date(d.date);
            return date.getMonth() === month.getMonth();
          });

          // Group by category
          const categoryProgress = goals.map(goal => {
            const category = goal.category;
            const categoryData = monthData.filter(d => d.category === category);
            const progress = categoryData.length > 0
              ? categoryData.reduce((acc, curr) => acc + curr.progress, 0) / categoryData.length
              : 0;

            return {
              category,
              progress,
              month: format(month, 'M月')
            };
          });

          // Calculate monthly average
          const monthlyTotal = categoryProgress.reduce((acc, curr) => acc + curr.progress, 0);
          const monthlyAverage = categoryProgress.length > 0
            ? monthlyTotal / categoryProgress.length
            : 0;

          return {
            month: format(month, 'M月'),
            progress: categoryProgress,
            average: monthlyAverage
          };
        });

        setProgressData(processedData);
        
        // Set monthly averages
        const averages = processedData.map(data => Math.round(data.average));
        setMonthlyAverages(averages);
        
        // Calculate yearly average
        const totalAverage = averages.reduce((acc, curr) => acc + curr, 0);
        setYearlyAverage(Math.round(totalAverage / averages.length));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    progressData,
    monthlyAverages,
    yearlyAverage,
    isLoading,
    error,
    refreshProgress: fetchYearlyProgress
  };
}; 
