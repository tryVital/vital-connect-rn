import {useEffect, useState} from 'react';
import {Client} from '../lib/client';
import React from 'react';
import {getData} from '../lib/utils';
import {useQuery} from '@tanstack/react-query';
import {useFocusEffect} from '@react-navigation/native';

export const useSummaryData = (
  userId: string,
  summary: 'activity' | 'sleep' | 'workouts',
  startDate: string,
  endDate: string,
  provider: string,
) => {
  const {isLoading, isError, data, error} = useQuery({
    queryKey: ['summaryData', userId, summary, startDate, endDate, provider],
    queryFn: async () => {
      return await Client.Data.getSummary(
        userId,
        summary,
        startDate,
        endDate,
        provider,
      );
    },
  });
  return {data: data ? data[summary] : undefined, isLoading, isError, error};
};

interface TimeseriesData {
  value: number;
  timestamp: string;
  unit: string;
  type: string;
}
export const useTimeseriesData = (
  userId: string,
  timeseriesData: 'heartrate' | 'glucose',
  startDate: string,
  endDate: string,
  provider: string,
) => {
  const {isLoading, isError, data, error} = useQuery({
    queryKey: [
      'timeseriesData',
      userId,
      timeseriesData,
      startDate,
      endDate,
      provider,
    ],
    queryFn: async () => {
      return await Client.Data.getTimeseries(
        userId,
        timeseriesData,
        startDate,
        endDate,
        provider,
      );
    },
  });

  return {data, isLoading, isError, error};
};

export const getUserIdFromSession = navigation => {
  const [userId, setUserId] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      setLoading(true);
      try {
        const user_id = await getData('user_id');
        if (user_id) {
          setUserId(user_id);
          setLoading(false);
        } else {
          setLoading(false);
          setError('Failed to get user_id from session');
        }
      } catch (e) {
        setLoading(false);
        setError(JSON.stringify(e) as string);
      }
    };
    const unsubscribe = navigation.addListener('focus', async () => {
      // The screen is focused
      // Call any action
      await getUserId();
    });
    return () => unsubscribe();
  }, [navigation]);

  return {
    userId,
    isLoading: isLoading,
    error,
  };
};