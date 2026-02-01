# ViRFQ Mobile App - UI/UX Design System

> Version: 1.0.0
> Last Updated: 2026-02-02
> Áp dụng cho: iOS + Android Mobile App

---

## Color System

### Primary Colors (Trust Blue)

| Name | HEX | Usage |
|------|-----|-------|
| Primary-50 | #EFF6FF | Background nhạt |
| Primary-100 | #DBEAFE | Hover states |
| Primary-200 | #BFDBFE | Borders |
| Primary-300 | #93C5FD | Disabled states |
| Primary-400 | #60A5FA | Icons secondary |
| Primary-500 | #3B82F6 | Links |
| Primary-600 | #2563EB | ⭐️ Primary button |
| Primary-700 | #1D4ED8 | Button hover |
| Primary-800 | #1E40AF | Dark mode |
| Primary-900 | #1E3A8A | Dark mode pressed |

### CTA Colors (Orange)

| Name | HEX | Usage |
|------|-----|-------|
| CTA | #F97316 | ⭐️ Unlock, promotional |
| CTA Hover | #EA580C | CTA hover |

### Semantic Colors

- Success: #16A34A
- Warning: #F59E0B
- Error: #DC2626

### Neutral (Slate)

| Name | HEX | Usage |
|------|-----|-------|
| Slate-50 | #F8FAFC | Page background |
| Slate-100 | #F1F5F9 | Card backgrounds |
| Slate-200 | #E2E8F0 | ⭐️ Borders |
| Slate-300 | #CBD5E1 | Disabled |
| Slate-400 | #94A3B8 | Icons muted |
| Slate-500 | #64748B | ⭐️ Text muted |
| Slate-600 | #475569 | Secondary text |
| Slate-700 | #334155 | Body text |
| Slate-800 | #1E293B | Headings |
| Slate-900 | #0F172A | ⭐️ Primary text |

### Quality Score Colors

| Score | Color | HEX |
|-------|-------|-----|
| 90-100 | Green | #16A34A |
| 80-89 | Emerald | #059669 |
| 70-79 | Amber | #F59E0B |
| <70 | Gray | #64748B |

---

## Typography

Font Family: Inter (or system default)

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 32px | 800 | Hero only |
| H1 | 24px | 700 | Page titles |
| H2 | 20px | 700 | Section headers |
| H3 | 18px | 600 | Card titles |
| Body Large | 16px | 400 | Main body |
| Body | 14px | 400 | ⭐️ Default |
| Caption | 12px | 400 | Timestamps |
| Tiny | 10px | 500 | Badges |

---

## Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| 3xl | 32px |
| 4xl | 48px |

---

## Components

### Buttons

- Primary: gradient #2563EB → #1D4ED8, white text, 12px radius
- CTA (Orange): gradient #F97316 → #EA580C, white text, 12px radius
- Secondary: white bg, #E2E8F0 border, 8px radius
- Ghost: transparent, #2563EB text

### Cards

- Background: #FFFFFF
- Border: 1px solid #EAECF0
- Radius: 12px
- Padding: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.05)

### Input Fields

- Height: 48px
- Border: 1px solid #E2E8F0
- Radius: 8px
- Focus: 2px solid #2563EB

### Bottom Tab Bar

- Height: 56px + safe area
- Active: #2563EB
- Inactive: #94A3B8

---

## Screens Required

1. Splash Screen
2. Login
3. Register
4. OTP Verification (6 boxes)
5. Forgot Password
6. RFQ List (Tab 1: Bảng tin)
7. RFQ Detail
8. Dashboard (Tab 2)
9. Menu/Settings (Tab 3)
10. Profile Edit
11. Pricing
12. Checkout (Bank Transfer)

---

## Priority

### P0 (MVP)
- Auth flow
- RFQ List + filters
- RFQ Detail + unlock
- Dashboard
- Bottom tab navigation

### P1
- Profile edit
- Change password
- Pricing page
- Bank transfer checkout

### P2
- Bookmarks
- Push notifications
- Team management
