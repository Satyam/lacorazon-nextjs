import useSWR from 'swr';

export enum ERR_CODE {
  NOT_FOUND = 404,
  DUPLICATE = 409,
  UNAUTHORIZED = 401,
}
export class FetchError extends Error {
  status: ERR_CODE | number;
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

export enum OP {
  LIST = 'list',
  GET = 'get',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type FetchOpReply<T> = {
  data?: T;
  error?: FetchError;
};

type AnyRecord = Record<string, any>;
type AnyRecordOrArray = AnyRecord | AnyRecord[];

export const getUseAPI =
  <T extends AnyRecordOrArray>({
    url,
    pre,
    post,
  }: {
    url: string;
    pre?: (d: T) => AnyRecordOrArray;
    post?: (r: AnyRecordOrArray) => T;
  }) =>
  async <Q extends AnyRecord = AnyRecord>({
    op,
    id,
    data,
    query,
  }: {
    op: OP;
    id?: ID;
    data?: T;
    query?: Q;
  }): Promise<{ data?: T; error?: Error }> => {
    const fullUrl = new URL(url, window.origin);
    if (query) {
      fullUrl.search = Object.keys(query).reduce(
        (q, k) => `${q}&${k}=${query[k]}`,
        ''
      );
    }
    return useSWR(fullUrl);
  };
export const serviceAPI =
  <T extends AnyRecordOrArray>({
    url,
    pre,
    post,
  }: {
    url: string;
    pre?: (d: T) => AnyRecordOrArray;
    post?: (r: AnyRecordOrArray) => T;
  }) =>
  async <Q extends AnyRecord = AnyRecord>({
    op,
    id,
    data,
    query,
  }: {
    op: OP;
    id?: ID;
    data?: T;
    query?: Q;
  }): Promise<{ data?: T; error?: Error }> => {
    const fullUrl = new URL(url, window.origin);
    if (query) {
      fullUrl.search = Object.keys(query).reduce(
        (q, k) => `${q}&${k}=${query[k]}`,
        ''
      );
    }
    const res = await fetch(fullUrl.toString(), {
      method: 'POST',
      body: JSON.stringify({
        op,
        id,
        data: pre && data ? pre(data) : data,
      }),
    });
    if (res.ok) {
      const outData = (await res.json().catch(() => '')) as T;
      return {
        data: post ? post(outData) : outData,
      };
    } else {
      return {
        error: new FetchError(res),
      };
    }
  };

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
