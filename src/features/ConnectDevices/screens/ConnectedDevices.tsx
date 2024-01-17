import {
  SafeAreaView,
  Linking,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
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
import {getData} from '../../../lib/utils';
import {
  ConnectDevicesCard,
  ShareDataCard,
} from '../../../components/Card/ShareDataCard';
import {DeviceCardLoader} from '../../../components/Card/LoaderCard';
import {VitalHealth} from '@tryvital/vital-health-react-native';
import {AppConfig} from '../../../lib/config';

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
    if (item.slug == 'apple_health_kit') {
      await VitalHealth.cleanUp();
    }
    await Client.User.disconnectProvider(user_id, item.slug);
    await onDisconnect();
    handleClose();
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
        <HStack space={'lg'} justifyContent="flex-start" alignItems={'center'}>
          <Avatar size="sm">
            <AvatarImage source={item.logo} alt={item.name} />
          </Avatar>
          <VStack>
            <Text color={colors.text} fontSize={16} fontType="medium">
              {item.name}
            </Text>
            <Text color={colors.secondary} fontSize={12} fontType="light">
              Connected
            </Text>
          </VStack>
        </HStack>
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

export const ConnectedDevicesScreen = ({navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [devices, setDevices] = React.useState<Provider[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string>('');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const getDevices = async () => {
      setLoading(true);
      try {
        const userId = await getData('user_id');
        if (userId) {
          const devices = await Client.User.getConnectedSources(userId);
          setUserId(userId);
          setDevices(devices);
          setLoading(false);
        } else {
          setUserId('');
          setLoading(false);
          setDevices([]);
          setError(
            'No user_id is set, please share data with an app or company first',
          );
        }
      } catch (e) {
        console.warn(e);
        setError('Failed to get devices');
        setLoading(false);
      }
    };
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      // Call any action
      await getDevices();
    });
    return () => unsubscribe();
  }, [navigation]);

  const onDisconnect = async () => {
    const devices = await Client.User.getConnectedSources(userId);
    setDevices(devices);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />

      <VStack height="$12" pt={'$5'} mx="$5">
        <AddDeviceButton
          isDisabled={!loading && userId ? false : true}
          colors={colors}
          navigation={navigation}
        />
      </VStack>
      <VStack mx="$5">
        <H1>My Devices</H1>
      </VStack>

      <ScrollView sx={{flex: 1, mx: '$5'}}>
        <View style={{flex: 1, paddingTop: 16}}>
          <DeviceList
            isLoading={loading}
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
