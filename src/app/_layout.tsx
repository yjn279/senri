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
    background: '#25292e',
    text: '#ffffff',
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
      <ThemeProvider>
        <Auth />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider value={theme}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#25292e',
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#25292e',
            borderTopColor: '#3f464c',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '今日',
            tabBarIcon: ({ color, size }) => (
              <CircleCheckBig size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly/index"
          options={{
            title: '週間',
            tabBarIcon: ({ color, size }) => (
              <ChartBar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="monthly/index"
          options={{
            title: '月間',
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="yearly/index"
          options={{
            title: '年間',
            tabBarIcon: ({ color, size }) => (
              <ChartColumn size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="lifetime/index"
          options={{
            title: '生涯',
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
