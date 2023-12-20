import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { HealthDataScreen } from '../features/HealthData/screens';
import { HealthDataStackParamList } from '../lib/models/navigation';

const Stack = createStackNavigator<HealthDataStackParamList>();

export const HealthDataStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Health Data" component={HealthDataScreen} />
    </Stack.Navigator>
  );
};
