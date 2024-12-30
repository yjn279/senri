import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const categories = [
  'career',
  'finance',
  'health',
  'family',
  'relationship',
  'spirituality',
  'recreation',
  'environment',
] as const;

export type Category = typeof categories[number];

export const lifeGoals = pgTable('life_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  category: text('category').$type<Category>().notNull(),
  title: text('title').notNull(),
  created: timestamp('created').defaultNow(),
  updated: timestamp('updated').defaultNow(),
});

export const yearlyGoals = pgTable('yearly_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  lifetimeGoalId: uuid('life_goal_id').references(() => lifeGoals.id),
  year: integer('year').notNull(),
  title: text('title').notNull(),
  created: timestamp('created').defaultNow(),
  updated: timestamp('updated').defaultNow(),
});

export const monthlyGoals = pgTable('monthly_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  lifetimeGoalId: uuid('life_goal_id').references(() => lifeGoals.id),
  yearlyGoalId: uuid('yearly_goal_id').references(() => yearlyGoals.id),
  month: integer('month').notNull(),
  title: text('title').notNull(),
  created: timestamp('created').defaultNow(),
  updated: timestamp('updated').defaultNow(),
});

export const dailyGoals = pgTable('daily_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  lifetimeGoalId: uuid('life_goal_id').references(() => lifeGoals.id),
  yearlyGoalId: uuid('yearly_goal_id').references(() => yearlyGoals.id),
  monthlyGoalId: uuid('monthly_goal_id').references(() => monthlyGoals.id),
  day: integer('day').notNull(),
  completed: boolean('completed').default(false),
  created: timestamp('created').defaultNow(),
  updated: timestamp('updated').defaultNow(),
}); 
