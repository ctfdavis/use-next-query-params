<div align="center">
  <h1> useNextQueryParams </h1>
</div>

A React hook for linking states to query parameters in [Next.js](https://nextjs.org) applications.
This hook is designed specifically for Next.js, but compatible with other React routers with the
adapter design.

## Features

-   [➰ Link client states to query parameters](#getting-started)
-   [⚡ Powerful API for customization](#advanced-usage)
-   [🎂 Convenient query param builders for common use cases](#convenient-query-param-builders)

## Demo

Demo application: https://use-next-query-params.vercel.app/

Codesandbox: https://codesandbox.io/p/sandbox/use-next-query-params-demo-qqwbst

Also see `app` folder for a demo Next.js application used for Cypress tests.

## Installation

```bash
# npm
npm install use-next-query-params

# yarn
yarn add use-next-query-params

# pnpm
pnpm add use-next-query-params
```

## Getting Started

### With Provider

In the `_app.tsx` (or `_app.jsx`) file, wrap your application in `NextQueryParamsProvider`:

```tsx
// pages/_app.tsx
import { useRouter } from 'next/router';
import { NextQueryParamsProvider, createNextRouterAdapter } from 'use-next-query-params';

export default function App({ Component, pageProps }) {
    const router = useRouter();
    return (
        <NextQueryParamsProvider adapter={createNextRouterAdapter(router)}>
            // Your application
        </NextQueryParamsProvider>
    );
}
```

Then, in your page component, use the `useNextQueryParams` hook to link states to URL query
parameters:

```tsx
// pages/example.tsx
import { useState } from 'react';
import {
    createStrQueryParam,
    createNumQueryParam,
    useNextQueryParams
} from 'use-next-query-params';

export default function ExamplePage() {
    const [counter, setCounter] = useState(0);
    const [displayName, setDisplayName] = useState('');
    // result example: http://localhost:3000/example?count=0&name=John+Doe
    useNextQueryParams({
        count: createNumQueryParam({
            value: counter,
            onChange: setCounter
        }),
        name: createStrQueryParam({
            value: displayName,
            onChange: setDisplayName
        })
    });
    return (
        <>
            <button onClick={() => setCounter(counter + 1)}>Increment Count</button>
            <button onClick={() => setDisplayName('John Doe')}>Set Name</button>
            <p>Count: {counter}</p>
            <p>Name: {displayName}</p>
        </>
    );
}
```

Note that `null` and `undefined` values are not added to the query parameters. This is to prevent
the query parameters from being polluted with unnecessary values.

### `createNextRouterAdapter`

The `createNextRouterAdapter` function is a helper function for creating an adapter for the
`NextQueryParamsProvider`. It takes a `NextRouter` instance (returned by calling `useRouter()`) as a
parameter and returns an adapter for the provider.

You can pass the second parameter to the `createNextRouterAdapter` function to override the default
settings for the adapter:

```tsx
createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    mode: 'merge', // default is 'reset', see advanced usage for more details
    shallow: true, // default is false
    replace: true // default is false, meaning router.push is used instead of router.replace
});
```

You can even override the `onChange` method of the adapter, taking entire control of handling the
`urlQuery`:

```tsx
import { ParsedUrlQuery } from 'querystring';

createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    onChange: (urlQuery: ParsedUrlQuery) => {
        // Do something with the urlQuery
        // Update the query parameters your own way
    }
});
```

### Without Provider

You can also use the `useNextQueryParams` hook without a provider by passing the adapter as a
parameter:

```tsx
// pages/example.tsx
import { useState } from 'react';
import {
    createStrQueryParam,
    createNumQueryParam,
    useNextQueryParams,
    createNextRouterAdapter
} from 'use-next-query-params';

export default function ExamplePage() {
    const [counter, setCounter] = useState(0);
    const [displayName, setDisplayName] = useState('');
    useNextQueryParams(
        {
            count: createNumQueryParam({
                value: counter,
                onChange: setCounter
            }),
            name: createStrQueryParam({
                value: displayName,
                onChange: setDisplayName
            })
        },
        createNextRouterAdapter(useRouter()) // pass the router adapter as the second argument
    );
    return (
        <>
            <button onClick={() => setCounter(counter + 1)}>Increment Count</button>
            <button onClick={() => setDisplayName('John Doe')}>Set Name</button>
        </>
    );
}
```

### Overriding the Provider Adapter Settings

By passing the `adapter` prop to the `NextQueryParamsProvider` (as shown above), you can also
override the default settings for the adapter provided in the provider (if it is present).

Note that all fields for the `adapter` prop are optional in the hook. That means you can override
only the settings you want to change.

```tsx
// pages/example.tsx
// ...

export default function ExamplePage() {
    const [counter, setCounter] = useState(0);
    const [displayName, setDisplayName] = useState('');
    useNextQueryParams(
        {
            count: createNumQueryParam({
                value: counter,
                onChange: setCounter
            }),
            name: createStrQueryParam({
                value: displayName,
                onChange: setDisplayName
            })
        },
        {
            // Override some of the settings for the adapter for this particular hook
            mode: 'merge',
            onChange: (urlQuery, isTriggeredByUrl) => {
                // Do something with the urlQuery
                // Update the urlQuery parameters your own way
            }
        }
    );
    return (
        <>
            <button onClick={() => setCounter(counter + 1)}>Increment Count</button>
            <button onClick={() => setDisplayName('John Doe')}>Set Name</button>
        </>
    );
}
```

## Convenient Query Param Builders

This package also provides type-safe, convenient query parameter builders for most common use cases:

-   `createStrQueryParam`
-   `createNumQueryParam`
-   `createBoolQueryParam`
-   `createJSONRecordQueryParam`
-   `createDateQueryParam`
-   `createStrArrayQueryParam`
-   `createNumArrayQueryParam`

We use them to create query parameters for linking state variables inside the `useNextQueryParams`
hook.

### `createStrQueryParam`

The `createStrQueryParam` function creates a query parameter for a string state.

```tsx
// pages/example.tsx
import { useNextQueryParams, createStrQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [name, setName] = useState('John Doe');

    useNextQueryParams({
        name: createStrQueryParam({
            value: name,
            onChange: (value: string) => {
                // Do something with the value
                // Typically, you would update the state
                setName(value);
            },
            // optional, default is empty string ''
            defaultValue: 'John Doe',
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): string => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(value)) {
                    return value[0] + '!';
                }
                return value + '!';
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: string): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return value.substring(0, value.length - 1);
            }
        })
    });

    // ...
}
```

### `createNumQueryParam`

The `createNumQueryParam` function creates a query parameter for a number state.

```tsx
// pages/example.tsx
import { useNextQueryParams, createNumQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [count, setCount] = useState(0);

    useNextQueryParams({
        count: createNumQueryParam({
            value: count,
            onChange: (value: number) => {
                // Do something with the value
                // Typically, you would update the state
                setCount(value);
            },
            // optional, default is 0
            defaultValue: 0,
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): number => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(value)) {
                    return Number(value[0]);
                }
                return Number(value);
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: number): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return value.toString();
            }
        })
    });

    // ...
}
```

### `createBoolQueryParam`

The `createBoolQueryParam` function creates a query parameter for a boolean state.

```tsx
// pages/example.tsx
import { useNextQueryParams, createBoolQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [isDark, setIsDark] = useState(false);

    useNextQueryParams({
        dark: createBoolQueryParam({
            value: isDark,
            onChange: (value: boolean) => {
                // Do something with the value
                // Typically, you would update the state
                setIsDark(value);
            },
            // optional, default is false
            defaultValue: false,
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): boolean => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(value)) {
                    return value[0] === 'true';
                }
                return value === 'true';
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: boolean): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                if (v === undefined || v === null) {
                    return undefined;
                }
                if (props.withTime) {
                    return v.toISOString().split('.')[0];
                }
                return v.toISOString().split('T')[0];
            }
        })
    });

    // ...
}
```

### `createJSONRecordQueryParam`

The `createJSONRecordQueryParam` function creates a query parameter for a JSON record state.

```tsx
// pages/example.tsx
import { useNextQueryParams, createJSONRecordQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [user, setUser] = useState({ name: 'John Doe', age: 30 });

    useNextQueryParams({
        user: createJSONRecordQueryParam({
            value: user,
            onChange: (value) => {
                // Do something with the value
                // Typically, you would update the state
                setUser(value);
            },
            // optional, default is {}
            defaultValue: { name: 'John Doe', age: 30 },
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): Record<string, any> => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(value)) {
                    return new Date(value[0]);
                }
                return new Date(value);
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: Record<string, any>): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                if (v === undefined || v === null) {
                    return undefined;
                }
                return JSON.stringify(v);
            }
        })
    });

    // ...
}
```

### `createDateQueryParam`

The `createDateQueryParam` function creates a query parameter for a date state.

```tsx
// pages/example.tsx
import { useNextQueryParams, createDateQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [date, setDate] = useState(new Date('2021-01-01'));

    useNextQueryParams({
        date: createDateQueryParam({
            value: date,
            onChange: (value: Date) => {
                // Do something with the value
                // Typically, you would update the state
                setDate(value);
            },
            // optional, default is new Date()
            defaultValue: new Date(),
            // optional, default is false
            // setting it to true will include the time in the ISO string format, i.e. YYYY-MM-DDTHH:mm:ss
            // setting it to false will only include the date in the ISO string format, i.e. YYYY-MM-DD
            withTime: true,
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): Date => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(value)) {
                    return new Date(value[0]);
                }
                return new Date(value);
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: Date): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                if (v === undefined || v === null) {
                    return undefined;
                }
                if (props.withTime) {
                    return v.toISOString().split('.')[0];
                }
                return v.toISOString().split('T')[0];
            }
        })
    });

    // ...
}
```

### `createStrArrayQueryParam`

The `createStrArrayQueryParam` function creates a query parameter for an array of strings.

```tsx
// pages/example.tsx
import { useNextQueryParams, createStrArrayQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [tags, setTags] = useState(['tag1', 'tag2']);

    useNextQueryParams({
        tags: createStrArrayQueryParam({
            value: tags,
            onChange: (value: string[]) => {
                // Do something with the value
                // Typically, you would update the state
                setTags(value);
            },
            // optional, default is []
            defaultValue: ['tag1', 'tag2'],
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): string[] => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(v)) {
                    props.onChange(v);
                } else {
                    props.onChange([v]);
                }
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: string[]): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return v;
            }
        })
    });

    // ...
}
```

### `createNumArrayQueryParam`

The `createNumArrayQueryParam` function creates a query parameter for an array of numbers.

```tsx
// pages/example.tsx
import { useNextQueryParams, createNumArrayQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [numbers, setNumbers] = useState([1, 2, 3]);

    useNextQueryParams({
        numbers: createNumArrayQueryParam({
            value: numbers,
            onChange: (value: number[]) => {
                // Do something with the value
                // Typically, you would update the state
                setNumbers(value);
            },
            // optional, default is []
            defaultValue: [1, 2, 3],
            // optional, must be set to true if value can be `undefined`
            optional: false,
            // optional, must be set to true if value can be `null`
            nullable: false,
            // optional; if you provide a custom `deserialize` function, you should also provide a
            // a custom `serialize` function. They should be inverses of each other.
            // note that the return type here can be `undefined` or `null` if `optional` or `nullable` is set to true
            deserialize: (value: string | string[]): number[] => {
                // Do something with the value
                // Typically, you would parse the value from the URL query to the desired state
                if (Array.isArray(v)) {
                    return v.map((v) => Number(v));
                }
                return [Number(v)];
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function. They should be inverses of each other.
            // note that value here can be `undefined` or `null` if `optional` or `nullable` is set to true
            serialize: (value: number[]): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return v.map((v) => v.toString());
            }
        })
    });

    // ...
}
```

## Advanced Usage

### Providing a Custom Adapter

The adapter interface is defined as follows:

```ts
import { ParsedUrlQuery } from 'querystring';

type NextQueryParamsAdapterMode = 'reset' | 'merge';

type NextQueryParamsAdapter = {
    readonly isRouterReady: boolean;
    readonly urlQuery: ParsedUrlQuery;
    readonly onChange: (urlQuery: ParsedUrlQuery, isTriggeredByUrl: boolean) => void;
    readonly mode?: NextQueryParamsAdapterMode;
    readonly customSerializeQueryParam?: SerializeQueryParam;
};
```

You can provide a custom adapter to the `NextQueryParamsProvider` provider or `useNextQueryParams`
hook (as the second argument). This is useful if you are using a router different from Next.js
built-in router.

```jsx
// app.jsx
import { NextQueryParamsProvider } from 'use-next-query-params';
import router from 'some-router'; // Your router

export default function App() {
    const routerAdapter = {
        // if your app is client-side only, you can set this to true as router is always ready
        isRouterReady: true,
        // your router's query object
        urlQuery: router.query,
        // your router's push/replace method
        onChange: (urlQuery, isTriggeredByUrl) => {
            // if the urlQuery is changed by the user navigation, use 'replace' to avoid adding a new entry to the history
            const routingMethod = isTriggeredByUrl ? 'replace' : 'push';
            router[routingMethod]({ urlQuery });
        },
        // optional, default is 'reset'
        mode: 'merge'
    };
    return (
        <NextQueryParamsProvider adapter={routerAdapter}>
            <Component />
        </NextQueryParamsProvider>
    );
}
```

### Router adapter `mode`

The `mode` property of the adapter can be set to one of the following values:

-   `reset`: The query parameters are reset to the default values when the state changes.
-   `merge`: The query parameters are merged with the default values when the state changes.

See the [demo](#demo) for an example of each mode.

### Using `useNextQueryParams` without builder functions

You can also use `useNextQueryParams` without builder functions by passing objects like the
following:

```tsx
// pages/example.tsx
import { useNextQueryParams } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [name, setName] = useState('John Doe');
    const [age, setAge] = useState(30);

    useNextQueryParams<{
        name: string; // you can explicitly define typings for the query parameters here; the hook will try to infer them if you don't
        age: number;
    }>({
        name: {
            value: name,
            onChange: (value: string) => {
                // Do something with the value
                // Typically, you would deserialize the value from the URL query to the desired state
                setName(yourDeserializationFunctionForStrings(value));
            },
            onReset: () => {
                // Do something when the value is reset
                // This will happen when `mode` is set to `reset` and the query parameter is removed from the URL
                // Typically, you would update the state to its default value
                setName('John Doe');
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function used in the `onChange` function (as shown above). They should be inverses of each other.
            serialize: (value: string): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return value;
            }
        },
        age: {
            value: age,
            onChange: (value: number) => {
                // Do something with the value
                // Typically, you would deserialize the value from the URL query to the desired state
                setAge(yourDeserializationFunctionForNumbers(value));
            },
            onReset: () => {
                // Do something when the value is reset
                // This will happen when `mode` is set to `reset` and the query parameter is removed from the URL
                // Typically, you would update the state to its default value
                setAge(30);
            },
            // optional; if you provide a custom `serialize` function, you should also provide a
            // a custom `deserialize` function used in the `onChange` function (as shown above). They should be inverses of each other.
            serialize: (value: number): string | string[] | undefined => {
                // Do something with the value
                // Typically, you would stringify the value
                // Return `undefined` if you want to remove the query parameter from the URL
                return value.toString();
            }
        }
    });

    // ...
}
```

### Create your custom query param builders

The package also exports a `createQueryParamFunctionFactory` function that can be used to create
your own builder functions. See example usage below:

```tsx
// utils/createMyQueryParam.ts

import { useNextQueryParams, createQueryParamFunctionFactory } from 'use-next-query-params';

// Note that `props` have the below type
// {
//     value: AllowedType<TData, TNullable, TOptional>;
//     onChange: (value: AllowedType<TData, TNullable, TOptional>) => void;
//     /**
//      * Deserialize a value from a parsed URL query into the type of the query param.
//      * @note If you are using a custom `serialize` function, you should also provide a custom `deserialize` function. They must be inverses of each other.
//      */
//     deserialize?: (value: string | string[]) => AllowedType<TData, TNullable, TOptional>;
//     /**
//      * Serialize a value from the query param into a parsed URL query (i.e., string or array of strings).
//      * @note If you are using a custom `deserialize` function, you should also provide a custom `serialize` function. They must be inverses of each other.
//      */
//     serialize?: (value: AllowedType<TData, TNullable, TOptional>) => string | string[] | undefined;
//     defaultValue?: AllowedType<TData, TNullable, TOptional>;
//     nullable?: TNullable;
//     optional?: TOptional;
// }
export const createMyQueryParam = createQueryParamFunctionFactory<MyOwnType>((props) => ({
    // provide your own implementation in the below fields

    // note that the value here is of type `AllowedType<TData, TNullable, TOptional>`
    // TData is the type of the query param, here it is `MyOwnType`
    // TNullable and TOptional are boolean values that indicate whether the query param is nullable and/or optional
    value: props.value,
    // `onChange` is a function that takes a value of type `AllowedType<TData, TNullable, TOptional>` and updates the URL query param
    onChange: props.onChange,
    // optional, `defaultValue` is the default value of the query param
    defaultValue: props.defaultValue,
    // optional, `optional` is a boolean value that indicates whether the query param is optional
    optional: props.optional,
    // optional, `nullable` is a boolean value that indicates whether the query param is nullable
    nullable: props.nullable,
    // optional, `deserialize` is a function that takes a value of type `string | string[]` and deserializes it into a value of type `AllowedType<TData, TNullable, TOptional>`
    deserialize: props.deserialize,
    // optional, `serialize` is a function that takes a value of type `AllowedType<TData, TNullable, TOptional>` and serializes it into a value of type `string | string[] | undefined`
    serialize: props.serialize
}));
```

### `isStable` value returned by `useNextQueryParams`

The `useNextQueryParams` hook returns a `isStable` value, which is a boolean indicating whether the
query parameters and their corresponding states are fully initialized. This could be useful if you
want to prevent certain actions from being performed before the initialization is complete.

```tsx
// pages/example.tsx

// ...
export default function ExamplePage() {
    const [counter, setCounter] = useState(0);
    const [displayName, setDisplayName] = useState('');
    const { isStable } = useNextQueryParams({
        count: createNumQueryParam({
            value: counter,
            onChange: setCounter
        })
    });
    return (
        <>
            <button
                onClick={() => {
                    // prevent incrementing the counter if the query parameters are not stable
                    // this can be useful if you or your users use a browser automation tool
                    // to change states immediately after the page loads
                    if (isStable) {
                        setCounter(counter + 1);
                    }
                }}
            >
                Increment Count
            </button>
            <p>Count: {counter}</p>
        </>
    );
}
```
