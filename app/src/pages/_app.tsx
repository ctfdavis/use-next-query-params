import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextQueryParamsProvider, createNextRouterAdapter } from 'use-next-query-params';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [isReadyForTest, setIsReadyForTest] = useState(false);
    useEffect(() => {
        if (router.isReady) {
            setTimeout(() => {
                setIsReadyForTest(true);
            }, 0);
        }
    }, [router.isReady]);
    return (
        <NextQueryParamsProvider adapter={createNextRouterAdapter(router)}>
            <>
                <div id={isReadyForTest ? 'is-ready-for-test' : 'not-ready-for-test'} />
                <Component {...pageProps} />
            </>
        </NextQueryParamsProvider>
    );
}
