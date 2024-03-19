import {
  SafeAreaView,
  Linking,
  StatusBar,
  useColorScheme,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Client} from '../../../lib/client';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Provider} from '../../../lib/models';
import {
  Actionsheet,
  Avatar,
  AvatarImage,
  Box,
  HStack,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetContent,
  VStack,
  ActionsheetItemText,
  Button,
  ScrollView,
  ActionsheetBackdrop,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Pressable,
} from '@gluestack-ui/themed';
import {H1, Text} from '../../../components/Text';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../../../lib/theme';
import {getUserId} from '../../../lib/utils';
import {
  ConnectDevicesCard,
  ShareDataCard,
} from '../../../components/Card/ShareDataCard';
import {DeviceCardLoader} from '../../../components/Card/LoaderCard';
import {VitalHealth} from '@tryvital/vital-health-react-native';
import {AppConfig} from '../../../lib/config';
import {useQuery} from '@tanstack/react-query';
import { useRefetchOnFocus } from '../../../hooks/query';
import { Switch } from 'react-native-gesture-handler';

const ListItem = ({
  userId,
  item,
  onDisconnect,
}: {
  item: Provider;
  userId: string;
  onDisconnect: () => void;
}) => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const {colors} = useTheme();
  const disconnectProvider = async (user_id: string) => {
    await Client.User.disconnectProvider(user_id, item.slug);
    await onDisconnect();
    handleClose();
  };

  const isSDKProvider = item.slug === 'apple_health_kit'
    || item.slug === 'health_connect';

  const [isHydratingSettings, setHydratingSettings] = useState<Boolean>(true);
  const [shouldPauseSync, setPauseSync] = useState<Boolean | undefined>(undefined);
  const [isBgSyncEnabled, setBgSyncEnabled] = useState<Boolean | undefined>(undefined);

  useEffect(() => {
    Promise
      .all([VitalHealth.pauseSynchronization, VitalHealth.isBackgroundSyncEnabled])
      .then(([paused, enabled]) => {
        setPauseSync(paused);
        setBgSyncEnabled(enabled);
        setHydratingSettings(false);
      });
  }, [userId]);

  const onBgSyncSwitchChange = (shouldEnable: boolean) => {
    if (Platform.OS !== 'android') {
      setBgSyncEnabled(true);
      return;
    }

    // Optimistic update
    setBgSyncEnabled(shouldEnable);

    if (shouldEnable) {
      VitalHealth.enableBackgroundSync()
        .then((success) => setBgSyncEnabled(success));
    } else {
      VitalHealth.disableBackgroundSync()
        .then(() => setBgSyncEnabled(false));
    }
  };
  const onShareSwitchChange = (shouldShare: boolean) => {
    setPauseSync(!shouldShare);
    VitalHealth.setPauseSynchronization(!shouldShare);
  };

  return (
    <Box
      px={'$5'}
      py="$3"
      mt={'$2'}
      opacity={1}
      justifyContent={'space-between'}
      sx={{
        borderRadius: 8,
        backgroundColor: colors.backgroundSection,
      }}
      borderRadius={10}>
      <HStack
        justifyContent="space-between"
        alignItems={'center'}
        width={'100%'}>
        <VStack>
          <HStack space={'lg'} justifyContent="flex-start" alignItems={'center'}>
            <Avatar size="sm">
              <AvatarImage source={item.logo} alt={item.name} />
            </Avatar>
            <VStack alignItems="flex-start">
              <Text color={colors.text} fontSize={16} fontType="medium">
                {item.name}
              </Text>
              <Text color={colors.secondary} fontSize={12} fontType="light">
                Connected
              </Text>
            </VStack>
          </HStack>

          {isSDKProvider && isHydratingSettings && (
            <ActivityIndicator />
          )}
          {isSDKProvider && !isHydratingSettings && <>
            {/** 
             * Optional SDK feature: Pause Data Synchronization
             * 
             * Pausing data sync **does not** reset sync state. It only stops new changes from
             * being pushed to Vital.
             **/}
            <HStack alignItems="center" space={'lg'} mt={16}>
              <Switch value={!shouldPauseSync} onValueChange={onShareSwitchChange} />
              <Text fontType="regular">Share New Data</Text>
            </HStack>

            {/** 
             * Optional SDK feature: Enable Android Background Sync (EXPERIMENTAL) 
             * 
             * To eanble Android Background Sync (Experimental), your Android app must possess
             * either of the two app permissions:
             * 
             * - [USE_EXACT_ALARM] (Android API Level 33+)
             *   * [VitalHealth.enableBackgroundSync] is non-interactive.
             *   * Your app does not require interactive permission request for Background Sync
             *   to be enabled.
             * 
             * - [SCHEDULE_EXACT_ALARM] (Android API Level 31+)
             *   * [VitalHealth.enableBackgroundSync] may be interactive.
             *   * If the user has not granted Alarms & Reminders permission to your app, the
             *     OS will prompt the user with an interactive permission request.
             * 
             * For iOS/HealthKit, you do not need to explicitly enable Background Sync, since the
             * grant is rooted at your app's HealthKit Background Delivery entitlement.
             * 
             * Having said that, any Background Sync related APIs shall return sensible states on iOS —
             * as if one has always enabled Background Sync — so that you can build a cross-platform UX
             * based on it.
             **/}
            {Platform.OS === 'android' && (
              <HStack alignItems="center" space={'lg'} mt={8}>
                <Switch value={isBgSyncEnabled ?? false} onValueChange={onBgSyncSwitchChange} />
                <Text fontType="regular">Allow Sync In Background</Text>
              </HStack>
            )}
          </>}
        </VStack>
        {!isSDKProvider && (
          <Button
            size="md"
            variant={'link'}
            action="primary"
            onPress={() => setShowActionsheet(!showActionsheet)}
            isDisabled={false}
            isFocusVisible={false}>
            <EntypoIcon
              name="dots-three-horizontal"
              size={15}
              color={colors.text}
            />
          </Button>
        )}
      </HStack>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent backgroundColor={colors.backgroundSection}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={() => disconnectProvider(userId)}>
            <ActionsheetItemText color={colors.text}>
              Disconnect
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Box>
  );
};

const DeviceList = ({
  isLoading,
  navigation,
  userId,
  devices,
  onDisconnect,
}: {
  isLoading: boolean;
  navigation: any;
  userId: string;
  devices: any;
  onDisconnect: any;
}) => {
  const {colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  if (isLoading)
    return (
      <DeviceCardLoader
        bgColor={colors.backgroundSection}
        isDarkMode={isDarkMode}
      />
    );
  if (!userId) return <ShareDataCard navigation={navigation} />;
  return devices && devices.length > 0 ? (
    devices.map(device => (
      <ListItem
        key={device.slug}
        userId={userId}
        item={device}
        onDisconnect={onDisconnect}
      />
    ))
  ) : (
    <ConnectDevicesCard onClick={() => navigation.navigate('Connect')} />
  );
};

const AddDeviceButton = ({
  colors,
  isDisabled,
  navigation,
}: {
  colors: any;
  isDisabled: boolean;
  navigation: any;
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const OpenUrl = async (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <HStack width={'100%'} justifyContent="flex-end" space="md">
      <Button
        size="md"
        variant={'link'}
        style={{
          width: 30,
          height: 30,
          borderRadius: 20,
          backgroundColor: colors.backgroundSection,
          borderWidth: 1,
          borderColor: 'rgba(144,144,144,0.3)',
        }}
        action="primary"
        onPress={() => setShowModal(true)}
        isDisabled={isDisabled}
        isFocusVisible={false}>
        <EntypoIcon name="info" size={14} color={colors.text} />
      </Button>
      <Button
        size="md"
        variant={'link'}
        style={{
          width: 30,
          height: 30,
          borderRadius: 20,
          backgroundColor: colors.backgroundSection,
          borderWidth: 1,
          borderColor: 'rgba(144,144,144,0.3)',
        }}
        action="primary"
        onPress={() => navigation.navigate('Connect')}
        isDisabled={isDisabled}
        isFocusVisible={false}>
        <EntypoIcon name="plus" size={20} color={colors.text} />
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <H1>App Info</H1>
            <ModalCloseButton>{/* <Icon as={CloseIcon} /> */}</ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="sm" py={'$4'}>
              <Pressable
                borderBottomWidth={1}
                pb={'$2'}
                borderColor={'rgba(144,144,144,0.1)'}>
                <Text fontType="medium">Contact: {AppConfig.supportEmail}</Text>
              </Pressable>
              <Pressable
                onPress={() => OpenUrl(AppConfig.termsUrl)}
                borderBottomWidth={1}
                pb={'$2'}
                borderColor={'rgba(144,144,144,0.1)'}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontType="medium">Terms & Conditions</Text>
                  <EntypoIcon
                    name="chevron-right"
                    size={15}
                    color={colors.text}
                  />
                </HStack>
              </Pressable>
              <Pressable
                onPress={() => OpenUrl(AppConfig.privacyUrl)}
                borderBottomWidth={1}
                pb={'$2'}
                borderColor={'rgba(144,144,144,0.1)'}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontType="medium">Privacy Policy</Text>
                  <EntypoIcon
                    name="chevron-right"
                    size={15}
                    color={colors.text}
                  />
                </HStack>
              </Pressable>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

const getConnectedDevices = () => {
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
  useRefetchOnFocus(refetchUserId)
  useRefetchOnFocus(refetchConnectedProviders)

  return {
    userId,
    connectedProviders: connectedProviders || [],
    isLoading: userId ? isLoadingConnectedProviders : null,
    isError: isErrorConnectedSources || isErrorUser,
    error: errorConnectedSources || errorUser,
    refetchConnectedProviders,
  };
};

export const ConnectedDevicesScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const isDarkMode = useColorScheme() === 'dark';
  const {
    userId,
    connectedProviders: devices,
    isLoading,
    isError,
    error,
    refetchConnectedProviders,
  } = getConnectedDevices();

  const onDisconnect = async () => {
    await refetchConnectedProviders();
  };
  
  console.log({userId, isLoading, isError, error})

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />

      <VStack height="$12" pt={'$5'} mx="$5">
        <AddDeviceButton
          isDisabled={!isLoading && userId ? false : true}
          colors={colors}
          navigation={navigation}
        />
      </VStack>
      <VStack mx="$5">
        <H1>My devices</H1>
      </VStack>

      <ScrollView sx={{flex: 1, mx: '$5'}}>
        <View style={{flex: 1, paddingTop: 16}}>
          <DeviceList
            isLoading={isLoading}
            navigation={navigation}
            userId={userId}
            onDisconnect={onDisconnect}
            devices={devices}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
