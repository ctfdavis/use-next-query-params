import React, { createContext, FC, PropsWithChildren } from 'react';
import { NextQueryParamsAdapter } from '../types';

type NextQueryParamsContextProps = {
    adapter: NextQueryParamsAdapter;
};

type NextQueryParamsProviderProps = PropsWithChildren<NextQueryParamsContextProps>;

export const NextQueryParamsContext = createContext<NextQueryParamsContextProps | null>(null);

/**
 * This provider allows you to set up the adapter for `useNextQueryParams` hook.
 *
 * @param props - the children and the adapter {@link NextQueryParamsAdapter}
 *
 * @example
 * ```tsx
 * function App({ Component, pageProps }: AppProps) {
 *  const router = useRouter();
 *  const adapter = new NextQueryParamsAdapter(router);
 *  return (
 *    <NextQueryParamsProvider adapter={adapter}>
 *        <Component {...pageProps} />
 *    </NextQueryParamsProvider>
 *  );
 * }
 * ```
 */
export const NextQueryParamsProvider: FC<NextQueryParamsProviderProps> = ({
    children,
    adapter
}) => {
    return (
        <NextQueryParamsContext.Provider
            value={{
                adapter
            }}
        >
            {children}
        </NextQueryParamsContext.Provider>
    );
};
