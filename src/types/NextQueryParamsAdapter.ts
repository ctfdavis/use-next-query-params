import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';
import { SerializeQueryParam } from './SerializeQueryParam';

export type NextQueryParamsAdapter = {
    readonly isRouterReady: boolean;
    readonly urlQuery: ParsedUrlQuery;
    readonly onChange: (urlQuery: ParsedUrlQuery) => void;
    /**
     * Determines how urlQuery params are updated during navigation within the same page component.
     * @default 'reset'
     * @remarks
     * - 'reset' - Updates urlQuery params to match the url urlQuery, and resets
     *   any unmatched urlQuery params to their initial values, reflecting these changes in the url urlQuery.
     * - 'merge' - Updates urlQuery params to match the url urlQuery, and then
     *   merges any unmatched urlQuery params with their current values in the url urlQuery.
     */
    readonly mode?: NextQueryParamsAdapterMode;
    readonly customSerializeQueryParam?: SerializeQueryParam;
};
