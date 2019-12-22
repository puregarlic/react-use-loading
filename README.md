[![Actions Status](https://github.com/puregarlic/react-use-loading/workflows/default/badge.svg)](https://github.com/puregarlic/react-use-loading/actions)

# react-use-loading

Manage your component's loading state with one simple hook. Very useful if you're making AJAX requests, for example, and you want to display a spinner and a loading message to clue your users into what's going on.

## Getting Started

`react-use-loading` is just a normal NPM library. You can install it with the following command:

```sh
npm install react-use-loading
```

Or, if you prefer Yarn:

```sh
yarn add react-use-loading
```

Then, you can use it in your code like so:

```js
import { useLoading } from 'react-use-loading';
```

## Usage

```js
const [{ isLoading, message }, { start, stop }] = useLoading(
  initState,
  initMessage
);
```

### Params

| Value         | Type                  | Description                    |
| ------------- | --------------------- | ------------------------------ |
| `initState`   | `boolean | undefined` | Used to initialize `isLoading` |
| `initMessage` | `string | undefined`  | Used to initialize `message`   |

### Return Values

| Value       | Type                            | Default     | Description                                                                                                                                                                                                                     |
| ----------- | ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoading` | `boolean`                       | `false`     | Represents whether the component is engaged in loading or not                                                                                                                                                                   |
| `message`   | `string | undefined`            | `undefined` | Used to communicate to the user what loading the component is engaged in                                                                                                                                                        |
| `start`     | `(newMessage?: string) => void` | N/A         | Used to toggle the hook _into_ loading state. Results in a rerender whereafter `isLoading` is true and `message` is either a newly-specified message, or `undefined` if no message was specified. Memoized using `useCallback`. |
| `stop`      | `() => void`                    | N/A         | Used the toggle the hook _out of_ loading state. Results in a rerender whereafter `isLoading` is false and `message` is undefined. Memoized using `useCallback`.                                                                |

## Examples

### Using `isLoading`

This is the core reason that `react-use-loading` exists. Use this value to communicate whether the component is loading or not.

```jsx
import React from 'react';
import { useLoading } from 'react-use-loading';

import Spinner from '../components/spinner';
import SomeComponent from '../components/some-component';

const MyComponent = () => {
  const [{ isLoading }] = useLoading(true);

  // Logic stuff...

  return isLoading ? <Spinner /> : <SomeComponent />;
};
```

### Using `message`

The `message` variable is useful for communicating information to the user _besides_ just the fact that your app is fetching information. For example, you could tell the user that you're fetching their profile information, or that you're saving their updated settings.

```jsx
import React from 'react';
import { useLoading } from 'react-use-loading';

import Spinner from '../components/spinner';
import SomeComponent from '../components/some-component';

const MyComponent = () => {
  const [{ isLoading, message }] = useLoading(true, 'Getting profile info...');

  // Logic stuff...

  return isLoading ? <Spinner message={message} /> : <SomeComponent />;
};
```

### Using `start` and `stop`

These methods are used for toggling loading state. They are useful for when you're making AJAX requests within the component, or when you start/stop any long-running task.

#### Calling `start` once

```jsx
import React, { useState, useEffect } from 'react';
import ky from 'ky';
import { useLoading } from 'react-use-loading';

import Spinner from '../components/spinner';
import SomeComponent from '../components/some-component';

const MyComponent = () => {
  const [profileInfo, setProfileInfo] = useState();
  const [{ isLoading, message }, { start, stop }] = useLoading(
    true // Initialize `isLoading` as true so there's no flash of content
  );

  useEffect(() => {
    (async () => {
      try {
        start('Getting profile info...');
        const res = await ky.get(/* Profile data endpoint */);
        setProfileInfo(res);
      } catch (error) {
        console.error(error);
      } finally {
        stop();
      }
    })();
  }, [start, stop]); // You can include these methods in the dependency
  //                    array and be confident that they will not change.

  return isLoading ? <Spinner message={message} /> : <SomeComponent />;
};
```

#### Calling `start` multiple times

You can safely call `start` multiple times before you call `stop` if you would like to tell the user that you're interacting with multiple data soruces.

```jsx
import React, { useState, useEffect } from 'react';
import ky from 'ky';
import { useLoading } from 'react-use-loading';

import Spinner from '../components/spinner';
import SomeComponent from '../components/some-component';

const MyComponent = () => {
  const [posts, setPosts] = useState();
  const [profileInfo, setProfileInfo] = useState();
  const [recommendations, setRecommentations] = useState();
  const [{ isLoading, message }, { start, stop }] = useLoading(
    true // Initialize `isLoading` as true so there's no flash of content
  );

  useEffect(() => {
    (async () => {
      try {
        start('Getting profile info...');
        const profileRes = await ky.get(/* Profile data endpoint */);
        setProfileInfo(profileRes);

        start('Getting your posts...');
        const postsRes = await ky.get(/* Posts endpoint */);
        setPosts(postsRes);

        start('Getting your recommendations...');
        const recommendationsRes = await ky.get(/* Recommendations endpoint */);
        setRecommendations(recommendationRes);
      } catch (error) {
        console.error(error);
      } finally {
        stop();
      }
    })();
  }, [start, stop]); // You can include these methods in the dependency
  //                    array and be confident that they will not change.

  return isLoading ? <Spinner message={message} /> : <SomeComponent />;
};
```

#### Handling Aborts

One thing to keep in mind when you're handling asynchronous requests in your component is that your component might be unmounted in the middle of a request. `stop` will attempt to update state behind the scenes, so when you abort your request make sure to prevent calling `stop` in the event of an `AbortError`.

```jsx
import React, { useState, useEffect, useRef } from 'react'
import ky from 'ky'
import { useLoading } from 'react-use-loading'

import Spinner from '../components/spinner'
import SomeComponent from '../components/some-component'

const abortController = new AbortController()

const MyComponent = () => {
  const [profileInfo, setProfileInfo] = useState()
  const [{ isLoading, message }, { start, stop }] = useLoading(
    true // Initialize `isLoading` as true so there's no flash of content
  )

  useEffect(() => {
    return () => abortController.abort()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        start('Getting profile info...')
        const profileRes = await ky.get(/* Profile data endpoint */, { signal: abortController.signal })
        setProfileInfo(profileRes)
        stop()
      } catch (error) {
        if (error.name === 'AbortError') return // Exit function if request was aborted
        console.error(error)
        stop()
      }
    })()
  }, [start, stop]) // You can include these methods in the dependency
                    // array and be confident that they will not change.

  return isLoading
    ? <Spinner message={message} />
    : <SomeComponent />
}
```

## Contributing

Contributions are welcome. Please fork the repository and then make a pull request once you've completed your changes. Make sure to write new tests or alter existing ones to validate your changes as well.

## Thanks

This project was bootstrapped with Jared Palmer's wonderful TSDX utility. The code itself is inspired by work I've completed for the Linux Foundation.
