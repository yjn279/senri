import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

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
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Balance Wheel',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="goals" 
          options={{ 
            title: '生涯目標の設定',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress" 
          options={{ 
            title: '進捗管理',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress/lifetime" 
          options={{ 
            title: '生涯目標の進捗',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress/yearly" 
          options={{ 
            title: '年間の進捗',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress/monthly" 
          options={{ 
            title: '月間の進捗',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress/weekly" 
          options={{ 
            title: '週間の進捗',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="progress/daily" 
          options={{ 
            title: '本日の進捗',
            headerStyle: {
              backgroundColor: '#25292e',
            },
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
