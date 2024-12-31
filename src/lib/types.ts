import { Categories } from "./enums";

export type Category = keyof typeof Categories;

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

export type MonthlyGoal =  {
  id: string;
  month: number;
  title: string;
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
