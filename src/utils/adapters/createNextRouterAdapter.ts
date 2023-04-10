import { NextRouter } from 'next/router';
import { NextQueryParamsAdapter } from '../../types';
import { ParsedUrlQuery } from 'querystring';
import { NextRouterAdapterOptions } from '../../types/NextRouterAdapterOptions';

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
