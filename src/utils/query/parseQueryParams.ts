import { ParsedUrlQuery } from 'querystring';

type State = {
    [key: string]: any;
};

export function parseQueryParams(state: State): ParsedUrlQuery {
    const queryParams: ParsedUrlQuery = {};
    for (const [key, value] of Object.entries(state)) {
        if (Array.isArray(value)) {
            queryParams[key] = value
                .filter((v) => v !== undefined && v !== null)
                .map((v) => (typeof v === 'object' ? JSON.stringify(v) : v.toString()));
        } else if (typeof value === 'object' && value !== null) {
            queryParams[key] = JSON.stringify(value);
        } else if (value !== undefined && value !== null) {
            queryParams[key] = value.toString();
        }
    }
    return queryParams;
}
