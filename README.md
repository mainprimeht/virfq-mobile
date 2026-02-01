# ViRFQ Mobile App

Mobile app for ViRFQ - B2B RFQ Platform for Vietnamese Exporters.

## Tech Stack

- **Framework**: Expo / React Native
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand
- **Language**: TypeScript
- **Styling**: StyleSheet with Design System

## Features

### Authentication
- Login / Register
- OTP Verification (6-digit input)
- Forgot Password
- Secure token storage

### RFQ Management
- Browse RFQ feed with infinite scroll
- Search with debounce
- Filter by category, country, incoterms
- Quality score badges
- Unlock contact information

### Dashboard
- Usage statistics
- Plan information
- Recent viewed RFQs

### Profile & Settings
- Edit profile
- Change password
- Pricing plans
- Bank transfer checkout

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### Installation

```bash
# Clone the repository
git clone https://github.com/mainprimeht/virfq-mobile.git
cd virfq-mobile

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Running on Device

1. Install Expo Go on your phone
2. Scan the QR code from terminal
3. App will load on your device

### Build for Production

```bash
# iOS
eas build -p ios --profile production

# Android
eas build -p android --profile production
```

## Project Structure

```
virfq-mobile/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Auth screens
│   ├── (tabs)/            # Tab screens
│   ├── rfq/               # RFQ detail
│   └── ...                # Other screens
├── components/            # Reusable components
├── constants/             # Theme, colors, API config
├── i18n/                  # Translations (vi, en)
├── services/              # API service
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── assets/                # Images, icons
```

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for:
- Color palette
- Typography
- Spacing
- Component styles

## API

The app connects to `https://virfq.com/api`. See backend documentation for API details.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Proprietary - ViRFQ.com

## Contact

- Email: support@virfq.com
- Website: https://virfq.com
