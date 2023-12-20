import {useEffect, useState} from 'react';
import {Client} from '../lib/client';
import React from 'react';
import {getData} from '../lib/utils';

export const useSummaryData = (
  userId: string,
  summary: 'activity' | 'sleep' | 'workouts',
  startDate: string,
  endDate: string,
  provider: string,
) => {
  const [allData, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await Client.Data.getSummary(
          userId,
          summary,
          startDate,
          endDate,
          provider,
        );
        setData(data);
        setLoading(false);
      } catch (e) {
        console.warn(e);
        setError('Failed to get data');
        setLoading(false);
      }
    };
    getData();
  }, [userId, provider]);

  //   @ts-ignore
  return {data: allData[summary], isLoading: loading, error};
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
  const [allData, setData] = useState<TimeseriesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data: TimeseriesData[] = await Client.Data.getTimeseries(
          userId,
          timeseriesData,
          startDate,
          endDate,
          provider,
        );
        setData(data);
        setLoading(false);
      } catch (e) {
        console.warn(e);
        setError('Failed to get data');
        setLoading(false);
      }
    };
    getData();
  }, []);

  //   @ts-ignore
  return {data: allData, isLoading: loading, error};
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
