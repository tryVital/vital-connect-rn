import {NavigatorScreenParams} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabStackParamList>;
  'Connect Code': undefined;
  Connect: undefined;
  ConnectionCallback: undefined;
};

export type ShareStackParamList = {
  'Share Data': undefined;
};

export type HealthDataStackParamList = {
  'Health Data': undefined;
};

export type ConnectDeviceStackParamList = {
  'Connect Device': undefined;
};

export type TabStackParamList = {
  ShareStack: NavigatorScreenParams<ShareStackParamList>;
  HealthDataStack: NavigatorScreenParams<HealthDataStackParamList>;
  ConnectDeviceStack: NavigatorScreenParams<ConnectDeviceStackParamList>;
};

export type ConnectCodeNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Connect Code'
>;

export type ConnectionCallbackNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'ConnectionCallback'
>;

export type ConnectNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Connect'
>;

export type ShareDataStackProps = NativeStackScreenProps<
  ShareStackParamList,
  'Share Data'
>;
export type HealthDataStackProps = NativeStackScreenProps<
  HealthDataStackParamList,
  'Health Data'
>;
export type ConnectDeviceStackProps = NativeStackScreenProps<
  ConnectDeviceStackParamList,
  'Connect Device'
>;

export type ShareStackProps = CompositeScreenProps<
  BottomTabScreenProps<TabStackParamList, 'ShareStack'>,
  StackScreenProps<RootStackParamList, 'Connect Code'>
>;

export type ShareStackScreenProps = CompositeScreenProps<
  StackScreenProps<ShareStackParamList, 'Share Data'>,
  ShareStackProps
>;
