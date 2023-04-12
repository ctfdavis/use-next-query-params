import { ParsedUrlQuery } from 'querystring';
import { SerializeQueryParam } from '../../types/SerializeQueryParam';
import { baseSerializeQueryParam } from './baseSerializeQueryParam';
import { QueryParamStates } from '../../types/QueryParamStates';
import { SerializedQueryParam } from '../../types/SerializedQueryParam';

export function serializeQueryParamStates(
    states: QueryParamStates,
    customSerializeQueryParam?: SerializeQueryParam
): ParsedUrlQuery {
    const queryParams: ParsedUrlQuery = {};
    for (const key of Object.keys(states)) {
        const state = states[key];
        const value = state.value;

        let serializedValue: SerializedQueryParam;
        if (state.serialize) {
            serializedValue = state.serialize(value);
        } else {
            serializedValue = customSerializeQueryParam
                ? customSerializeQueryParam(value)
                : baseSerializeQueryParam(value);
        }

        if (serializedValue !== undefined) {
            queryParams[key] = serializedValue;
        }
    }
    return queryParams;
}
