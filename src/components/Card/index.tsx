import {HStack, Pressable, VStack} from '@gluestack-ui/themed';
import {Text} from '../Text';

import {BarChart, LineChart} from 'react-native-svg-charts';
import {useTheme} from '@react-navigation/native';

const SideBarChart = ({
  data,
  type,
}: {
  data: Array<number>;
  type: 'bar' | 'line' | undefined;
}) => {
  const {colors} = useTheme();
  const fill = colors['purple.400'];
  return type == 'bar' ? (
    <BarChart
      style={{height: 80, width: '100%'}}
      data={data}
      svg={{fill}}
      spacingInner={0.4}
      contentInset={{top: 30, bottom: 10}}></BarChart>
  ) : (
    <LineChart
      style={{height: 80, width: '100%'}}
      data={data}
      svg={{stroke: fill}}
      contentInset={{top: 20, bottom: 20}}></LineChart>
  );
};

interface CardInfoProps {
  title: string;
  timestamp: string;
  subtitle: string;
  statistics: string | number;
  unit: string;
  icon: string | React.ReactNode;
  data?: Array<number>;
  onPress?: () => void;
  chartType?: 'bar' | 'line';
}
export const Card = ({cardInfo}: {cardInfo: CardInfoProps}) => {
  const {colors} = useTheme();
  return (
    <Pressable
      // onPress={cardInfo.onPress}
      bg={colors.backgroundSection}
      borderRadius={8}
      px={'$5'}
      py={'$3'}
      height={120}>
      <HStack width={'100%'} flex={1} justifyContent="space-between">
        <VStack justifyContent="space-between" flex={1} space="xs">
          <HStack>
            <Text fontSize={10} fontType="medium" pr={3}>
              {cardInfo.icon}
            </Text>
            <Text fontSize={14} fontType="medium">
              {cardInfo.title}
            </Text>
          </HStack>
          <HStack alignItems="flex-end" pt={'$2'}>
            <Text
              fontSize={32}
              color={colors.text}
              fontWeight="700"
              size={'2xl'}
              fontType="bold">
              {cardInfo.statistics}
            </Text>
            <Text fontWeight="700" color={'$black'} fontType={'bold'}>
              {cardInfo.unit}
            </Text>
          </HStack>
          <Text
            fontSize={12}
            fontWeight="400"
            color={colors.secondary}
            fontType="light">
            {cardInfo.subtitle}
          </Text>
        </VStack>
        <VStack width={'50%'} alignItems="flex-end">
          <Text fontSize={12} color={colors.secondary} fontType="light">
            {cardInfo.timestamp}
          </Text>

          <SideBarChart
            data={cardInfo.data ? cardInfo.data : []}
            type={cardInfo.chartType}
          />
        </VStack>
      </HStack>
    </Pressable>
  );
};
