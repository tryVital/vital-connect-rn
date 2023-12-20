import {AppConfig} from '../config';

const fetchData = async (
  method: 'GET' | 'POST' | 'DELETE',
  resource: string,
  body: Record<string, any> | null = null,
  headers: Record<string, string> | null = {},
) => {
  // You shu
  const resp = await fetch(`https://api.tryvital.io/v2${resource}`, {
    method: method,
    headers: {
      'x-vital-api-key': AppConfig.apiKey,
      Accept: 'application/json',
      'Content-type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (resp.status >= 400) {
    console.error('error', resp.text());
    throw new Error(await resp.text());
  }
  const data = await resp.json();
  return data;
};

// WE HIGHLY RECOMMEND YOU TO DO ALL CLIENT REQUESTS THROUGHT YOUR SERVER VS THIS CLIENT
// THIS IS ONLY FOR DEMO PURPOSES
export const Client = {
  User: {
    getConnectedSources: async (user_id: string) => {
      return await fetchData('GET', `/user/providers/${user_id}`).then(
        d => d.providers,
      );
    },
    disconnectProvider: async (user_id: string, provider_slug: string) => {
      return await fetchData('DELETE', `/user/${user_id}/${provider_slug}`);
    },
  },
  Providers: {
    getSupportedProviders: async () => {
      const data = await fetchData('GET', '/providers');
      return data.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        return 1;
      });
    },
  },
  Exchange: {
    exchangeCode: async (code: string) => {
      return await fetchData(
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
        'GET',
        `/summary/${data_type}/${userId}?start_date=${start_date}&end_date=${end_date}&provider=${provider}`,
      );
    },
  },
  Link: {
    connectProvider: async (user_id: string, provider_slug: string) => {
      return await fetchData(
        'POST',
        `/link/provider/manual/${provider_slug}`,
        {
          user_id: user_id,
        },
        {'Content-Type': 'application/json'},
      );
    },
    getLinkToken: async (user_id: string, redirect_url?: string) => {
      return await fetchData(
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
        'GET',
        `/link/provider/oauth/${provider_slug}`,
        null,
        {'x-vital-link-token': link_token},
      );
    },
  },
};
