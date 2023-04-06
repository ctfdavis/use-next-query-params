import React, { createContext, FC, PropsWithChildren } from 'react';
import { NextQueryParamsAdapter } from '../types';

type NextQueryParamsContextProps = {
    adapter: NextQueryParamsAdapter;
};

type NextQueryParamsProviderProps = PropsWithChildren<NextQueryParamsContextProps>;

export const NextQueryParamsContext = createContext<NextQueryParamsContextProps | null>(null);

export const NextQueryParamsProvider: FC<NextQueryParamsProviderProps> = ({
    children,
    adapter
}) => {
    return (
        <NextQueryParamsContext.Provider
            value={{
                adapter
            }}
        >
            {children}
        </NextQueryParamsContext.Provider>
    );
};
