# ViRFQ Mobile App Requirements

> Version: 1.0.0
> Platform: iOS + Android (Expo/React Native)
> Created: 2026-02-02

---

## 📋 Mục lục

1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Màn hình & Giao diện](#màn-hình--giao-diện)
3. [Tính năng chi tiết](#tính-năng-chi-tiết)
4. [UI/UX Guidelines](#uiux-guidelines)
5. [API Reference](#api-reference)
6. [Yêu cầu kỹ thuật](#yêu-cầu-kỹ-thuật)

---

## Tổng quan dự án

### Mô tả
ViRFQ là nền tảng kết nối buyer quốc tế với nhà xuất khẩu nông sản Việt Nam. App mobile cho phép nhà xuất khẩu:
- Xem danh sách RFQ (Request for Quotation)
- Xem chi tiết và unlock thông tin liên hệ buyer
- Quản lý tài khoản và gói subscription

### Target Users
- Primary: Nhà xuất khẩu nông sản Việt Nam
- Language: Vietnamese (primary), English (secondary)
- Age: 25-55

### Tech Stack đề xuất
- Framework: Expo (React Native)
- State Management: Zustand hoặc React Query
- Navigation: Expo Router hoặc React Navigation
- HTTP Client: Axios hoặc Fetch API

---

## Màn hình & Giao diện

### 🔐 1. Authentication Screens

#### 1.1. Splash Screen
- Logo ViRFQ centered
- Loading indicator
- Auto-redirect based on auth status

#### 1.2. Login Screen
```
┌─────────────────────────────────┐
│           [Logo ViRFQ]          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email                     │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Mật khẩu            [👁]  │  │
│  └───────────────────────────┘  │
│                                 │
│       [ Đăng nhập ]             │
│                                 │
│       Quên mật khẩu?            │
│                                 │
│    ─────── hoặc ───────         │
│                                 │
│  Chưa có tài khoản? Đăng ký     │
└─────────────────────────────────┘
```

Chức năng:
- Input validation (email format, password min 8 chars)
- Show/hide password toggle
- Remember email option
- Error messages inline
- Loading state on submit
- Biometric login option (Face ID / Fingerprint)

#### 1.3. Register Screen
```
┌─────────────────────────────────┐
│  ← Quay lại                     │
│                                 │
│  Tạo tài khoản                  │
│  Bắt đầu tìm kiếm đơn hàng      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Họ và tên *               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Email công ty *           │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Tên công ty               │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Mật khẩu *          [👁]  │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Số điện thoại / WhatsApp  │  │
│  └───────────────────────────┘  │
│                                 │
│  ☐ Tôi đồng ý với Điều khoản    │
│                                 │
│       [ Đăng ký ]               │
└─────────────────────────────────┘
```

Chức năng:
- Real-time validation
- Password strength indicator
- Terms of Service link
- Country picker for phone

#### 1.4. OTP Verification Screen
```
┌─────────────────────────────────┐
│  ← Quay lại                     │
│                                 │
│       Xác nhận email            │
│  Mã xác nhận đã gửi đến:        │
│  user@example.com               │
│                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│  │  │ │  │ │  │ │  │ │  │ │  │  │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│                                 │
│       Gửi lại mã (45s)          │
│                                 │
│       [ Xác nhận ]              │
└─────────────────────────────────┘
```

#### 1.5. Forgot Password Screen
- Email input
- Send reset link button
- Success message

---

## Tính năng chi tiết

### RFQ List
- Infinite scroll pagination
- Pull to refresh
- Search bar
- Filter by: Category, Country, Incoterms
- Sort by: Date, Quantity

### RFQ Detail
- Full product info
- Masked buyer contact (before unlock)
- Unlock button with quota display
- Direct contact buttons (after unlock): Email, Phone, WhatsApp

### Profile
- User info display/edit
- Subscription status
- Unlock history
- Change password

### Settings
- Language toggle (VI/EN)
- Notifications toggle
- Biometric login toggle
- About & Terms
- Logout

---

## UI/UX Guidelines

### Colors
- Primary: #2563eb (Blue)
- Secondary: #10b981 (Green)
- Background: #f8fafc
- Surface: #ffffff
- Text: #1e293b
- Text Secondary: #64748b
- Error: #ef4444
- Success: #22c55e

### Typography
- Font: System default (San Francisco / Roboto)
- Headings: Bold
- Body: Regular

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Components
- Buttons: Rounded corners (8px)
- Cards: Shadow, rounded (12px)
- Inputs: Border, rounded (8px)

---

## API Reference

Base URL: `https://virfq.com/api`

See `ViRFQ_API_DOCUMENTATION.md` for full API details.

---

## Yêu cầu kỹ thuật

### Must Have
- [ ] Expo SDK 52+
- [ ] TypeScript
- [ ] Expo Router for navigation
- [ ] Secure token storage (expo-secure-store)
- [ ] Pull-to-refresh
- [ ] Infinite scroll
- [ ] Offline indicator
- [ ] Error boundaries

### Nice to Have
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Deep linking
- [ ] Analytics (Firebase/Mixpanel)
- [ ] Crash reporting (Sentry)

### Performance
- Initial load < 3s
- Smooth scrolling (60fps)
- Memory efficient image loading
