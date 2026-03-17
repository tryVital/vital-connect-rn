/* eslint-env jest */

require('react-native-gesture-handler/jestSetup');

jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({children}) => children,
  onlineManager: {
    setEventListener: jest.fn(),
  },
  useQuery: jest.fn(() => ({
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    refetch: jest.fn(async () => undefined),
  })),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(async () => ({isConnected: true})),
}));

jest.mock('@tryvital/vital-core-react-native', () => ({
  ManualProviderSlug: {
    AppleHealthKit: 'apple_health_kit',
    HealthConnect: 'health_connect',
  },
  VitalCore: {
    getVitalAPIHeaders: jest.fn(async () => ({
      Authorization: 'Bearer test-token',
      'X-Vital-iOS-SDK-Version': '0.0.0-test',
    })),
    signIn: jest.fn(async () => {}),
    signOut: jest.fn(async () => {}),
    status: jest.fn(async () => []),
  },
}));

jest.mock('@tryvital/vital-health-react-native', () => ({
  VitalHealthEvents: {
    statusEvent: 'Status',
  },
  VitalHealthReactNativeModule: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  VitalHealth: {
    askForResources: jest.fn(async () => 'success'),
    configure: jest.fn(async () => {}),
    disableBackgroundSync: jest.fn(async () => {}),
    enableBackgroundSync: jest.fn(async () => true),
    isAvailable: jest.fn(async () => true),
    isBackgroundSyncEnabled: Promise.resolve(true),
    openSyncProgressView: jest.fn(async () => {}),
    pauseSynchronization: Promise.resolve(false),
    setPauseSynchronization: jest.fn(async () => {}),
    setSyncNotificationContent: jest.fn(async () => {}),
  },
  VitalResource: {
    ActiveEnergyBurned: 'activeEnergyBurned',
    Activity: 'activity',
    BasalEnergyBurned: 'basalEnergyBurned',
    BloodPressure: 'bloodPressure',
    Body: 'body',
    Glucose: 'glucose',
    HeartRate: 'heartRate',
    Profile: 'profile',
    Sleep: 'sleep',
    Steps: 'steps',
    Workout: 'workout',
  },
}));
