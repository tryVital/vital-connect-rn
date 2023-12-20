import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { ConnectedDevicesScreen } from '../features/ConnectDevices/screens';
import { ConnectDeviceStackParamList } from '../lib/models/navigation';

const Stack = createStackNavigator<ConnectDeviceStackParamList>();

export const ConnectDeviceStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="Connect Device" component={ConnectedDevicesScreen} />
    </Stack.Navigator>
  );
};
