import 'bootstrap/dist/css/bootstrap.css';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { ModalsProvider } from 'components/Modals/Provider';
import { AuthProvider } from 'components/AuthProvider';
import { swrFetcher } from 'lib/fetch';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 30000,
        fetcher: swrFetcher,
      }}
    >
      <AuthProvider>
        <ModalsProvider>
          <Component {...pageProps} />
        </ModalsProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
