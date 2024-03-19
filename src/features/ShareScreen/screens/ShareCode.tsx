import {
  VStack,
  Image,
  Input,
  InputField,
  Button,
  ButtonText,
  Spinner,
  ModalCloseButton,
  HStack,
} from '@gluestack-ui/themed';
import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {AppConfig} from '../../../lib/config';
import {H1, Text} from '../../../components/Text';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../../../lib/theme';
import {Client} from '../../../lib/client';
import {storeData} from '../../../lib/utils';
import {VitalCore} from '@tryvital/vital-core-react-native';
import {VitalHealth} from '@tryvital/vital-health-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ShareCodeModal = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const isDarkMode = useColorScheme() === 'dark';
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<null | string>(null);

  const exchangeCode = async () => {
    setLoading(true);

    const status = await VitalCore.status();
    if (status.includes("signedIn")) {
      await VitalCore.signOut();
    }

    try {
      setError(null);
      const resp = await Client.Exchange.exchangeCode(code);
      await VitalCore.signIn(resp.sign_in_token);

      await storeData('team', resp.team);
      await storeData('user_id', resp.user_id);

      setLoading(false);
      navigation.goBack();
    } catch (e) {
      setError(
        `Failed to sign in with token, please contact ${AppConfig.supportEmail} for help.`,
      );
      setLoading(false);
      console.warn(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HStack width={'100%'} justifyContent="flex-end" px={16} pt={16}>
        <Button
          size="md"
          variant={'link'}
          action="primary"
          onPress={() => navigation.goBack()}
          isDisabled={false}
          isFocusVisible={false}>
          <Ionicons name="close" size={25} color={colors.text} />
        </Button>
      </HStack>
      <VStack space="sm" pt="$5" mx="$5" alignItems="center">
        <H1 textAlign="center">Share your health data</H1>
        <Text
          size="xs"
          textAlign="center"
          color={colors.secondary}
          fontType="regular">
          {AppConfig.shareText}
        </Text>

        <VStack space="3xl" alignItems="center" width={'100%'} pt={'$10'}>
          <Image
            source={require('../images/WatchScreen.png')}
            w="$32"
            alt={'watches'}
          />
          <Input
            variant="outline"
            size="lg"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}>
            <InputField
              color={colors.text}
              placeholder="Share Code"
              value={code}
              onChange={e => setCode(e.nativeEvent.text)}
              fontFamily={AppConfig.fonts.regular}
            />
          </Input>

          <Button
            width={'100%'}
            size="md"
            variant="solid"
            action="primary"
            onPress={exchangeCode}
            bg={isDarkMode ? colors.backgroundSection : '$black'}
            isDisabled={code.length < 6}
            isFocusVisible={false}>
            {loading ? (
              <Spinner color="$white" />
            ) : (
              <ButtonText>Share Data</ButtonText>
            )}
          </Button>
          {error && (
            <Text color={'red'} fontType="light" width={"100%"} textAlign='center'>
              {error}
            </Text>
          )}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};
