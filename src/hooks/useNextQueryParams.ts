import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { removeKeysFromObject } from '../utils/removeKeysFromObject';
import { serializeQueryParamStates } from '../utils/query/serializeQueryParamStates';
import { areUrlQueriesEqual } from '../utils/query/areUrlQueriesEqual';
import { ParsedUrlQuery } from 'querystring';
import { NextQueryParams, NextQueryParamsAdapter } from '../types';
import { NextQueryParamsContext } from '../contexts/NextQueryParamsContext';
import { QueryParamState } from '../types/QueryParamState';
import { QueryParamStates } from '../types/QueryParamStates';
import { NextQueryParamsAdapterMode } from '../types/NextQueryParamsAdapterMode';
import { getChangedUrlQueryKeys } from '../utils/query/getChangedUrlQueryKeys';
import { baseSerializeQueryParam } from '../utils/query/baseSerializeQueryParam';

export function useNextQueryParams<T extends Record<string, unknown> = Record<string, any>>(
    params: NextQueryParams<T>,
    adapter?: Partial<NextQueryParamsAdapter>
) {
    const [init, setInit] = useState(true);
    const [prevUrlQuery, setPrevUrlQuery] = useState<ParsedUrlQuery>({});
    const prevHasUrlQueryChanged = useRef(false);
    const keys = Object.keys(params);
    const nextQueryParamsContextValues = useContext(NextQueryParamsContext);
    const contextAdapter = nextQueryParamsContextValues?.adapter;
    const isRouterReady =
        adapter?.isRouterReady !== undefined
            ? adapter.isRouterReady
            : contextAdapter?.isRouterReady !== undefined
            ? contextAdapter.isRouterReady
            : true;
    const urlQuery = adapter?.urlQuery || contextAdapter?.urlQuery;
    const onStateChange = adapter?.onChange || contextAdapter?.onChange;
    const mode: NextQueryParamsAdapterMode = adapter?.mode || contextAdapter?.mode || 'reset';
    const customSerializeQueryParam =
        adapter?.customSerializeQueryParam || contextAdapter?.customSerializeQueryParam;

    if (!onStateChange || !urlQuery) {
        throw new Error(
            'useNextQueryParams is used outside a NextQueryParamsProvider, but no `onChange` function or `urlQuery` was passed to the hook.'
        );
    }

    const uncontrolledKeys = Object.keys(urlQuery).filter((key) => !keys.includes(key));

    const queryParamStates = useMemo(() => {
        const queryParamStates: QueryParamStates = {};
        for (const [key, value] of Object.entries(params)) {
            queryParamStates[key] = {} as QueryParamState;
            if (value.value !== undefined && value.value !== null) {
                queryParamStates[key].value = value.value;
            }
            queryParamStates[key].serialize = value.serialize;
        }
        return queryParamStates;
    }, [params]);

    const hasUrlQueryChanged = useMemo(() => {
        return !areUrlQueriesEqual(urlQuery, prevUrlQuery);
    }, [urlQuery, prevUrlQuery]);

    const haveQueryParamStatesChanged = useMemo(() => {
        return !areUrlQueriesEqual(
            removeKeysFromObject(urlQuery, uncontrolledKeys),
            serializeQueryParamStates(queryParamStates, customSerializeQueryParam)
        );
    }, [queryParamStates, urlQuery]);

    const onInit = () => {
        for (const key of keys) {
            const value = urlQuery[key];
            value && params[key].onChange(value);
        }
        prevHasUrlQueryChanged.current = true;
        setPrevUrlQuery(urlQuery);
        setInit(false);
    };

    const onChange = () => {
        if (hasUrlQueryChanged) {
            const controlledChangedKeys = getChangedUrlQueryKeys(urlQuery, prevUrlQuery).filter(
                (key) => keys.includes(key)
            );
            for (const key of controlledChangedKeys) {
                const value = urlQuery[key];
                if (value === undefined) {
                    if (mode === 'reset') {
                        params[key].onReset();
                    }
                } else {
                    const serializedStateValue =
                        params[key] && params[key].serialize
                            ? params[key].serialize?.(params[key].value)
                            : customSerializeQueryParam
                            ? customSerializeQueryParam(params[key].value)
                            : baseSerializeQueryParam(params[key].value);
                    if (serializedStateValue !== value) {
                        params[key].onChange(value);
                        prevHasUrlQueryChanged.current = true;
                    }
                }
            }
            setPrevUrlQuery(urlQuery);
        } else if (haveQueryParamStatesChanged) {
            onStateChange(
                {
                    ...removeKeysFromObject(urlQuery, keys),
                    ...serializeQueryParamStates(queryParamStates, customSerializeQueryParam)
                },
                prevHasUrlQueryChanged.current
            );
            prevHasUrlQueryChanged.current = false;
        }
    };

    useEffect(() => {
        if (isRouterReady) {
            if (init) {
                onInit();
            } else {
                onChange();
            }
        }
    }, [init, isRouterReady, hasUrlQueryChanged, haveQueryParamStatesChanged]);
}
