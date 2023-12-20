import {VStack, Button, ButtonText} from '@gluestack-ui/themed';
import {useTheme} from '@react-navigation/native';
import {Text} from '../Text';

export const ShareDataCard = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  return (
    <VStack
      space="2xl"
      py={'$5'}
      px={'$4'}
      justifyContent="center"
      alignItems="center"
      bg={colors?.backgroundSection}
      borderRadius={8}>
      <Text fontType={'light'} textAlign="center" color={colors?.text}>
        Share your data with a company to get started
      </Text>
      <Button
        onPress={() => navigation.navigate('Connect Code')}
        backgroundColor="#5667C5"
        width={'100%'}
        borderRadius={12}>
        <ButtonText fontSize={'$sm'}>Share Data</ButtonText>
      </Button>
    </VStack>
  );
};
