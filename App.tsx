import React, { useEffect } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import {useColorScheme, NativeEventEmitter} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ShareStack,
  ConnectDeviceStack,
  HealthDataStack,
} from './src/navigation';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config'; //
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MCommIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import {ShareCodeModal} from './src/features/ShareScreen/screens/ShareCode';
import {
  LinkDeviceScreen,
  CallbackScreen,
} from './src/features/ConnectDevices/screens';
import {AppConfig} from './src/lib/config';
import {
  RootStackParamList,
  TabStackParamList,
} from './src/lib/models/navigation';
import {
  VitalHealth,
  VitalHealthEvents,
  VitalHealthReactNativeModule,
} from '@tryvital/vital-health-react-native';

const Tab = createBottomTabNavigator<TabStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNav = () => {
  const {colors} = useTheme();
  const healthEventEmitter = new NativeEventEmitter(
    VitalHealthReactNativeModule,
  );
  healthEventEmitter.addListener(
    VitalHealthEvents.statusEvent,
    (event: any) => {
      console.log('[Apple Health]', VitalHealthEvents.statusEvent, event);
    },
  );
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'ShareStack') {
            return <EntypoIcons name={'network'} size={size} color={color} />;
          } else if (route.name === 'ConnectDeviceStack') {
            return <MCommIcons name={'watch'} size={size} color={color} />;
          } else if (route.name === 'HealthDataStack') {
            return <EntypoIcons name={'heart'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="ShareStack"
        options={{title: 'Share Data'}}
        component={ShareStack}
      />
      <Tab.Screen
        name="HealthDataStack"
        options={{title: 'Health Data'}}
        component={HealthDataStack}
      />
      <Tab.Screen
        name="ConnectDeviceStack"
        component={ConnectDeviceStack}
        options={{title: 'My Devices'}}
      />
    </Tab.Navigator>
  );
};

const linking = {
  prefixes: [
    /* your linking prefixes */
    `${AppConfig.slug}://`,
  ],
  config: {
    /* configuration for matching screens with paths */
    screens: {
      ConnectionCallback: 'link',
    },
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useColorScheme();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const DefaultThemeCustom = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...AppConfig.colors.DefaultTheme,
    },
  };
  const DarkThemeCustom = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...AppConfig.colors.DarkTheme,
    },
  };

  useEffect(()=>{
    try{
      VitalHealth.syncData()
    }catch(e){
      console.warn("Failed to sync data")
    }
  },[])

  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer
        linking={linking}
        theme={theme === 'dark' ? DarkThemeCustom : DefaultThemeCustom}>
        <Stack.Navigator
          screenOptions={{headerShown: false, presentation: 'modal'}}>
          <Stack.Screen name="Tabs" component={TabNav} />
          <Stack.Screen name="Connect Code" component={ShareCodeModal} />
          <Stack.Screen name="Connect" component={LinkDeviceScreen} />
          <Stack.Screen
            name="ConnectionCallback"
            component={CallbackScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;
