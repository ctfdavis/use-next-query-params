import { useContext, useMemo, useState } from 'react';
import { parseQueryParams } from '../utils/query/parseQueryParams';
import { areQueryParamsEqual } from '../utils/query/areQueryParamsEqual';
import { ParsedUrlQuery } from 'querystring';
import { NextQueryParams, NextQueryParamsAdapter } from '../types';
import { NextQueryParamsContext } from '../contexts/NextQueryParamsContext';
import { useDeepCompareEffect } from './useDeepCompareEffect';

export function useNextQueryParams(
    params: NextQueryParams,
    adapter?: Partial<NextQueryParamsAdapter>
) {
    const [init, setInit] = useState(true);
    const [prevQuery, setPrevQuery] = useState<ParsedUrlQuery>({});
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

    const onInit = () => {
        for (const key of keys) {
            const value = query[key];
            value && params[key].onChange(value);
        }
        setPrevQuery(query);
        setInit(false);
    };

    const onChange = () => {
        if (areQueryParamsEqual(prevQuery, query) || shouldUpdateQuery) {
            setShouldUpdateQuery(false);
            onStateChange({ ...query, ...parseQueryParams(state) });
        } else {
            for (const key of keys) {
                const value = query[key];
                if (value) {
                    params[key].onChange(value);
                } else {
                    setShouldUpdateQuery(mode !== 'default');
                    if (mode === 'reset') {
                        params[key].onChange(params[key].defaultValue);
                    }
                }
            }
            setPrevQuery(query);
        }
    };

    useDeepCompareEffect(() => {
        if (isRouterReady) {
            if (init) {
                onInit();
            } else {
                onChange();
            }
        }
    }, [init, isRouterReady, query, state, shouldUpdateQuery]);
}
