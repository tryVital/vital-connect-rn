import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ShareScreen} from '../features/ShareScreen/screens';
import {ShareDataStackProps, ShareStackParamList} from '../lib/models/navigation';

const Stack = createStackNavigator<ShareStackParamList>();

export const ShareStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, presentation: 'modal'}}>
      <Stack.Screen name="Share Data" component={ShareScreen} />
    </Stack.Navigator>
  );
};
