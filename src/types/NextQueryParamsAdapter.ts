import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';

export type NextQueryParamsAdapter = {
    readonly isRouterReady: boolean;
    readonly query: ParsedUrlQuery;
    readonly onChange: (query: ParsedUrlQuery) => void;
    readonly mode?: NextQueryParamsAdapterMode;
};
