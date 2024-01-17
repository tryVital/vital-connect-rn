import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {VStack, Button, ButtonText} from '@gluestack-ui/themed';
import Octicons from 'react-native-vector-icons/Octicons';
import {makeStyles} from '../../../lib/theme';
import {useTheme} from '@react-navigation/native';
import {Text} from '../../../components/Text';

export const CallbackScreen = ({route, navigation}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    flex: 1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <VStack justifyContent={'space-between'} py={'$10'} mx={"$5"}>
        <VStack
          pt={'40%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          height={'100%'}>
          <VStack alignItems={'center'}>
            {route?.params?.state == 'success' ? (
              <Octicons name="check-circle-fill" size={100} color={'#00C48C'} />
            ) : (
              <Octicons name="x-circle-fill" size={100} color={'#FF0000'} />
            )}

            <VStack py={"$10"}>


            {route?.params?.state == 'success' ? (
              <Text
                color={colors.text}
                fontType="medium"
                fontSize={24}
                textTransform="capitalize"
                textAlign="center">
                {route?.params?.provider.replaceAll("_", " ",)} connected
                successfully
              </Text>
            ) : (
              <Text
                color={colors.text}
                fontType="medium"
                fontSize={24}
                textAlign="center">
                {route?.params?.provider} failed to connect
              </Text>
            )}
                        </VStack>

          </VStack>
          <Button
            backgroundColor={'black'}
            style={{width: '100%'}}
            py={4}
            bg={isDarkMode ? colors.backgroundSection : '$black'}
            onPress={() => navigation.navigate('Tabs')}>
            <Text color={"white"} fontType='medium' >Continue</Text>
          </Button>
        </VStack>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  heading: {
    fontSize: 50,
    fontWeight: '900',
    paddingVertical: 10,
  },
  text: {
    textTransform: 'capitalize', // 'uppercase' | 'lowercase' | 'capitalize' | 'none
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 20,
    paddingTop: 10,
  },
});
