import { ParsedUrlQuery } from 'querystring';
import { SerializeQueryParam } from '../../types/SerializeQueryParam';
import { baseSerializeQueryParam } from './baseSerializeQueryParam';
import { QueryParamStates } from '../../types/QueryParamStates';

export function serializeQueryParamStates(
    state: QueryParamStates,
    customSerializeQueryParam?: SerializeQueryParam
): ParsedUrlQuery {
    const queryParams: ParsedUrlQuery = {};
    for (const [key, value] of Object.entries(state)) {
        let serializedValue: string | string[] | undefined;
        if (value.serialize) {
            serializedValue = value.serialize(value.value);
        } else {
            serializedValue = customSerializeQueryParam
                ? customSerializeQueryParam(value.value)
                : baseSerializeQueryParam(value.value);
        }
        if (serializedValue !== undefined) {
            queryParams[key] = serializedValue;
        }
    }
    return queryParams;
}
