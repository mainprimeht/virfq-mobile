import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.slate[50] },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="rfq/[id]" 
          options={{ 
            headerShown: true,
            title: 'Chi tiết RFQ',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.slate[800],
          }} 
        />
        <Stack.Screen 
          name="pricing" 
          options={{ 
            headerShown: true,
            title: 'Bảng giá',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.slate[800],
          }} 
        />
        <Stack.Screen 
          name="checkout" 
          options={{ 
            headerShown: true,
            title: 'Thanh toán',
            headerBackTitle: 'Quay lại',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.slate[800],
          }} 
        />
      </Stack>
    </>
  );
}
