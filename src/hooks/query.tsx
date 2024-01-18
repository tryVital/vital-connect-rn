import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

/**
 * This hook will run on every app state change from background to foreground
 */
export function useAppStateActive(onChange = () => {}, runOnMount = true) {
  const appState = useRef(AppState.currentState);

  const _handleChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onChange();
      }
      appState.current = nextAppState;
    },
    [onChange],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', _handleChange);
    if (runOnMount) {
      onChange();
    }

    return () => {
      subscription.remove();
    };
  }, [_handleChange, onChange, runOnMount]);
}

export const useRefetchOnFocus = (
  refetch: () => void,
  /**
   * Time after refetch function will be refetched
   * If you don't want to cache the values, you can set this to `0`
   * **Default**: 1 minute / 60 seconds (60 * 1000)
   */
  time = 5 * 1000,
) => {
  const isFirstRun = useRef(false);
  const lastFetchTime = useRef(Date.now());
  useFocusEffect(
    useCallback(() => {
      if (!isFirstRun.current) {
        isFirstRun.current = true;
        return;
      }

      // Prevents refetching if the last fetch was less than 1 minute ago
      // Boosts performance and prevents unnecessary API calls
      if (Date.now() - lastFetchTime.current < time) {
        return;
      }
      lastFetchTime.current = Date.now();

      refetch();
    }, [refetch, time]),
  );

  useAppStateActive(refetch, false);
};
