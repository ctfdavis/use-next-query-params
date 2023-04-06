import { useContext, useEffect, useMemo, useState } from 'react';
import { parseQueryParams } from '../utils/query/parseQueryParams';
import { areQueryParamsEqual } from '../utils/query/areQueryParamsEqual';
import { ParsedUrlQuery } from 'querystring';
import { NextQueryParams, NextQueryParamsAdapter } from '../types';
import { NextQueryParamsContext } from '../contexts/NextQueryParamsContext';
import isEqual from 'react-fast-compare';

export function useNextQueryParams(
    params: NextQueryParams,
    adapter?: Partial<NextQueryParamsAdapter>
) {
    const [init, setInit] = useState(true);
    const [prevQuery, setPrevQuery] = useState<ParsedUrlQuery>({});
    const [prevState, setPrevState] = useState<Record<string, any>>({});
    const [shouldUpdateQuery, setShouldUpdateQuery] = useState(false);
    const keys = Object.keys(params);
    const nextQueryParamsContextValues = useContext(NextQueryParamsContext);
    const contextAdapter = nextQueryParamsContextValues?.adapter;
    const isRouterReady =
        adapter?.isRouterReady !== undefined
            ? adapter.isRouterReady
            : contextAdapter?.isRouterReady !== undefined
            ? contextAdapter.isRouterReady
            : true;
    const query = adapter?.query || contextAdapter?.query;
    const onStateChange = adapter?.onChange || contextAdapter?.onChange;
    const mode = adapter?.mode || contextAdapter?.mode || 'default';

    if (!onStateChange || !query) {
        throw new Error(
            'useNextQueryParams is used outside a NextQueryParamsProvider, but no `onChange` function or `query` was passed to the hook.'
        );
    }

    const state = useMemo(() => {
        const state: Record<string, any> = {};
        for (const [key, value] of Object.entries(params)) {
            if (value.value !== undefined) {
                state[key] = value.value;
            }
        }
        return state;
    }, [params]);

    const hasQueryChanged = useMemo(() => {
        return !areQueryParamsEqual(query, prevQuery);
    }, [query, prevQuery]);

    const onInit = () => {
        for (const key of keys) {
            const value = query[key];
            value && params[key].onChange(value);
        }
        setPrevQuery(query);
        setInit(false);
    };

    const onChange = () => {
        if (hasQueryChanged) {
            for (const key of keys) {
                const value = query[key];
                if (value === undefined) {
                    setShouldUpdateQuery(mode !== 'default');
                    if (mode === 'reset') {
                        params[key].onReset();
                    }
                } else {
                    params[key].onChange(value);
                }
            }
            setPrevQuery(query);
        } else if (shouldUpdateQuery) {
            onStateChange({ ...query, ...parseQueryParams(state) });
            setShouldUpdateQuery(false);
        } else if (!isEqual(prevState, state)) {
            setShouldUpdateQuery(true);
            setPrevState(state);
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
    }, [init, isRouterReady, state, hasQueryChanged, shouldUpdateQuery]);
}
