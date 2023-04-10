import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';
import { SerializeQueryParam } from './SerializeQueryParam';

export type NextQueryParamsAdapter = {
    readonly isRouterReady: boolean;
    readonly urlQuery: ParsedUrlQuery;
    /**
     * Callback that is called when urlQuery params are updated.
     * @param urlQuery - The updated urlQuery params.
     * @param isTriggeredByUrl - whether the urlQuery params were updated by the url.
     * isTriggeredByUrl is useful for determining whether to use `replace` or `push` when updating the url.
     */
    readonly onChange: (urlQuery: ParsedUrlQuery, isTriggeredByUrl: boolean) => void;
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
    /**
     * Custom function for serializing query param values.
     * @remarks
     * If not provided, the default serialization function [`baseSerializeQueryParam`]('/src/utils/query/baseSerializeQueryParam.ts') will be used.
     */
    readonly customSerializeQueryParam?: SerializeQueryParam;
};
