import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextQueryParamsProvider, createNextRouterAdapter } from 'use-next-query-params';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    return (
        <NextQueryParamsProvider adapter={createNextRouterAdapter(router)}>
            <Component {...pageProps} />
        </NextQueryParamsProvider>
    );
}
