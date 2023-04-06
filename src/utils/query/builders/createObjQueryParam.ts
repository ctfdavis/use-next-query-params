import { NextQueryParam } from '../../../types';

type CreateObjQueryParamProps = {
    value: object;
    onChange: (value: object) => void;
    defaultValue?: object;
};

export function createObjQueryParam(props: CreateObjQueryParamProps): NextQueryParam {
    return {
        value: props.value,
        defaultValue: props.defaultValue !== undefined ? props.defaultValue : {},
        onChange: (v) => {
            let parsed;
            try {
                if (Array.isArray(v)) {
                    parsed = JSON.parse(v[0]);
                } else {
                    parsed = JSON.parse(v);
                }
            } catch (e) {
                return;
            }
            if (typeof parsed === 'object' && parsed !== null) {
                props.onChange(parsed);
            }
        }
    };
}
