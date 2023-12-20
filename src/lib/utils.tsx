import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from './models';

export const storeData = async (key: any, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

export function formatTimeString(seconds: number) {
  var hours = Math.floor(seconds / 3600);
  var remainingSeconds = seconds % 3600;
  var minutes = Math.floor(remainingSeconds / 60);
  return (hours !== 0 ? hours + 'h ' : '') + minutes + 'm';
}

export const getSDKDevicesForPlatform = (
  devices: Provider[],
  enableHealthConnect: boolean,
  enableHealthKit: boolean,
  currentPlatform: string,
) => {
  if (enableHealthConnect && currentPlatform === 'android') {
    return devices.filter(
      el => el.auth_type === 'oauth' || el.slug === 'health_connect',
    );
  } else if (enableHealthKit && currentPlatform === 'ios') {
    return devices.filter(
      el => el.auth_type === 'oauth' || el.slug === 'apple_health_kit',
    );
  } else {
    return devices.filter(el => el.auth_type === 'oauth');
  }
};
