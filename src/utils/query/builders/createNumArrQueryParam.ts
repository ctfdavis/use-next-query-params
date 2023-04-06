import { NextQueryParam } from '../../../types';

type CreateNumArrQueryParam = {
    value: number[];
    onChange: (value: number[]) => void;
    defaultValue?: number[];
};

export function createNumArrQueryParam(props: CreateNumArrQueryParam): NextQueryParam {
    return {
        value: props.value,
        onChange: (v) => {
            if (Array.isArray(v)) {
                props.onChange(v.filter((v) => !isNaN(Number(v))).map((v) => Number(v)));
            } else {
                if (!isNaN(Number(v))) {
                    props.onChange([Number(v)]);
                }
            }
        },
        onReset: () => {
            props.onChange(props.defaultValue !== undefined ? props.defaultValue : []);
        }
    };
}
