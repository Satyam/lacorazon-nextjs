import useSWR from 'swr';

export class FetchError extends Error {
  status: number;
  url: string;
  constructor(res: Response) {
    super(res.statusText);
    this.name = 'FetchError';
    this.status = res.status;
    this.url = res.url;
  }
  toString() {
    return `FetchError: ${this.message} Status: ${this.status} on fetch from  ${this.url}`;
  }
}

export const swrFetcher = (url: string, config?: RequestInit) => {
  return fetch(url, config).then((res) => {
    if (res.ok) {
      try {
        return res.json();
      } catch (_) {
        return {};
      }
    } else {
      throw new FetchError(res);
    }
  });
};

type FetchOpReply<T> = {
  data?: T;
  error?: FetchError;
};

export const localFetch = async <T extends Record<string, any>>(
  url: string,
  config?: RequestInit
): Promise<FetchOpReply<T>> => {
  return fetch(`${window.origin}${url}`, config).then(
    async (res): Promise<FetchOpReply<T>> => {
      if (res.ok) {
        try {
          return { data: await res.json() };
        } catch (_) {
          return {};
        }
      } else {
        return { error: new FetchError(res) };
      }
    }
  );
};
