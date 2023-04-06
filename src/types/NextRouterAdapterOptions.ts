import { ParsedUrlQuery } from 'querystring';
import { NextQueryParamsAdapterMode } from './NextQueryParamsAdapterMode';

export type NextRouterAdapterOptions = {
    mode?: NextQueryParamsAdapterMode;
    replace?: boolean;
    shallow?: boolean;
    onChange?: (query: ParsedUrlQuery) => void;
};
