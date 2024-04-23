import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Linking,
  View,
  useColorScheme,
  Platform,
} from 'react-native';
import {Client} from '../../../lib/client';
import {Provider} from '../../../lib/models';
import {
  Avatar,
  AvatarImage,
  Box,
  FlatList,
  HStack,
  Input,
  InputField,
  Pressable,
  Button,
  VStack,
} from '@gluestack-ui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppConfig} from '../../../lib/config';
import {H1, Text} from '../../../components/Text';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../../../lib/theme';
import {getData, getSDKDevicesForPlatform} from '../../../lib/utils';
import {ManualProviderSlug, VitalCore} from '@tryvital/vital-core-react-native';
import {VitalHealth, VitalResource} from '@tryvital/vital-health-react-native';

const handleOAuth = async (userId: string, item: Provider) => {
  const linkToken = await Client.Link.getLinkToken(
    userId,
    `${AppConfig.slug}://link`,
  );
  const link = await Client.Providers.getOauthUrl(item.slug, linkToken.link_token);

  Linking.openURL(link.oauth_url);
};

const ListItem = ({
  userId,
  item,
  navigation,
}: {
  userId: string;
  item: Provider;
  navigation: any;
}) => {
  const {colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setLoading] = useState(false);

  const handleNativeHealthKit = async () => {
    const providerSlug =
      Platform.OS == 'ios'
        ? ManualProviderSlug.AppleHealthKit
        : ManualProviderSlug.HealthConnect;

    setLoading(true);

    const isHealthSDKAvailable = await VitalHealth.isAvailable();
    if (!isHealthSDKAvailable) {
      console.warn('Health Connect is not available on this device.');
      navigation.navigate('ConnectionCallback', {
        state: 'failed',
        provider: providerSlug,
      });
      return;
    }
    try {
      await VitalHealth.configure({
        logsEnabled: true,
        numberOfDaysToBackFill: 30,
        androidConfig: {syncOnAppStart: true},
        iOSConfig: {
          dataPushMode: 'automatic',
          backgroundDeliveryEnabled: true,
        },
      });
    } catch (e) {
      setLoading(false);
      console.warn(`Failed to configure ${providerSlug}`, e);
      navigation.navigate('ConnectionCallback', {
        state: 'failed',
        provider: providerSlug,
      });
    }
    await VitalHealth.setUserId(userId);
    try {
      const outcome = await VitalHealth.askForResources([
        VitalResource.Steps,
        VitalResource.Activity,
        VitalResource.HeartRate,
        VitalResource.Sleep,
        VitalResource.Workout,
        VitalResource.BloodPressure,
        VitalResource.Glucose,
        VitalResource.Body,
        VitalResource.Profile,
        VitalResource.ActiveEnergyBurned,
        VitalResource.BasalEnergyBurned,
      ]);

      if (outcome != "success") {
        setLoading(false);
        return;
      }
      
      await VitalCore.createConnectedSourceIfNotExist(providerSlug);
      setLoading(false);
      navigation.navigate('ConnectionCallback', {
        state: 'success',
        provider: providerSlug,
      });
    } catch (e) {
      setLoading(false);
      console.warn('Failed to ask for resources', e);
      navigation.navigate('ConnectionCallback', {
        state: 'failed',
        provider: providerSlug,
      });
    }
  };

  const onPress = async () => {
    if (item.auth_type === 'oauth') {
      await handleOAuth(userId, item);
    } else if (
      item.slug === 'apple_health_kit' ||
      item.slug === 'health_connect'
    ) {
      await handleNativeHealthKit();
    }
  };

  return (
    <Pressable onPress={() => onPress()}>
      {({isHovered, isFocused, isPressed}) => {
        return (
          <Box
            borderBottomWidth="$1"
            borderColor={isDarkMode ? 'rgba(255,255,255,0.2)' : '$coolGray200'}
            py="$5"
            opacity={isPressed ? 0.6 : 1}>
            <HStack space={'md'} justifyContent="flex-start">
              <Avatar size="md">
                <AvatarImage source={item.logo} alt={item.name} />
              </Avatar>
              <VStack>
                <Text color={colors.text} fontType="medium">
                  {item.name}
                </Text>
                <Text
                  fontType="regular"
                  color={colors.secondary}
                  size="xs"
                  flexShrink={1}
                  flexWrap="wrap">
                  {item.description}
                </Text>
              </VStack>
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export const LinkDeviceScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [devices, setDevices] = React.useState<Provider[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const [userId, setUserId] = React.useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '' && text.length <= 2) {
      setDevices(providers);
    } else {
      const filtered = providers.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setDevices(filtered);
    }
  };
  useEffect(() => {
    const getDevices = async () => {
      setLoading(true);
      setError(null);
      const user_id = await getData('user_id');
      if (user_id) {
        const devices = await Client.Providers.getProviders();
        setLoading(false);
        setUserId(user_id);
        setDevices(
          getSDKDevicesForPlatform(
            devices,
            AppConfig.enableHealthConnect,
            AppConfig.enableHealthKit,
            Platform.OS,
          ),
        );
        setProviders(
          getSDKDevicesForPlatform(
            devices,
            AppConfig.enableHealthConnect,
            AppConfig.enableHealthKit,
            Platform.OS,
          ),
        );
      } else {
        setUserId('');
        setLoading(false);
        console.warn('Failed to get all supported providers');
        setError('Failed to get devices');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDevices();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 16,
          flex: 1,
          width: '100%',
        }}>
        <VStack pb={10}>
          <HStack
            justifyContent={'space-between'}
            py={'$3'}
            alignItems="center">
            <H1>Connect a Device</H1>
            <Button onPress={() => navigation.goBack()} variant="link">
              <Ionicons name="close-outline" size={25} color={colors.text} />
            </Button>
          </HStack>
          <Input
            variant="outline"
            size="lg"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}>
            <InputField
              color={colors.text}
              fontFamily={AppConfig.fonts.regular}
              onChangeText={handleSearch}
              value={searchText}
              placeholder="Search"
            />
          </Input>
        </VStack>

        {!loading && error ? (
          <VStack>
            <Text fontType="light">Failed to get supported Providers</Text>
          </VStack>
        ) : (
          <FlatList
            data={devices}
            renderItem={({item}) => (
              <ListItem userId={userId} item={item} navigation={navigation} />
            )}
            keyExtractor={item => item.slug}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
