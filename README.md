
# Vital Connect - Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS
If running for the first time 

```
cd ios && pod install && cd ..
```

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

# Deep Linking 

Please configure you AppConfig in lib/config to have the correct deep linking url. 

Use npx to add this to your project 

```
npx uri-scheme add <slug> --ios

npx uri-scheme add <slug> --android

```

# Configuration 

## Icon Name 

To change icon name head to app.json and change the display name shown

### Android Icon Name 

The strings.xml file is used to store string resources for your Android app, including the app name displayed to users.

Navigate to the following directory within your Android project: android/app/src/main/res/values/.
In this directory, you’ll find the strings.xml file.
Open the strings.xml file in a text editor or code editor.

Locate the <string name="app_name"> element, which defines the app's name.
Change the value within this element to match the new app name:

```
<string name="app_name">My New App Name</string>
```

### White Labelling 

Please configure App Config to use your brand details 

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

### .env 

Please ensure you have a .env file that contains your API key. Again this is not the recommended way to make client calls but is here for demo purposes.
