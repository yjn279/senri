import { Stack, Tabs } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

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
        }}
      >
        <Tabs.Screen
          name="lifetime"
          options={{
            title: '生涯目標',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="infinite" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="yearly"
          options={{
            title: '年間',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: '本日',
            tabBarIcon: ({ color }) => (
              <View style={styles.floatingButton}>
                <Ionicons name="today" size={32} color="#fff" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="monthly"
          options={{
            title: '月間',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly"
          options={{
            title: '週間',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-clear-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
