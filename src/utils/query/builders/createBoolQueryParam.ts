import { NextQueryParam } from '../../../types';

type CreateBoolQueryParamProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    defaultValue?: boolean;
};

export function createBoolQueryParam(props: CreateBoolQueryParamProps): NextQueryParam {
    return {
        value: props.value,
        onChange: (v) => {
            if (Array.isArray(v)) {
                if (v[0] === 'true') {
                    props.onChange(true);
                } else if (v[0] === 'false') {
                    props.onChange(false);
                }
            } else {
                if (v === 'true') {
                    props.onChange(true);
                } else if (v === 'false') {
                    props.onChange(false);
                }
            }
        },
        onReset: () => {
            props.onChange(props.defaultValue !== undefined ? props.defaultValue : false);
        }
    };
}
