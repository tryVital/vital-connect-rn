import {Card} from '.';
import {useSummaryData} from '../../hooks/Data';
import {formatTimeString} from '../../lib/utils';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {format, subDays, differenceInSeconds} from 'date-fns';
import {CardLoader} from './LoaderCard';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';

export const DailyWorkouts = ({
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
    'workouts',
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

  if (data.length == 0) {
    return (
      <Card
        cardInfo={{
          title: 'Workouts',
          // @ts-ignore
          timestamp: 'No data',
          subtitle: '0 kcal',
          statistics: '0m',
          unit: '',
          icon: <FontAwesome5 name="running" size={15} color="#826F2A" solid />,
          data: [],
          chartType: 'bar',
        }}
      />
    );
  }
  const workout = data.length > 0 ? data[0] : null;
  return workout ? (
    <Card
      cardInfo={{
        title: workout.sport.name,
        // @ts-ignore
        timestamp: format(workout.time_start, 'MMM dd'),
        subtitle: Math.round(workout.calories) + ' kcal',
        statistics: formatTimeString(
          // @ts-ignore
          differenceInSeconds(
            new Date(workout.time_end),
            new Date(workout.time_start),
          ),
        ),
        unit: '',
        icon: <FontAwesome5 name="running" size={15} color="#826F2A" solid />,
        data: [],
        chartType: 'bar',
      }}
    />
  ) : null;
};
