import {VitalCore} from '@tryvital/vital-core-react-native';
import {AppConfig} from '../config';
import {getData} from '../utils';

const vitalBaseUrlMap = {
  sandbox: {
    eu: 'https:/api.sandbox.eu.tryvital.io',
    us: 'https://api.sandbox.tryvital.io',
  },
  production: {
    eu: 'https://api.eu.tryvital.io',
    us: 'https://api.tryvital.io',
  },
};

const sdkProviders = [
  {
    name: 'Apple HealthKit',
    slug: 'apple_health_kit',
    auth_type: 'sdk',
    logo: 'https://storage.googleapis.com/vital-assets/apple_health.png',
    description:
      'HealthKit provides a central repository for health and fitness data on iPhone and Apple Watch.',
  },
  {
    name: 'Health Connect',
    slug: 'health_connect',
    auth_type: 'sdk',
    logo: 'https://storage.googleapis.com/vital-assets/HealthConnect.png',
    description: 'Google Health Connect.',
  },
];

const getBaseUrl = (
  environment: 'sandbox' | 'production',
  region: 'eu' | 'us',
) => {
  // @ts-ignore
  return vitalBaseUrlMap[environment.toLowerCase()][region.toLowerCase()];
};

const fetchDataAsync = async (
  method: 'GET' | 'POST' | 'DELETE',
  baseUrl: string,
  resource: string,
  body: Record<string, any> | null = null,
  headers: Record<string, string> | null = {},
) => {
  const resp = await fetch(`${baseUrl}/v2${resource}`, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (resp.status >= 400) {
    const text = await resp.text();
    console.warn('error', text);
    throw new Error(text);
  }
  const data = await resp.json();
  return data;
};

const fetchData = async (
  authType: 'sign_in_token' | 'none',
  method: 'GET' | 'POST' | 'DELETE',
  resource: string,
  body: Record<string, any> | null = null,
  headers: Record<string, string> | null = {},
) => {
  const baseUrl = getBaseUrl(AppConfig.environment, AppConfig.region);

  let allHeaders = {};
  if (authType === 'sign_in_token') {
    const sdkHeaders = await VitalCore.getVitalAPIHeaders();
    allHeaders = {
      ...headers,
      ...sdkHeaders,
    };
  } else {
    allHeaders = {...headers};
  }
  return await fetchDataAsync(method, baseUrl, resource, body, allHeaders);
};

// WE HIGHLY RECOMMEND YOU TO DO ALL CLIENT REQUESTS THROUGHT YOUR SERVER VS THIS CLIENT
// THIS IS ONLY FOR DEMO PURPOSES
export const Client = {
  User: {
    getConnectedSources: async (user_id: string) => {
      return await fetchData(
        'sign_in_token',
        'GET',
        `/user/providers/${user_id}`,
      ).then(d => d.providers);
    },
    disconnectProvider: async (user_id: string, provider_slug: string) => {
      return await fetchData(
        'sign_in_token',
        'DELETE',
        `/user/${user_id}/${provider_slug}`,
      );
    },
  },
  Providers: {
    getProvidersUsingLinkToken: async (linkToken: string) => {
      const data = await fetchData('none', 'GET', '/link/providers', null, {
        'x-vital-link-token': linkToken,
      });
      const allProviders = sdkProviders.concat(data);
      return allProviders.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        return 1;
      });
    },
    getOauthUrl: async (provider_slug: string, link_token: string) => {
      return await fetchData(
        'sign_in_token',
        'GET',
        `/link/provider/oauth/${provider_slug}`,
        null,
        {'x-vital-link-token': link_token},
      );
    },
    getProviders: async () => {
      const data = await fetchData('sign_in_token', 'GET', '/providers', null);
      return data.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        return 1;
      });
    },
  },
  Exchange: {
    exchangeCode: async (code: string) => {
      return await fetchData(
        'none',
        'POST',
        `/link/code/exchange?code=${code}&grant_type=sign_in_token`,
        {},
        {'Content-Type': 'application/json'},
      );
    },
  },
  Data: {
    getTimeseries: async (
      userId: string,
      data_type: string,
      start_date: string,
      end_date: string,
      provider: string,
    ) => {
      return await fetchData(
        'sign_in_token',
        'GET',
        `/timeseries/${userId}/${data_type}?start_date=${start_date}&end_date=${end_date}&provider=${provider}`,
      );
    },
    getSummary: async (
      userId: string,
      data_type: 'activity' | 'sleep' | 'workouts',
      start_date: string,
      end_date: string,
      provider: string,
    ) => {
      return await fetchData(
        'sign_in_token',
        'GET',
        `/summary/${data_type}/${userId}?start_date=${start_date}&end_date=${end_date}&provider=${provider}`,
      );
    },
  },
  Link: {
    getLinkToken: async (user_id: string, redirect_url?: string) => {
      return await fetchData(
        'sign_in_token',
        'POST',
        '/link/token',
        {
          user_id: user_id,
          redirect_url: redirect_url,
        },
        {'Content-Type': 'application/json'},
      );
    },
  },
};
