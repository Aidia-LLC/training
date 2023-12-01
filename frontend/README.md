### Table of Contents

- [Table of Contents](#table-of-contents)
- [UI, UX, and Horse Back Riding](#ui-ux-and-horse-back-riding)
- [SSG, SSR, SPA](#ssg-ssr-spa)
- [React, Virtual DOMs, Dependency Arrays](#react-virtual-doms-dependency-arrays)
  - [State](#state)
    - [Props](#props)
    - [Local State](#local-state)
    - [Context](#context)
  - [Lifecycle](#lifecycle)
  - [Effects and Dependency Arrays](#effects-and-dependency-arrays)
  - [External State](#external-state)
    - [URLS](#urls)
    - [Local Storage](#local-storage)
    - [Server Endpoints](#server-endpoints)
  - [Virtual DOM](#virtual-dom)
- [Solid](#solid)
- [Review](#review)

### UI, UX, and Horse Back Riding

Imagine riding on a horse.

If you don't want to get chafed to dreams' end... you are going to want a saddle.

When you look at the saddle, you of course want one that doesn't look like trash. You want to be taken seriously.

This is User Interface.

But... maybe more importantly, you want to get on that saddle and feel on top of the world. All the bits and pieces are exactly where you'd expect them. It feels natural, intuitive, and makes you feel like you are on top of the world when you ride.

This is User Experience.

We use utility and component libraries which help with the user interface. It keeps it looking standardized and consistent.

However, user experience requires actual effort on our part.

Put yourself in the user's shoes. How often do you need to use this feature. How can you make it easier? How horrible is it if the feature is accidentally used? How can we make this clearer and easier to understand and navigate?

These are the questions that drive us to happy clients.

### SSG, SSR, SPA

Frontends are typically rendered in one of 3 ways:

1. SSG: Static Site Generation. The code is compiled (or straight up written) directly into plain html, js, and css. This is fantastic for caching and distribution purposes. It can still interact with apis, but routes like `/users/1/connections` cannot be used. Typically avoid these if you need to use authorization. Fantastic for things like blogs.
2. SPA: Single Page Applications. The entire application is put onto a single page. Routing may happen, but will be intercepted by the frontend so you never really have a page rerender. These take a longer time to load up because they have so much to load. Use these for internal business applications.
3. SSR: Server Side Rendered. The html / js / css is generated on the fly by the server. This is fantastic for e-commerce and other areas which really need low latency, fast load times, dynamic content.

Lately, the boundaries between these have become extraordinarily blurry.

The best way to describe Astro, the current framework we are using for new projects, is it is an SSR framework that hydrates in an SPA.

Weird, right?

### React, Virtual DOMs, Dependency Arrays

A majority of our projects take advantage of React.

Let's dive into it a bit!

#### State

We have a few different ways of accessing state:

1. Props
2. Local State
   1. useState
   2. useReducer
   3. derived
3. Context
4. Externals
   1. URLs
   2. Local Storage
   3. Server Endpoints

##### Props

```jsx

// Props are owned by a parent, passed to the component
const SayHi = (p: Props) => {
  return (
    <div>Hi {p.to}</div>
  )
}

// elsewhere
<SayHi to='Steve' />
```

##### Local State

```jsx

// Local State is owned by the component
const coolCheckboxReducer = (
  currentState: boolean, 
  action: {type: "check"} | {type: 'uncheck'} | {type: 'toggle'}
) => {
  switch(action.type) {
    case 'check': return true
    case 'uncheck': return false
    case 'toggle': return !currentState
    default:{
      const _t: never = action.type
      console.error('Unknown action: ', _t)
      return currentState
    }
  }
}

// When should we use useReducer, useState, or derived state?
// Also... why the heck is it called useReducer???? Hmmm... maybe a call back to what state even is maybe??? :D

const Checkboxes = () => {
  const [checked, setChecked] = useState(false)
  const [coolerChecked, coolerCheckedDispatch] = useReducer(coolCheckboxReducer, false)


  const bothAreChecked = checked && coolerChecked // Derived state

  // Cached derived state
  // Use if the derived value is expensive to obtain...
  const cachedBothAreCheck = useMemo(
    () => checked && coolerChecked, 
    // Only recomputes if something in this array changes
    // "Dependency Array"
    [checked, coolerChecked]
  )

  return (
    <>
      <p>{bothAreChecked ? 'YAY! YOU DID IT!' : 'TRY AGAIN!'}</p>
      <input 
        type='checkbox' 
        checked={checked} 
        onChange={() => setChecked(c => !c)}
      />
      <input 
        type='checkbox' 
        checked={coolerChecked} 
        onChange={() => coolerCheckedDispatch({type: 'toggle'})} 
      />
      <button
        onClick={() => {
          setChecked(true)
          coolerCheckedDispatch({type: 'check'})
        }}
      >
        Check Both
      </button>
      <button
        onClick={() => {
          setChecked(false)
          coolerCheckedDispatch({type: 'uncheck'})
        }}
      >
        Uncheck Both
      </button>

      <ChildComponent setCheckbox={setChecked} dispatch={coolerCheckedDispatch}>
    </>
  )
}

```

##### Context

```jsx

// ThemeProvider.jsx

// Context is owned by an ancestor

// pass whatever you want the default to be if no parent provider
const ThemeContext = createContext([
  createTheme('LIGHT_THEME_17'), 
  () => {} // why am I including an empty function here?
])
const themeReducer = (theme, newTheme) => {
  switch(newTheme) {
    case 'default': return createTheme('LIGHT_THEME_17')
    case 'darkula': return createTheme('DARKULA_THEME_17')
    case 'cupcake': return createTheme('CUPCAKE_THEME_3')
    default:
      return theme
  }
}
const ThemeProvider = (props) => {
  const theme = useReducer(
    themeReducer, 
    createTheme('LIGHT_THEME_17')
  )

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext>
  )
}

export const useTheme = () => useContext(ThemeContext)[0]
export const useThemeDispatch = () => useContext(ThemeContext)[1]

// Descendant.jsx

const Descendant = () => {
  // the nearest ancestor provider or the default value!
  const theme = useTheme() 
  // specific controls rather than changing it however!
  const themeDispatch = useThemeDispatch() 

  return (
    // stuff
  )
}
```



#### Lifecycle

There are a few lifecycle things to understand well:

1. Effects
2. Effect Clean Ups
3. Rendering

These blend together to look something like this:

1. Component Mounts
2. Component Effects Fire
3. Component Renders
4. Component State Changes
5.  Component Effect Clean Ups Run
6.  Component Effects Run
7.  Component Renders
8.  Component Prop Changes
9.  Component Effect Clean Ups Run
10. Component Effects Run
11. Component Renders
12. Component Effect Clean Ups Run
13. Component Unmounts

#### Effects and Dependency Arrays

Okay, so these effects are running a lot.

What the heck is an effect, why do we have them, and how can we handle them better?

```jsx

const MyComponent = (props) => {
  const [counter, setCounter] = useState(0)

  // When does this run?
  useEffect(() => {
    if (props.count === counter) {
      setCounter(counter + 1)
    } else {
      setCounter(props.count)
    }
  })

  return (
    <span>
      Count: {counter}
    </span>
  )
}

const MyComponent2 = (props) => {
  const [counter, setCounter] = useState(0)

  // When does this run?
  useEffect(() => {
    if (props.count === counter) {
      setCounter(counter + 1)
    } else {
      setCounter(props.count)
    }
  }, 
  // Another dependency array!
  [counter, props.count]
  )

  return (
    <span>
      Count: {counter}
    </span>
  )
}

const MyComponent3 = (props) => {
  const [counter, setCounter] = useState(0)

  // When does this run?
  useEffect(() => {
    setCounter(c => {
      if (props.count === c) {
        return c + 1
      }
      return props.count
    })
  }, 
  // Another dependency array!
  [props.count]
  )

  return (
    <span>
      Count: {counter}
    </span>
  )
}

```

Okay, so we can accidentally shoot ourselves in the foot with `useEffect`. Always be on guard when you are setting state in `useEffect`. There's almost always a better way to handle it!

#### External State

Sadly, we can't start from a blank slate every time you go into the website. We need to tie in external state to keep customers happy.

##### URLS

URLs can contain a wealth of information:

First, we can have information in **route parameters**:

`/users/1/friends`

We know that the page will show friends of a user who has id 1.

And second, we can have information in **query parameters**:

`/users?name=asher`

We can guess this will show a list of users who have the name "asher".

The beauty of having the information encoded in the url is the url is then shareable - someone can just share the url with you and you can see exactly what they were seeing...

##### Local Storage

Some things you want stored on the user's computer and not on your database. Things like temporary caches, session preferences, and so on.

These are great candidates for `localStorage`.

```js

localStorage.setItem('myKey', JSON.stringify([1,2,3]))

localStorage.getItem('myKey')

```

Note that you will need to encode / decode and handle 'misses' on your own.

##### Server Endpoints

When communicating with a server, in our projects, you will see the following three methods:

1. REST, Common API Flavor - you've probably encountered this already. HTTP methods using PUT, POST, DELETE, GET operating on well defined urls like /users or /friends. Note that it is super CRUD-y. Typically it will return JSON, meaning you need to handle rendering on your own, but it makes it easy to 
2. RPC - Remote Procedure Call. Rather than relying on nouns and the standard HTTP verbs, you are limited to Commands (using POST under the hood) and Queries (using GET under the hood). Routes will look more like verbs, and it feels like you are directly calling an external system internally.
3. WebSockets - Bidirectional connection between client and server enabling the server to push data into the client rather than just relying on the client requesting data from the server.

Note that they each have advantages and disadvantages on server performance, speed, ease of use in the application, and ease of publicity across many applications.

#### Virtual DOM

So... how does React actually work?

When we call `setState`, under the hood, React is informed that it needs to rerender.

It will look at the component that had the change, will virtually rerender it. It will examine the children of the component and see if their props have changed. If they have, it will virtually rerender each of those.

These virtual renders are then compared against the previous snapshot it has.

If they are different, the changes are applied. Otherwise, nothing happens.

What are the consequences of this model?

1. Where you place state has a *massive* impact on performance. Put it too high, and you will end up with needless rerenders.
2. Small components are to be preferred over large components. Small components are far less likely to change than large components.
3. Avoid context if you can. It triggers large scale rerenders of all the children. Unavoidable to be sure, but don't make it happen every three seconds!
4. External state managing libraries can become a must. These create an external store that components can opt into, allowing data to be shared, but not rerendering everything if something needs to change.

### Solid

Is a virtual DOM the only way to do this?

Nope.

Let's talk about Signals.

Look at the following component...

```jsx

const Checkboxes = () => {
  const [checked, setChecked] = createSignal(false)
  const [coolerChecked, setCoolerChecked] = createSignal(false)


  const bothAreChecked = () => checked() && coolerChecked() // Derived state

  // Cached derived state
  // Use if the derived value is expensive to obtain...
  const cachedBothAreCheck = createMemo(
    () => checked() && coolerChecked()
  )

  return (
    <>
      <p>{bothAreChecked() ? 'YAY! YOU DID IT!' : 'TRY AGAIN!'}</p>
      <input 
        type='checkbox' 
        checked={checked()} 
        onChange={() => setChecked(c => !c)}
      />
      <input 
        type='checkbox' 
        checked={coolerChecked()} 
        onChange={() => setCoolerChecked(c => !c)} 
      />
      <button
        onClick={() => {
          setChecked(true)
          setCoolerChecked(true)
        }}
      >
        Check Both
      </button>
      <button
        onClick={() => {
          setChecked(false)
          setCoolerChecked(false)
        }}
      >
        Uncheck Both
      </button>
    </>
  )
}

```

Contrary to how Virtual DOMs work, Signals work by granular reactivity. If you `setState`, anything relying on that `state` will immediately be updated. Anything that doesn't won't be touched.

What are the consequences?

1. No dependency arrays. Effects, memos, etc know exactly what their dependencies are.
2. Extreme performance. No diff checking.
3. Component size has no impact on performance.
4. No need to reach for a state manager for performance reasons. You still may want one for your own sanity, but it won't have an impact elsewhere.

### Review

There's so much more we could have covered here.

We could have done deep dives into specifics like routers, table components, style libraries, component libraries, component testing, utility classes vs component classes, and so much more.

You will learn all of that as you work through projects.

More important right now is to have the beginnings of an understanding on key, foundational principles. We will reference these over, and over again to understand the issues you will run into and ways to evaluate future decisions.

And, in 6 months time, some of this might be completely be off - CS is evolving incredibly fast, but it also evolves incrementally. Learning the how and the why of these foundations now will help you understand the how and the why of tomorrow's new foundations better than just learning tomorrow's foundations alone.