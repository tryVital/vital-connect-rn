
# Junction Connect - Getting Started

Junction Connect is a React Native cross-platform app for iOS and Android. It uses the Expo Prebuild
to manage the native app projects.

## Start your application

```bash
# Install dependencies
npx expo install

# Generate the native iOS and Android app projects
npx expo prebuild

# Run the iOS app
npx expo run:ios

# Run the Android app
npx expo run:android
```

# Deep Linking 

Please configure a URL scheme in your Expo app configuration file (`app.json` or `app.config.js`):

```json5
{
  "expo": {
    // ...
    "scheme": "myapp",
    // ...
  }
}
```

Check out the official Expo [Linking into your app](https://docs.expo.dev/linking/into-your-app/) guide for more details.

# Configuration 

## App project

Most static App-level properties can be configured through your Expo app configuration file.

Check out the official Expo [config file reference](https://docs.expo.dev/versions/latest/config/app/) for more details.

### White Labelling 

Please configure `AppConfig` in `src/lib/config.tsx` to use your brand details:

```
export const AppConfig = {
  name: 'Vital Connect',
  slug: 'vitalconnect',
  supportEmail: 'support@tryvital.io',
  termsUrl: 'https://tryvital.io/terms',
  privacyUrl: 'https://tryvital.io/privacy',
  enableHealthConnect: true,
  enableHealthKit: true,
  colors: {
    DarkTheme: {
      background: '#101010',
      backgroundSection: '#2C2B27',
      text: '#FFFFFF',
      secondary: '#DDD9D4',
      'purple.400': '#CBD5F7',
      'black.400': '#1F2937',
      'gray.400': 'rgb(84,84,84)',
    },
    DefaultTheme: {
      text: '#1F2937',
      backgroundSection: '#fff',
      secondary: 'rgb(84,84,84)',
      background: '#F7F5F3',
      'purple.400': '#7487F6',
      'black.400': '#1F2937',
      'gray.400': 'rgb(84,84,84)',
    },
  },
  fonts: {
    regular: 'Aeonik-Regular',
    medium: 'Aeonik-Medium',
    bold: 'Aeonik-Bold',
    light: 'Aeonik-Light',
  },
};
```
