import { SyncNotificationContent } from '@tryvital/vital-health-react-native';
import Config from 'react-native-config';

export interface ThemeColors {
  ['gray.400']: string;
  background: string;
  primary?: string;
  backgroundSection: string;
  text: string;
  border?: string;
  notification?: string;
  secondary: string;
  ['purple.400']: string;
  ['black.400']: string;
  ['gray.400']: string;
}

interface ThemeColorMap {
  DarkTheme: ThemeColors;
  DefaultTheme: ThemeColors;
}

interface AppConfigProps {
  name: string;
  slug: string;
  supportEmail: string;
  environment: 'sandbox' | 'production';
  region: 'us' | 'eu';
  termsUrl: string;
  privacyUrl: string;
  enableHealthConnect: boolean;
  enableHealthKit: boolean;
  colors: ThemeColorMap;
  fonts: any;
  shareText: string;

  /**
   * Only applicable to Android Health Connect.
   * See https://docs.tryvital.io/wearables/guides/android-health-connect#running-as-foreground-service.
   */
  syncNotificationContent: SyncNotificationContent;
}

export const AppConfig: AppConfigProps = {
  name: 'Vital Connect',
  slug: 'vitalconnect',
  supportEmail: 'support@tryvital.io',
  environment: 'sandbox',
  region: 'us',
  termsUrl: 'https://tryvital.io/terms',
  privacyUrl: 'https://tryvital.io/privacy',
  enableHealthConnect: true,
  enableHealthKit: true,
  shareText:
    'To start sharing you will need a share code. You partners should be able to provide this for you.',
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
  syncNotificationContent: {
    notificationTitle: "Vital Connect",
    notificationContent: "Vital Connect is syncing your health data.",
    channelName: "Vital Connect",
    channelDescription: "Notifies when Vital Connect is syncing your health data."
  }
};
