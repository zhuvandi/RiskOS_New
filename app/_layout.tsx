import { Stack } from 'expo-router';
import { AuthProvider } from '../components/AuthContext';
import '../global.css';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </AuthProvider>
  );
}
