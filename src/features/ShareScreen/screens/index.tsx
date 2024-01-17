import {
  Actionsheet,
  Box,
  HStack,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetContent,
  VStack,
  Image,
  ActionsheetItemText,
  Button,
  Pressable,
  ActionsheetBackdrop,
} from '@gluestack-ui/themed';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {H2, H1, Text} from '../../../components/Text';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../../../lib/theme';
import {ShareStackScreenProps} from '../../../lib/models/navigation';
import {getData, clearAll} from '../../../lib/utils';
import {VitalCore} from '@tryvital/vital-core-react-native';
import {VitalHealth} from '@tryvital/vital-health-react-native';
import {ConnectDevicesCard} from '../../../components/Card/ShareDataCard';
import {Client} from '../../../lib/client';

const NotSharing = ({
  navigation,
  colors,
}: {
  navigation: ShareStackScreenProps['navigation'];
  colors: any;
}) => {
  return (
    <VStack space="3xl" pt="$12" mx="$5">
      <VStack justifyContent="center" space="md" alignItems="center">
        <VStack justifyContent="center" space="xs" alignItems="center">
          <H1 textAlign="center">You're not sharing anything yet.</H1>
          <Text size="xs" textAlign="center" fontType="light">
            Make a selection below to get started!
          </Text>
        </VStack>
      </VStack>

      <Pressable
        onPress={() => navigation.navigate('Connect Code')}
        backgroundColor={colors.backgroundSection}
        sx={{borderRadius: 8}}>
        <HStack
          px={'$5'}
          py={'$4'}
          alignItems="center"
          space="lg"
          overflow="hidden">
          <Image source={require('../images/building.png')} alt={'building'} />
          <VStack space="xs" flexShrink={1}>
            <H2>App or Company</H2>
            <Text fontType="light" size="xs" color={colors.secondary}>
              Securely share your health records with one of our trusted
              partners
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </VStack>
  );
};

const TeamItem = ({
  team,
  colors,
  onDisconnect,
}: {
  team: any;
  colors: any;
  onDisconnect: () => void;
}) => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const handleStopSharing = async () => {
    await VitalHealth.cleanUp();
    await VitalCore.cleanUp();
    await clearAll();
    onDisconnect();
    handleClose();
  };
  return (
    <VStack space="3xl" pt="$10" mx="$5">
      <VStack justifyContent="center" space="md" alignItems="flex-start">
        <VStack justifyContent="center" space="xs" alignItems="flex-start">
          <H1 textAlign="left">Sharing Data With</H1>
        </VStack>
      </VStack>
      <Pressable
        backgroundColor={colors.backgroundSection}
        sx={{borderRadius: 8}}>
        <HStack
          px={'$5'}
          py={'$4'}
          alignItems="center"
          space="lg"
          overflow="hidden">
          {team.logo_url && <Image source={team.logo_url} alt={'logo_url'} />}
          <VStack space="xs" flexShrink={1}>
            <H2>{team.name}</H2>
            <HStack alignItems="center">
              <Box
                width={10}
                height={10}
                borderRadius={10}
                backgroundColor="green"
                mr={2}
              />
              <Text fontType="light" size="xs" color={colors.secondary}>
                Acitively sharing health data.
              </Text>
            </HStack>
          </VStack>
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
      </Pressable>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent backgroundColor={colors.backgroundSection}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleStopSharing}>
            <ActionsheetItemText color={colors.text} pb={20}>
              Stop Sharing with {team.name}
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};

export const ShareScreen = ({navigation}: ShareStackScreenProps) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [loading, setLoading] = React.useState(false);
  const [team, setTeam] = React.useState(null);
  const [hasConnectedDevices, setHasConnectedDevices] = React.useState(false);

  useEffect(() => {
    const getDevices = async () => {
      setLoading(true);
      try {
        const team = await getData('team');
        const userId = await getData('user_id');
        if (team && userId) {
          const devices = await Client.User.getConnectedSources(userId);
          if (devices.length > 0) {
            setHasConnectedDevices(true);
          }
          setTeam(team);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.warn(e);
        setLoading(false);
        setTeam(null);
        setHasConnectedDevices(false);
      }
    };

    getDevices();
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      // Call any action
      await getDevices();
    });
    return () => unsubscribe();
  }, [navigation]);

  const handleDisconnect = () => {
    setTeam(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {team ? (
        <VStack space="md">
          <TeamItem
            team={team}
            colors={colors}
            onDisconnect={handleDisconnect}
          />
          {!hasConnectedDevices && (
            <VStack mx={'$5'} space="md">
              <H1>My Devices</H1>
              <ConnectDevicesCard
                onClick={() => navigation.navigate('Connect')}
              />
            </VStack>
          )}
        </VStack>
      ) : (
        <NotSharing navigation={navigation} colors={colors} />
      )}
    </SafeAreaView>
  );
};
