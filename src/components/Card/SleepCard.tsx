import {Card} from '.';
import {useSummaryData} from '../../hooks/Data';
import {formatTimeString} from '../../lib/utils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {format, subDays} from 'date-fns';
import {CardLoader} from './LoaderCard';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const DailySleep = ({
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

  const {data, isLoading, error} = useSummaryData(
    userId,
    'sleep',
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
  // @ts-ignore
  const sleep = data.map(el => (el.total == 0 ? 100 : el.total));
  return (
    <Card
      cardInfo={{
        title: 'Sleep Quality',
        // @ts-ignore
        timestamp: data.length > 0 ? format(data[0].date, 'MMM dd') : 'No data',
        subtitle: data.length > 0 ? `Efficiency ${data[0].efficiency} %` : '',
        statistics: data.length > 0 ? formatTimeString(data[0].total) : 0,
        unit: '',
        icon: <FontAwesome5 name="bed" size={15} color="#7D057D" solid />,
        data: sleep,
        chartType: 'bar',
      }}
    />
  );
};
