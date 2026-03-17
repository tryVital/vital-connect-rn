module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@gluestack-ui|@gluestack-style|@legendapp|react-native-safe-area-context|react-native-svg))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
};
