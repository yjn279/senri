import { startOfWeek } from 'date-fns';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Categories } from '../lib/enums';
import { Category, MonthlyGoal } from '../lib/types';

export const useMonthlyGoals = () => {
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  // 今月の目標の取得
  const fetchGoals = async () => {
    try {
      // ローディング
      setLoading(true);

      // ユーザーの認証
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 日付の取得
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      // データの取得
      const { data, error } = await supabase
        .from('monthly_goals')
        .select(`
          *,
          life_goals!inner ( userId, category ),
          yearly_goals!inner ( year )
        `)
        .eq('life_goals.userId', user.id)
        .eq('yearly_goals.year', year)
        .eq('month', month)

      // エラーハンドリング
      if (error) throw error;

      //　カテゴリの表示順の定義
      const categoryOrder = Object.fromEntries(
        Object.keys(Categories).map((category, index) => [category, index])
      ) as Record<Category, number>;

      // ソート
      const sortedData = data.sort((a, b) => {
        const categoryA = a.life_goals?.category as Category;
        const categoryB = b.life_goals?.category as Category;
        
        // カテゴリ順の比較
        const orderDiff = (categoryOrder[categoryA]) - (categoryOrder[categoryB]);
        if (orderDiff !== 0) return orderDiff;
        
        // カテゴリが同じ場合はIDで比較
        return a.id.localeCompare(b.id);
      });
      
      setGoals(sortedData);
    } catch (error) {
      console.error({ error });
      setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, error, loading };
}; 
