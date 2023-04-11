import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';

export type NextRouterAdapterOptions = {
    /**
     * Determines how query params are updated during navigation within the same page component.
     * @default 'reset'
     * @remarks
     * - 'reset' - Updates urlQuery params to match the url urlQuery, and resets
     *   any unmatched urlQuery params to their initial values, reflecting these changes in the url urlQuery.
     * - 'merge' - Updates urlQuery params to match the url urlQuery, and then
     *   merges any unmatched urlQuery params with their current values in the url urlQuery.
     */
    readonly mode?: NextQueryParamsAdapterMode;
    /**
     * Whether to use `replace` or `push` when updating the url.
     * @remarks
     * - `true` - use `replace`
     * - `false` or `undefined` - use `push`
     */
    readonly replace?: boolean;
    /**
     * Whether to use shallow routing.
     */
    readonly shallow?: boolean;
    /**
     * Callback that is called when query param states are updated.
     * @param query - The updated URL query according to the latest query param states
     */
    readonly onChange?: (query: ParsedUrlQuery) => void;
};
