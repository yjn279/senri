import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { lifeGoals, yearlyGoals, monthlyGoals, dailyGoals } from './schema'

const connectionString = process.env.EXPO_PUBLIC_SUPABASE_URL!
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { 
  schema: { 
    lifeGoals,
    yearlyGoals,
    monthlyGoals,
    dailyGoals,
  } 
}); 
