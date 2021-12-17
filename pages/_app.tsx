import 'bootstrap/dist/css/bootstrap.css';
import SSRProvider from 'react-bootstrap/SSRProvider';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { ModalsProvider } from 'components/Modals/Provider';
import { AuthProvider } from 'components/AuthProvider';
import { apiFetcher } from 'lib/fetch';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        fetcher: apiFetcher,
      }}
    >
      <AuthProvider>
        <SSRProvider>
          <ModalsProvider>
            <Component {...pageProps} />
          </ModalsProvider>
        </SSRProvider>
      </AuthProvider>
    </SWRConfig>
  );
}
// https://stackoverflow.com/questions/60899880/next-js-reduce-data-fetching-and-share-data-between-pages/61131312#61131312
