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
    console.log('error', await resp.text());
    console.error('error', resp.text());
    throw new Error(await resp.text());
  }
  const data = await resp.json();
  return data;
};

const fetchData = async (
  authType: 'sign_in_token' | 'api_key' | 'none',
  method: 'GET' | 'POST' | 'DELETE',
  resource: string,
  body: Record<string, any> | null = null,
  headers: Record<string, string> | null = {},
) => {
  const baseUrl = getBaseUrl(AppConfig.environment, AppConfig.region);

  let allHeaders = {};
  if (authType === 'sign_in_token') {
    const token = await getData('sign_in_token');
    if (!token) throw new Error('Failed to get signin token');
    allHeaders = {
      ...headers,
      Authorization: `Bearer ${token}`,
      'x-vital-ios-sdk-version': '2.0.0',
    };
  } else if (authType === 'api_key') {
    const apiKey = await getData('api_key');
    if (!apiKey) throw new Error('Failed to get api_key');
    allHeaders = {...headers, 'x-vital-api-key': apiKey};
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
        'api_key',
        'GET',
        `/user/providers/${user_id}`,
      ).then(d => d.providers);
    },
    disconnectProvider: async (user_id: string, provider_slug: string) => {
      return await fetchData(
        'api_key',
        'DELETE',
        `/user/${user_id}/${provider_slug}`,
      );
    },
  },
  Providers: {
    getSupportedProviders: async () => {
      const data = await fetchData('api_key', 'GET', '/providers');
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
        `/link/code/exchange?code=${code}&grant_type=api_key`,
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
        'api_key',
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
        'api_key',
        'GET',
        `/summary/${data_type}/${userId}?start_date=${start_date}&end_date=${end_date}&provider=${provider}`,
      );
    },
  },
  Link: {
    getLinkToken: async (user_id: string, redirect_url?: string) => {
      return await fetchData(
        'api_key',
        'POST',
        '/link/token',
        {
          user_id: user_id,
          redirect_url: redirect_url,
        },
        {'Content-Type': 'application/json'},
      );
    },
    getOauthUrl: async (provider_slug: string, link_token: string) => {
      return await fetchData(
        'api_key',
        'GET',
        `/link/provider/oauth/${provider_slug}`,
        null,
        {'x-vital-link-token': link_token},
      );
    },
  },
};
