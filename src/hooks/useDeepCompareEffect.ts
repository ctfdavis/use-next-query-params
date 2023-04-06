import { DependencyList, useEffect, useRef } from 'react';
// import { deepEqual } from 'fast-equals';
import isEqual from 'react-fast-compare';

export function useDeepCompareEffect(callback: () => void, dependencies: DependencyList) {
    const prevDepsRef = useRef<DependencyList>();

    const hasChanged = !isEqual(dependencies, prevDepsRef.current);

    useEffect(() => {
        if (hasChanged) {
            callback();
        }
        prevDepsRef.current = dependencies;
    }, [callback, dependencies, hasChanged]);
}
