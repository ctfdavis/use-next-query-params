import { SerializedQueryParam } from './SerializedQueryParam';

export type SerializeQueryParam<T = unknown> = (value: T) => SerializedQueryParam;
