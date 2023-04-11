import { NextRouter } from 'next/router';
import { NextQueryParamsAdapter } from '../../types';
import { ParsedUrlQuery } from 'querystring';
import { NextRouterAdapterOptions } from '../../types/NextRouterAdapterOptions';

/**
 * Creates an adapter for use with `useNextQueryParams` hook.
 *
 * @param nextRouter - The next router instance
 * @param options - The options for the adapter {@link NextRouterAdapterOptions}
 *
 * @example
 * ```tsx
 * function App({ Component, pageProps }: AppProps) {
 *   const router = useRouter();
 *   const adapter = createNextRouterAdapter(router);
 *   return (
 *     <NextQueryParamsProvider adapter={adapter}>
 *       <Component {...pageProps} />
 *     </NextQueryParamsProvider>
 *   );
 * }
 * ```
 */
export function createNextRouterAdapter(
    nextRouter: NextRouter,
    options?: NextRouterAdapterOptions
): NextQueryParamsAdapter {
    const { mode, replace, shallow, onChange } = options || {};

    const defaultOnChange = (query: ParsedUrlQuery, isTriggeredByUrl: boolean) => {
        const updateMethod = replace || isTriggeredByUrl ? 'replace' : 'push';

        nextRouter[updateMethod](
            {
                pathname: nextRouter.pathname,
                query
            },
            undefined,
            { shallow: !!shallow }
        );
    };

    return {
        isRouterReady: nextRouter.isReady,
        urlQuery: nextRouter.query,
        mode,
        onChange: onChange || defaultOnChange
    };
}
