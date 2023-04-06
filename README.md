# UseNextQueryParams

---

A React hook for linking states to query parameters in Next.js applications. This hook is designed
specifically for Next.js, but could also be made compatible with other React routers with the
adapter design.

## Features ‍🔥

- [➰ Link client states to query parameters](#getting-started)
- [⚡ Powerful API for customization](#advanced-usage)
- [🎂 Convenient query param builders for common use cases](#convenient-query-param-builders)

## Demo 🌐

_To be added_

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

### With Provider (Recommended)

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

Then, in your page component, use the `useNextQueryParams` hook to link states to query parameters:

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
        </>
    );
}
```

> **_IMPORTANT:_** Only use the `useNextQueryParams` hook once per page. That's because the hook
> will update the query parameters when the states change. If you use the hook multiple times, the
> query parameters will be updated multiple times. This could cause an infinite loop of query
> parameter updates.

### `createNextRouterAdapter`

The `createNextRouterAdapter` function is a helper function for creating an adapter for the
`NextQueryParamsProvider`. It takes the `useRouter` hook as a parameter and returns an adapter for
the provider.

You can pass the second parameter to the `createNextRouterAdapter` function to override the default
settings for the adapter:

```jsx
createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    mode: 'reset', // default is 'default', see below 'mode' section
    shallow: true, // default is false
    replace: true // default is false, meaning router.push is used instead of router.replace
});
```

You can even override the `onChange` method of the adapter, taking entire control of handling the
query:

```jsx
import { ParsedUrlQuery } from 'querystring';

createNextRouterAdapter(router, {
    // Override the default settings for the adapter
    onChange: (query: ParsedUrlQuery) => {
        // Do something with the query
        // Update the query parameters your own way
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
-   `createObjQueryParam`
-   `createStrArrayQueryParam`
-   `createNumArrayQueryParam`

We use them to create query parameters for linking state variables in a `useNextQueryParams` hook.

### `createStrQueryParam`

The `createStrQueryParam` function creates a query parameter for a string state.

```jsx
import { createStrQueryParam } from 'use-next-query-params';
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

The `createNumQueryParam` function creates a query parameter for a number state.

```jsx
import { createNumQueryParam } from 'use-next-query-params';
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

The `createBoolQueryParam` function creates a query parameter for a boolean state.

```jsx
import { createBoolQueryParam } from 'use-next-query-params';
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

### `createObjQueryParam`

The `createObjQueryParam` function creates a query parameter for an object state.

```jsx
import { createObjQueryParam } from 'use-next-query-params';
import { useState } from 'react';

export default function ExamplePage() {
    const [user, setUser] = useState({ name: 'John Doe', age: 30 });

    useNextQueryParams({
      user: createObjQueryParam({
        value: user,
        onChange: (value) => {
            // Do something with the value
            // Typically, you would update the state
            setUser(value);
        },
        // required
        defaultValue: { name: 'John Doe', age: 30 }
      });
    });

    // ...
}
```

### `createStrArrayQueryParam`

The `createStrArrayQueryParam` function creates a query parameter for an array of strings.

```jsx
import { createStrArrayQueryParam } from 'use-next-query-params';
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

The `createNumArrayQueryParam` function creates a query parameter for an array of numbers.

```jsx
import { createNumArrayQueryParam } from 'use-next-query-params';
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
    readonly query: ParsedUrlQuery;
    readonly onChange: (query: ParsedUrlQuery) => void;
    readonly mode?: NextQueryParamsAdapterMode;
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
        // your router's query object
        query: router.query,
        // your router's push method
        onChange: (query) => router.push({ query }),
        // optional, default is 'default'
        mode: 'default'
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

- `default`: The default mode. The query parameters are updated when the state changes.
- `reset`: The query parameters are reset to the default values when the state changes.
- `merge`: The query parameters are merged with the default values when the state changes.

See the [demo](#demo) for an example of each mode.
