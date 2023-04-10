<div align="center">
  <h1> useNextQueryParams </h1>
  <hr />
</div>

A React hook for linking states to urlQuery parameters in [Next.js](https://nextjs.org) applications. This hook is designed
specifically for Next.js, but is compatible with other React routers with the
adapter design.

## Features ‍🔥

- [➰ Link client states to urlQuery parameters](#getting-started)
- [⚡ Powerful API for customization](#advanced-usage)
- [🎂 Convenient urlQuery param builders for common use cases](#convenient-query-param-builders)

## Demo 🌐

_Online demo to be added_

See `app` folder for a demo Next.js application.

## Installation ⬇️

```bash
# npm
npm install use-next-query-params

# yarn
yarn add use-next-query-params

# pnpm
pnpm add use-next-query-params
```

## Getting Started 👨‍💻

### With Provider

In the `_app.jsx` (or `_app.tsx`) file, wrap your application in the `NextQueryParamsProvider`
component:

```jsx
// pages/_app.jsx
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

Then, in your page component, use the `useNextQueryParams` hook to link states to url query parameters:

```jsx
// pages/example.jsx
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

Note that `null` and `undefined` values are not added to the urlQuery parameters. This is to prevent
the query parameters from being polluted with unnecessary values.

### `createNextRouterAdapter`

The `createNextRouterAdapter` function is a helper function for creating an adapter for the
`NextQueryParamsProvider`. It takes the `useRouter` hook as a parameter and returns an adapter for
the provider.

You can pass the second parameter to the `createNextRouterAdapter` function to override the default
settings for the adapter:

```jsx
createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    mode: 'merge', // default is 'reset', see below 'mode' section
    shallow: true, // default is false
    replace: true // default is false, meaning router.push is used instead of router.replace
});
```

You can even override the `onChange` method of the adapter, taking entire control of handling the
`urlQuery`:

```jsx
import { ParsedUrlQuery } from 'querystring';

createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    onChange: (urlQuery: ParsedUrlQuery) => {
        // Do something with the urlQuery
        // Update the urlQuery parameters your own way
    }
});
```

### Without Provider

You can also use the `useNextQueryParams` hook directly by passing the adapter as a parameter:

```jsx
// pages/example.jsx
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
        createNextRouterAdapter(useRouter())
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

By passing the `adapter` prop to the `NextQueryParamsProvider` (as shown above), it can override the
default settings for the adapter set in the provider (if present).

Note that all fields for the `adapter` prop are optional in the hook. That means you can override
the settings you want to change.

```jsx
// pages/example.jsx
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
            // Override the provider settings for the adapter
            shallow: true,
            replace: true
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

## Convenient Query Param Builders 🔨

This package also provides type-safe, convenient query parameter builders for most common use cases:

-   `createStrQueryParam`
-   `createNumQueryParam`
-   `createBoolQueryParam`
-   `createJSONRecordQueryParam`
-   `createDateQueryParam`
-   `createStrArrayQueryParam`
-   `createNumArrayQueryParam`

We use them to create urlQuery parameters for linking state variables in a `useNextQueryParams` hook.

### `createStrQueryParam`

The `createStrQueryParam` function creates a urlQuery parameter for a string state.

```jsx
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
        defaultValue: 'John Doe'
      });
    });

    // ...
}
```

### `createNumQueryParam`

The `createNumQueryParam` function creates a urlQuery parameter for a number state.

```jsx
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
        defaultValue: 0
      });
    });

    // ...
}
```

### `createBoolQueryParam`

The `createBoolQueryParam` function creates a urlQuery parameter for a boolean state.

```jsx
import { useNextQueryParams, createBoolQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [isDark, setIsDark] = useState(false);

    useNextQueryParams({
      isDark: createBoolQueryParam({
        value: isDark,
        onChange: (value: boolean) => {
            // Do something with the value
            // Typically, you would update the state
            setIsDark(value);
        },
        // optional, default is false
        defaultValue: false
      });
    });

    // ...
}
```

### `createJSONRecordQueryParam`

The `createJSONRecordQueryParam` function creates a urlQuery parameter for a JSON record state.

```jsx
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
        defaultValue: { name: 'John Doe', age: 30 }
      });
    });

    // ...
}
```

### `createDateQueryParam`

The `createDateQueryParam` function creates a urlQuery parameter for a date state.

```jsx
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
        withTime: true
      });
    });

    // ...
}
```

### `createStrArrayQueryParam`

The `createStrArrayQueryParam` function creates a urlQuery parameter for an array of strings.

```jsx
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
        defaultValue: ['tag1', 'tag2']
      });
    });

    // ...
}
```

### `createNumArrayQueryParam`

The `createNumArrayQueryParam` function creates a urlQuery parameter for an array of numbers.

```jsx
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
        defaultValue: [1, 2, 3]
      });
    });

    // ...
}
```

## Advanced Usage

### Providing a Customized Adapter

The adapter interface is defined as follows:

```ts
import { ParsedUrlQuery } from 'querystring';

type NextQueryParamsAdapterMode = 'default' | 'reset' | 'merge';

type NextQueryParamsAdapter = {
    readonly isRouterReady: boolean;
    readonly urlQuery: ParsedUrlQuery;
    readonly onChange: (urlQuery: ParsedUrlQuery, isTriggeredByUrl: boolean) => void;
    readonly mode?: NextQueryParamsAdapterMode;
    readonly customSerializeQueryParam?: SerializeQueryParam;
};
```

You can provide a customized adapter to the `NextQueryParamsProvider` provider or `useNextQueryParams` hook by passing it as the second argument.
This is useful if you are using a router different from Next.js' built-in router.

```jsx
// app.jsx
import { NextQueryParamsProvider } from 'use-next-query-params';
import router from 'some-router'; // Your router

export default function App() {
    const routerAdapter = {
        // if your app is client-side only, you can set this to true as router is always ready
        isRouterReady: true,
        // your router's urlQuery object
        urlQuery: router.urlQuery,
        // your router's push method
        onChange: (urlQuery, isTriggeredByUrl) => {
          // if the urlQuery is changed by the user navigation, use 'replace' to avoid adding a new entry to the history
          const routingMethod = isTriggeredByUrl ? 'replace' : 'push';
          router[routingMethod]({ urlQuery })
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

### Router Adapter `mode`

The `mode` property of the adapter interface can be set to one of the following values:

- `reset`: The urlQuery parameters are reset to the default values when the state changes.
- `merge`: The urlQuery parameters are merged with the default values when the state changes.

See the [demo](#demo) for an example of each mode.
