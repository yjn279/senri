import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Stack, Tabs } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { 
  CircleCheckBig,
  ChartBar, 
  Calendar,
  ChartColumn,
  ChartPie,
} from 'lucide-react-native';
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import Auth from '../components/Auth'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    text: '#333333',
    primary: '#4A90E2',
  },
};

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    return (
      <ThemeProvider value={theme}>
        <Auth />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider value={theme}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#333333',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E0E0E0',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: format(new Date(), 'M月d日（E）の目標', { locale: ja }),
            tabBarLabel: '今日',
            tabBarIcon: ({ color, size }) => (
              <CircleCheckBig size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly/index"
          options={{
            title: '今週の目標',
            tabBarLabel: '週間',
            tabBarIcon: ({ color, size }) => (
              <ChartBar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="monthly/index"
          options={{
            title: '今月の目標',
            tabBarLabel: '月間',
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="yearly/index"
          options={{
            title: '今年の目標',
            tabBarLabel: '年間',
            tabBarIcon: ({ color, size }) => (
              <ChartColumn size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="lifetime/index"
          options={{
            title: '生涯の目標',
            tabBarLabel: '生涯',
            tabBarIcon: ({ color, size }) => (
              <ChartPie size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});
