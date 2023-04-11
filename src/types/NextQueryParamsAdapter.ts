import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';
import { SerializeQueryParam } from './SerializeQueryParam';

export type NextQueryParamsAdapter = {
    /**
     * Whether the router is ready (i.e. whether the router has been initialized).
     */
    readonly isRouterReady: boolean;
    /**
     * The current query params in the url.
     */
    readonly urlQuery: ParsedUrlQuery;
    /**
     * Callback that is called when URL query params are updated.
     * @param urlQuery - The updated URL query params.
     * @param isTriggeredByUrl - whether the URL query params were updated by the url (i.e. triggered by navigation).
     * isTriggeredByUrl is useful for determining whether to use `replace` or `push` when updating the url.
     */
    readonly onChange: (urlQuery: ParsedUrlQuery, isTriggeredByUrl: boolean) => void;
    /**
     * Determines how query params are updated during navigation within the same page component.
     * @default 'reset'
     * @remarks
     * - 'reset' - Updates query param states to match the URL query params, and resets
     *   any unmatched query param states to their default values. Finally, reflect those changes in the URL query params.
     * - 'merge' - Updates query param states to match the URL query params, and then
     *   uses the current values of any unmatched query param states in the URL query.
     */
    readonly mode?: NextQueryParamsAdapterMode;
    /**
     * Custom function for serializing query param values.
     * @remarks
     * If not provided, the default serialization function [`baseSerializeQueryParam`]('/src/utils/query/baseSerializeQueryParam.ts') will be used.
     */
    readonly customSerializeQueryParam?: SerializeQueryParam;
};
