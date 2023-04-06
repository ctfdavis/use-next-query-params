import { NextRouter } from 'next/router';
import { NextQueryParamsAdapter } from '../../types';
import { ParsedUrlQuery } from 'querystring';
import { NextRouterAdapterOptions } from '../../types/NextRouterAdapterOptions';

export function createNextRouterAdapter(
    nextRouter: NextRouter,
    options?: NextRouterAdapterOptions
): NextQueryParamsAdapter {
    const { mode, replace, shallow, onChange } = options || {};

    const defaultOnChange = (query: ParsedUrlQuery) => {
        const updateMethod = replace ? 'replace' : 'push';
        const updatedQuery = {
            ...nextRouter.query,
            ...query
        };

        nextRouter[updateMethod](
            {
                pathname: nextRouter.pathname,
                query: updatedQuery
            },
            undefined,
            { shallow: !!shallow }
        );
    };

    return {
        isRouterReady: nextRouter.isReady,
        query: nextRouter.query,
        mode,
        onChange: onChange || defaultOnChange
    };
}
