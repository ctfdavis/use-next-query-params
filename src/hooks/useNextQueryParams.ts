import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { removeKeysFromObject } from '../utils/removeKeysFromObject';
import { serializeQueryParamStates } from '../utils/query/serializeQueryParamStates';
import { areUrlQueriesEqual } from '../utils/query/areUrlQueriesEqual';
import { ParsedUrlQuery } from 'querystring';
import { NextQueryParams, NextQueryParamsAdapter } from '../types';
import { NextQueryParamsContext } from '../contexts/NextQueryParamsContext';
import { QueryParamStates } from '../types/QueryParamStates';
import { NextQueryParamsAdapterMode } from '../types/NextQueryParamsAdapterMode';
import { getChangedUrlQueryKeys } from '../utils/query/getChangedUrlQueryKeys';
import { baseSerializeQueryParam } from '../utils/query/baseSerializeQueryParam';
import { areUrlQueryValuesEqual } from '../utils/query/areUrlQueryValuesEqual';
import { UseNextQueryParamsReturn } from '../types/UseNextQueryParams';

/**
 * The `useNextQueryParams` hook registers query param states and updates the URL query params when the states change.
 *
 * @param params - The query param states to register. {@link NextQueryParams}
 * @param adapter - The router adapter to use for interacting with the URL query params {@link NextQueryParamsAdapter}. If not provided, the adapter from the nearest provider {@link NextQueryParamsProvider} will be used.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [str, setStr] = useState('world');
 *
 *   useNextQueryParams({
 *    hello: createStrQueryParam({
 *      value: str,
 *      onChange: setStr,
 *    })
 *   });
 *
 *   return <div>Hello {str}</div>;
 * }
 * ```
 */
export function useNextQueryParams<T extends Record<string, unknown> = Record<string, any>>(
    params: NextQueryParams<T>,
    adapter?: Partial<NextQueryParamsAdapter>
): UseNextQueryParamsReturn {
    const [init, setInit] = useState(true);
    const [isStable, setStable] = useState(false);
    const [prevUrlQuery, setPrevUrlQuery] = useState<ParsedUrlQuery>({});
    const previouslyHasUrlQueryChanged = useRef(false);
    const keys = Object.keys(params);
    const nextQueryParamsContextValues = useContext(NextQueryParamsContext);
    const contextAdapter = nextQueryParamsContextValues?.adapter;
    const isRouterReady =
        adapter?.isRouterReady !== undefined
            ? adapter.isRouterReady
            : !!contextAdapter?.isRouterReady;
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
        return Object.entries(params).reduce((acc: QueryParamStates, [key, value]) => {
            acc[key] = {
                value: value.value !== undefined && value.value !== null ? value.value : undefined,
                serialize: value.serialize
            };
            return acc;
        }, {});
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
        previouslyHasUrlQueryChanged.current = true;
        setPrevUrlQuery(urlQuery);
        setInit(false);
    };

    const onChange = () => {
        if (hasUrlQueryChanged) {
            const changedKeys = getChangedUrlQueryKeys(urlQuery, prevUrlQuery);
            for (const key of changedKeys) {
                if (keys.includes(key)) {
                    const value = urlQuery[key];
                    const param = params[key];
                    if (value === undefined) {
                        if (mode === 'reset') {
                            param.onReset();
                        }
                    } else {
                        const serializedStateValue =
                            param?.serialize?.(param?.value) ||
                            customSerializeQueryParam?.(param?.value) ||
                            baseSerializeQueryParam(param?.value);
                        if (
                            !serializedStateValue ||
                            !areUrlQueryValuesEqual(serializedStateValue, value)
                        ) {
                            param.onChange(value);
                            previouslyHasUrlQueryChanged.current = true;
                        }
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
                previouslyHasUrlQueryChanged.current
            );
            previouslyHasUrlQueryChanged.current = false;
        } else {
            previouslyHasUrlQueryChanged.current = false;
        }
    };

    useEffect(() => {
        if (isRouterReady) {
            if (init) {
                onInit();
            } else {
                !haveQueryParamStatesChanged && setStable(true);
                onChange();
            }
        }
    }, [init, isRouterReady, hasUrlQueryChanged, haveQueryParamStatesChanged]);

    return { isStable };
}
