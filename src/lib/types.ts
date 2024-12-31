export type DailyGoal =  {
  id: string;
  completed: boolean;
  day: number;
  monthly_goals: {
    month: number;
    title: string;
  } | null;
  yearly_goals: {
    year: number;
  } | null;
  life_goals: {
    userId: string;
    category: string;
  } | null;
  created: string;
  updated: string;
}

export type Category = 
  | 'career'
  | 'finance'
  | 'health'
  | 'family'
  | 'relationship'
  | 'spirituality'
  | 'recreation'
  | 'environment';
