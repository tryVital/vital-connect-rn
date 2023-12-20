import {Card} from '.';
import {useTimeseriesData} from '../../hooks/Data';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {format, subDays} from 'date-fns';
import {CardLoader} from './LoaderCard';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const HeartRateData = ({
  userId,
  isLoadingUser,
  provider,
}: {
  userId: string;
  isLoadingUser: boolean;
  provider: string;
}) => {
  const {colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const {data, isLoading, error} = useTimeseriesData(
    userId,
    'heartrate',
    // @ts-ignore
    format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    // @ts-ignore
    format(new Date(), 'yyyy-MM-dd'),
    provider,
  );

  if ((isLoading || isLoadingUser) && !error)
    return (
      <CardLoader bgColor={colors.backgroundSection} isDarkMode={isDarkMode} />
    );
  const hrData = data.map(el => (el.value == 0 ? 100 : el.value));
  return (
    <Card
      cardInfo={{
        title: 'Heart Rate',
        timestamp:
          // @ts-ignore
          data.length > 0 ? format(data[0].timestamp, 'MMM dd') : 'No data',
        subtitle: 'Normal',
        statistics: data.length > 0 ? hrData[0] : 0,
        unit: '',
        icon: <FontAwesome5 name="heart" size={15} color="#BE413D" solid />,
        data: hrData,
        chartType: 'line',
      }}
    />
  );
};
