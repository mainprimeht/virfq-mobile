import { Stack } from 'expo-router';
import { Colors } from '../../constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.light.surface,
        },
        headerTintColor: Colors.light.text,
        headerBackTitle: 'Quay lại',
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Đăng nhập',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Đăng ký',
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: 'Xác thực email',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Quên mật khẩu',
        }}
      />
    </Stack>
  );
}
