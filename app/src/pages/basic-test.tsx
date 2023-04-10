import { useState } from 'react';
import {
    createBoolQueryParam,
    createJSONRecordQueryParam,
    createNumQueryParam,
    createStrQueryParam,
    createDateQueryParam,
    useNextQueryParams,
    createStrArrQueryParam,
    createNumArrQueryParam
} from 'use-next-query-params';
import Link from 'next/link';

export default function BasicTestPage() {
    const [str, setStr] = useState<string>('test');
    const [num, setNum] = useState<number>(1);
    const [bool, setBool] = useState<boolean>(true);
    const [obj, setObj] = useState<Record<string, number>>({ a: 1, b: 2 });
    const [date, setDate] = useState<Date>(new Date('1999-01-01'));
    const [strArr, setStrArr] = useState<string[]>(['a', 'b']);
    const [numArr, setNumArr] = useState<number[]>([1, 2]);
    useNextQueryParams({
        str: createStrQueryParam({
            value: str,
            onChange: setStr
        }),
        num: createNumQueryParam({
            value: num,
            onChange: setNum
        }),
        bool: createBoolQueryParam({
            value: bool,
            onChange: setBool
        }),
        obj: createJSONRecordQueryParam({
            value: obj,
            onChange: setObj
        }),
        date: createDateQueryParam({
            value: date,
            onChange: setDate
        }),
        strArr: createStrArrQueryParam({
            value: strArr,
            onChange: setStrArr
        }),
        numArr: createNumArrQueryParam({
            value: numArr,
            onChange: setNumArr
        })
    });
    return (
        <>
            <Link href={'/'}>Home</Link>
            <hr />
            <button
                id={'btn-set-str-to-test2'}
                onClick={() => {
                    setStr('test2');
                }}
            >
                Set str to test2
            </button>
            <button
                id={'btn-increment-num'}
                onClick={() => {
                    setNum((prev) => prev + 1);
                }}
            >
                Increment num
            </button>
            <button
                id={'btn-toggle-bool'}
                onClick={() => {
                    setBool((prev) => !prev);
                }}
            >
                Toggle bool
            </button>
            <button
                id={'btn-set-obj-to-z-0'}
                onClick={() => {
                    setObj({ z: 0 });
                }}
            >
                Set obj to "{`{z: 0}`}"
            </button>
            <button
                id={'btn-set-date-to-2000-12-31'}
                onClick={() => {
                    setDate(new Date('2000-12-31'));
                }}
            >
                Set date to 2000-12-31
            </button>
            <button id={'btn-set-str-arr-to-c-d'} onClick={() => setStrArr(['c', 'd'])}>
                Set strArr to ['c', 'd']
            </button>
            <button id={'btn-set-num-arr-to-3-4'} onClick={() => setNumArr([3, 4])}>
                Set numArr to [3, 4]
            </button>
            <p>
                str: <span id={'str'}>{str}</span>
            </p>
            <p>
                num: <span id={'num'}>{num}</span>
            </p>
            <p>
                bool: <span id={'bool'}>{bool ? 'true' : 'false'}</span>
            </p>
            <p>
                obj: <span id={'obj'}>{JSON.stringify(obj)}</span>
            </p>
            <p>
                date: <span id={'date'}>{date.toISOString()}</span>
            </p>
            <p>
                strArr: <span id={'str-arr'}>{JSON.stringify(strArr)}</span>
            </p>
            <p>
                numArr: <span id={'num-arr'}>{JSON.stringify(numArr)}</span>
            </p>
        </>
    );
}
