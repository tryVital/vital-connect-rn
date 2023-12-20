import {VStack} from '@gluestack-ui/themed';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';

export const CardLoader = props => (
  <VStack
    bg={props.bgColor}
    borderRadius={8}
    height={120}
    px={'$3'}
    py={'$4'}
    width={'100%'}>
    <ContentLoader
      speed={2}
      style={{width: '100%', height: '120'}}
      viewBox="0 0 250 100"
      backgroundColor={props.isDarkMode ? 'rgba(144,144,144,0.1)' : '#f3f3f3'}
      foregroundColor={props.isDarkMode ? 'rgba(144,144,144,0.2)' : '#ecebeb'}
      {...props}>
      <Rect x="0" y="0" rx="3" ry="3" width="60" height="10" />
      <Rect x="0" y="25" rx="3" ry="3" width="100" height="20" />
      <Rect x="0" y="60" rx="3" ry="3" width="60" height="10" />
    </ContentLoader>
  </VStack>
);

export const DeviceCardLoader = props => (
  <VStack
    bg={props.bgColor}
    borderRadius={8}
    height={80}
    px={'$3'}
    py={'$4'}
    width={'100%'}>
    <ContentLoader
      speed={2}
      style={{width: '100%', height: '80'}}
      viewBox="0 0 300 80"
      backgroundColor={props.isDarkMode ? 'rgba(144,144,144,0.1)' : '#f3f3f3'}
      foregroundColor={props.isDarkMode ? 'rgba(144,144,144,0.2)' : '#ecebeb'}
      {...props}>
      <Circle cx="20" cy="22" r="20" />
      <Rect x="55" y="5" rx="3" ry="3" width="60" height="12" />
      <Rect x="55" y="30" rx="3" ry="3" width="100" height="12" />
    </ContentLoader>
  </VStack>
);
