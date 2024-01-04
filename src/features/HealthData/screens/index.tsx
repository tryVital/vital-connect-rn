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
import {ShareDataCard} from '../../../components/Card/ShareDataCard';
import {getData, getSDKDevicesForPlatform} from '../../../lib/utils';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {AppConfig} from '../../../lib/config';
import {Client} from '../../../lib/client';
import {Provider} from '../../../lib/models';
import SelectDropdown from 'react-native-select-dropdown';

const DataCards = ({
  navigation,
  isLoading,
  error,
  userId,
  provider,
}: {
  navigation: any;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  provider: string;
}) => {

  if (!isLoading && error) {
    return (
      <VStack space="md">
        <Text fontType="light">
          Error in getting data please contact support {AppConfig.supportEmail}
        </Text>
      </VStack>
    );
  }
  return !error && userId && provider ? (
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
    <ShareDataCard navigation={navigation} />
  );
};

export const HealthDataScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const isDarkMode = useColorScheme() === 'dark';
  const [userId, setUserId] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [index, setIndex] = React.useState(0);
  
  useEffect(() => {
    const getUserId = async () => {
      setLoading(true);
      setError(null);
      try {
        const user_id = await getData('user_id');
        const linkToken = await Client.Link.getLinkToken(user_id)
        const supportedProviders =
          await Client.Providers.getProvidersUsingLinkToken(linkToken.link_token);
        setProviders(
          getSDKDevicesForPlatform(
            supportedProviders,
            AppConfig.enableHealthConnect,
            AppConfig.enableHealthKit,
            Platform.OS,
          ),
        );
        if (user_id) {
          setUserId(user_id);
          setLoading(false);
          setError(null);
        } else {
          setError(null);
          setUserId(null);
          setLoading(false);
        }
      } catch (e) {
        console.log({e})
        setLoading(false);
        setError(null);
      }
    };
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      // Call any action
      await getUserId();
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <VStack pt="$12" mx="$5">
        <H1>Latest measurements</H1>

        <SelectDropdown
          renderDropdownIcon={() => (
            <EntypoIcon
              name="chevron-down"
              size={14}
              color={colors['black.400']}
            />
          )}
          defaultButtonText="Select a provider"
          buttonTextStyle={{
            color: colors['black.400'],
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
      </VStack>
      <ScrollView mx={'$5'} paddingTop={16}>
        <DataCards
          provider={providers.length > 0 ? providers[index]?.slug : ''}
          isLoading={isLoading}
          error={error}
          userId={userId}
          navigation={navigation}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
