import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {VStack, ScrollView, HStack} from '@gluestack-ui/themed';
import {H1, Text} from '../../../components/Text';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../../../lib/theme';
import {DailyStepsCard} from '../../../components/Card/ActivityCard';
import {DailySleep} from '../../../components/Card/SleepCard';
import {HeartRateData} from '../../../components/Card/HeartRateCard';
import {DailyWorkouts} from '../../../components/Card/WorkoutsCard';
import {
  ConnectDevicesCard,
  ShareDataCard,
} from '../../../components/Card/ShareDataCard';
import {getData, getSDKDevicesForPlatform, getUserId} from '../../../lib/utils';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {AppConfig} from '../../../lib/config';
import {Client} from '../../../lib/client';
import {Provider} from '../../../lib/models';
import SelectDropdown from 'react-native-select-dropdown';
import {useQuery} from '@tanstack/react-query';
import {useRefetchOnFocus} from '../../../hooks/query';

const DataCards = ({
  navigation,
  isLoading,
  error,
  userId,
  provider,
  hasConnectedDevices,
}: {
  navigation: any;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  provider: string;
  hasConnectedDevices: boolean;
}) => {
  if (error || !userId || !provider) {
    return <ShareDataCard navigation={navigation} />;
  }
  return hasConnectedDevices ? (
    <VStack space="md">
      <DailyStepsCard
        userId={userId}
        isLoadingUser={isLoading}
        provider={provider}
      />
      <DailySleep
        userId={userId}
        isLoadingUser={isLoading}
        provider={provider}
      />
      <HeartRateData
        userId={userId}
        isLoadingUser={isLoading}
        provider={provider}
      />
      <DailyWorkouts
        userId={userId}
        isLoadingUser={isLoading}
        provider={provider}
      />
    </VStack>
  ) : (
    <ConnectDevicesCard onClick={() => navigation.navigate('Connect')} />
  );
};

const ProvidersDropdown = ({providers, setIndex, index, colors}) =>
  providers.length > 0 ? (
    <SelectDropdown
      renderDropdownIcon={() => (
        <EntypoIcon name="chevron-down" size={14} color={colors.secondary} />
      )}
      defaultButtonText="Select a device"
      buttonTextStyle={{
        color: colors.secondary,
        textAlign: 'left',
        fontSize: 14,
        fontFamily: 'Aeonik-Regular',
        paddingHorizontal: 0,
        marginHorizontal: 0,
      }}
      buttonStyle={{
        alignContent: 'flex-start',
        paddingHorizontal: 0,
        marginHorizontal: 0,

        height: 30,
        backgroundColor: 'transparent',
        width: '100%',
        justifyContent: 'flex-start',
      }}
      dropdownStyle={{borderRadius: 8}}
      rowTextStyle={{textAlign: 'left'}}
      data={providers.map(p => p.name)}
      onSelect={(selectedItem, index) => {
        setIndex(index);
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        // text represented after item is selected
        // if data array is an array of objects then return selectedItem.property to render after item is selected
        return selectedItem;
      }}
      rowTextForSelection={(item, index) => {
        // text represented for each item in dropdown
        // if data array is an array of objects then return item.property to represent item in dropdown
        return item;
      }}
    />
  ) : null;

export const getDataHooks = () => {
  const {
    data: userId,
    isError: isErrorUser,
    error: errorUser,
    refetch: refetchUserId,
  } = useQuery({
    queryKey: ['userId'],
    queryFn: getUserId,
    refetchInterval: 5 * 1000,
  });
  const {
    data: allProviders,
    isLoading: isLoadingProviders,
    isError: isErrorAllProviders,
    error: errorAllProviders,
    refetch: refetchAllProviders,
  } = useQuery({
    queryKey: ['providers', userId],
    queryFn: async () => {
      const data = await Client.Providers.getProviders();
      return getSDKDevicesForPlatform(
        data,
        AppConfig.enableHealthConnect,
        AppConfig.enableHealthKit,
        Platform.OS,
      );
    },
    refetchInterval: 10 * 1000,
    enabled: !!userId,
  });

  const {
    data: connectedProviders,
    isLoading: isLoadingConnectedProviders,
    isError: isErrorConnectedSources,
    error: errorConnectedSources,
    refetch: refetchConnectedProviders,
  } = useQuery({
    queryKey: ['connectedProviders', userId],
    queryFn: async () => await Client.User.getConnectedSources(userId),
    enabled: !!userId,
    refetchInterval: 10 * 1000,
  });

  useRefetchOnFocus(refetchUserId, 5 * 1000);
  useRefetchOnFocus(refetchAllProviders, 5 * 1000);
  useRefetchOnFocus(refetchConnectedProviders, 5 * 1000);

  return {
    userId,
    allProviders: allProviders || [],
    isLoading: isLoadingProviders || isLoadingConnectedProviders,
    connectedProviders: connectedProviders || [],
    isError: isErrorConnectedSources || isErrorAllProviders || isErrorUser,
    error: errorConnectedSources || errorAllProviders || errorUser,
  };
};

export const HealthDataScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const isDarkMode = useColorScheme() === 'dark';
  const [index, setIndex] = React.useState(0);

  const {userId, allProviders, connectedProviders, isLoading, error} =
    getDataHooks();

  const hasConnectedDevices =
    connectedProviders && connectedProviders.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <VStack pt="$12" mx="$5">
        <H1>Latest measurements</H1>
        {hasConnectedDevices ? (
          <ProvidersDropdown
            providers={allProviders}
            setIndex={setIndex}
            index={index}
            colors={colors}
          />
        ) : null}
      </VStack>
      <ScrollView mx={'$5'} paddingTop={16}>
        <DataCards
          provider={allProviders.length > 0 ? allProviders[index]?.slug : ''}
          isLoading={isLoading}
          error={error ? error.message : null}
          userId={userId}
          navigation={navigation}
          hasConnectedDevices={hasConnectedDevices}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
