import { SerializeQueryParam } from './SerializeQueryParam';

export type QueryParamState = {
    value: unknown;
    serialize?: SerializeQueryParam;
};
