import {Card} from '.';
import {useSummaryData} from '../../hooks/Data';
import {format, subDays} from 'date-fns';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CardLoader} from './LoaderCard';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const DailyStepsCard = ({
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
    'activity',
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
  const steps = data.map(el => (el.steps == 0 ? 100 : el.steps));
  return (
    <Card
      cardInfo={{
        title: 'Steps',
        // @ts-ignore
        timestamp: data.length > 0 ? format(data[0].date, 'MMM dd') : 'No data',
        subtitle: 'Normal',
        statistics: data.length > 0 ? data[0].steps : 0,
        unit: '',
        icon: <FontAwesome5 name="running" size={15} color="#826F2A" />,
        data: steps,
        chartType: 'bar',
      }}
    />
  );
};
