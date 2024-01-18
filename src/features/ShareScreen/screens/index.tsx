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
import {getData, clearAll, getUserId, getTeam} from '../../../lib/utils';
import {VitalCore} from '@tryvital/vital-core-react-native';
import {VitalHealth} from '@tryvital/vital-health-react-native';
import {ConnectDevicesCard} from '../../../components/Card/ShareDataCard';
import {Client} from '../../../lib/client';
import {useQuery} from '@tanstack/react-query';
import {useRefetchOnFocus} from '../../../hooks/query';

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
              Securely share your health data with one of our trusted
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
    <VStack space="xl" pt="$12" mx="$5">
      <H1 textAlign="left">Sharing data with</H1>
      <Pressable
        backgroundColor={colors.backgroundSection}
        sx={{borderRadius: 8, width: '100%'}}>
        <HStack
          px={'$5'}
          py={'$4'}
          alignItems="center"
          justifyContent="space-between"
          space="lg"
          overflow="hidden">
          <HStack alignItems="center" space="lg">
            {team.logo_url && <Image source={team.logo_url} alt={'logo_url'} />}
            <VStack space="xs" flexShrink={1}>
              <H2>{team.name}</H2>
              <HStack alignItems="center">
                <Box
                  width={10}
                  height={10}
                  borderRadius={10}
                  backgroundColor="green"
                  mr={5}
                />
                <Text fontType="light" size="xs" color={colors.secondary}>
                  Sharing health data.
                </Text>
              </HStack>
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
      </Pressable>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent backgroundColor={colors.backgroundSection}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleStopSharing}>
            <ActionsheetItemText color={colors.text} pb={20}>
              Stop sharing with {team.name}
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
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
    data: team,
    isError: isErrorTeam,
    error: errorTeam,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ['team'],
    queryFn: getTeam,
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
  useRefetchOnFocus(refetchTeam);
  useRefetchOnFocus(refetchUserId);
  useRefetchOnFocus(refetchConnectedProviders);

  return {
    userId,
    team,
    connectedProviders: connectedProviders || [],
    isLoading: userId && team ? isLoadingConnectedProviders : null,
    isError: isErrorConnectedSources || isErrorUser || isErrorTeam,
    error: errorConnectedSources || errorUser || errorTeam,
    refetchConnectedProviders,
    refetchTeam,
    refetchUserId,
  };
};

export const ShareScreen = ({navigation}: ShareStackScreenProps) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {userId, team, connectedProviders, refetchTeam, refetchUserId} =
    getConnectedDevices();
  const hasConnectedDevices = connectedProviders.length > 0;

  const handleDisconnect = async () => {
    await refetchTeam();
    await refetchUserId();
  };
  return (
    <SafeAreaView style={styles.container}>
      {team ? (
        <VStack space="4xl">
          <TeamItem
            team={team}
            colors={colors}
            onDisconnect={handleDisconnect}
          />
          {!hasConnectedDevices ? (
            <VStack mx={'$5'} space="md">
              <H1>My devices</H1>
              <ConnectDevicesCard
                onClick={() => navigation.navigate('Connect')}
              />
            </VStack>
          ) : null}
        </VStack>
      ) : (
        <NotSharing navigation={navigation} colors={colors} />
      )}
    </SafeAreaView>
  );
};
