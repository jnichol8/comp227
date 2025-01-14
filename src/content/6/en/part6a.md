---
mainImage: ../../../images/part-6.svg
part: 6
letter: a
lang: en
---

<div class="content">

So far, we have followed the state management conventions recommended by React.
We have placed the state and the methods for handling it in [the root component](https://reactjs.org/docs/lifting-state-up.html) of the application.
The state and its handler methods have then been passed to other components with props.
This works up to a certain point, but when applications grow larger, state management becomes challenging.

### Flux-architecture

Facebook developed the [Flux](https://facebook.github.io/flux/docs/in-depth-overview/)- architecture to make state management easier.
In Flux, the state is separated from the React components and into its own **stores**.
State in the store is not changed directly, but with different **actions**.

When an action changes the state of the store, the views are rerendered:

![diagram action->dispatcher->store->view](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-1300w.png)

If some action on the application, for example pushing a button, causes the need to change the state, the change is made with an action.
This causes re-rendering the view again:

![same diagram as above but with action looping back](https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-with-client-action-1300w.png)

Flux offers a standard way for how and where the application's state is kept and how it is modified.

### Redux

Facebook has an implementation for Flux, but we will be using the [Redux](https://redux.js.org) - library.
It works with the same principle but is a bit simpler.
Facebook also uses Redux now instead of their original Flux.

We will get to know Redux by implementing a counter application yet again:

![browser counter application](../../images/6/1.png)

Create a new create-react-app-application and install </i>redux</i> with the command

```bash
npm install redux
```

As in Flux, in Redux the state is also stored in a [store](https://redux.js.org/basics/store).

The whole state of the application is stored in ***one*** JavaScript object in the store.
Because our application only needs the value of the counter, we will save it straight to the store.
If the state was more complicated, different things in the state would be saved as separate fields of the object.

The state of the store is changed with [actions](https://redux.js.org/basics/actions).
Actions are objects, which have at least a field determining the *type* of the action.
Our application needs for example the following action:

```js
{
  type: 'INCREMENT'
}
```

If there is data involved with the action, other fields can be declared as needed.
However, our counting app is so simple that the actions are fine with just the type field.

The impact of the action to the state of the application is defined using a [reducer](https://redux.js.org/basics/reducers).
In practice, a reducer is a function that is given the current state and an action as parameters.
It ***returns*** a new state.

Let's now define a reducer for our application:

```js
const counterReducer = (state, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else if (action.type === 'ZERO') {
    return 0
  }

  return state
}
```

The first parameter is the `state` in the store.
The reducer returns a ***new state*** based on the `action` type.

Let's change the code a bit.
We have used if-else statements to respond to an action and change the state.
However, the [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement is the most common approach to writing a reducer.

Let's also define a [default value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) of 0 for the parameter `state`.
Now the reducer works even if the store state has not been primed yet.

```js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
      return state
  }
}
```

Reducer is never supposed to be called directly from the application's code.
Reducer is only given as a parameter to the `createStore` function which creates the store:

```js
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

The store now uses the reducer to handle **actions**,
which are **dispatched** or 'sent' to the store with its [dispatch](https://redux.js.org/api/store#dispatchaction) method.

```js
store.dispatch({ type: 'INCREMENT' })
```

You can find out the state of the store using the method [getState](https://redux.js.org/api/store#getstate).

For example the following code:

```js
const store = createStore(counterReducer)
console.log(store.getState())
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
console.log(store.getState())
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
console.log(store.getState())
```

would print the following to the console

```shell
0
3
-1
```

because at first, the state of the store is 0.
After three `INCREMENT` actions the state is 3.
In the end, after `ZERO` and `DECREMENT` actions, the state is -1.

The third important method the store has is [subscribe](https://redux.js.org/api/store#subscribelistener),
which is used to create callback functions the store calls whenever an action is dispatched to the store.

If, for example, we would add the following function to subscribe, *every change in the store* would be printed to the console.

```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

so the code

```js
const store = createStore(counterReducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'ZERO' })
store.dispatch({ type: 'DECREMENT' })
```

would cause the following to be printed

```shell
1
2
3
0
-1
```

The code of our counter application is the following.
All of the code has been written in the same file (*index.js*),
so `store` is straight available for the React code.
We will get to know better ways to structure React/Redux code later.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const renderApp = () => root.render(<App />)

renderApp()
store.subscribe(renderApp)
```

There are a few notable things in the code.
`App` renders the value of the counter by asking it from the store with the method `store.getState()`.
The action handlers of the buttons ***dispatch*** the right actions to the store.

When the state in the store is changed, React is not able to automatically rerender the application.
Thus we have registered a function `renderApp`, which renders the whole app, to listen for changes in the store with the `store.subscribe` method.
Notice that we have to immediately call the `renderApp` method.
Without the call, the first rendering of the app would never happen.

### Redux-tasks

We aim to modify our task application to use Redux for state management.
However, let's first cover a few key concepts through a simplified task application.

The first version of our application is the following

```js
const taskReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}

const store = createStore(taskReducer)

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'the app state is in redux store',
    important: true,
    id: 1
  }
})

store.dispatch({
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
})

const App = () => {
  return(
    <div>
      <ul>
        {store.getState().map(task=>
          <li key={task.id}>
            {task.content} <strong>{task.important ? 'important' : ''}</strong>
          </li>
        )}
        </ul>
    </div>
  )
}
```

So far the application does not have the functionality for adding new tasks, although it is possible to do so by dispatching `NEW_NOTE` actions.

Now the actions have a type and a field `data`, which contains the task to be added:

```js
{
  type: 'NEW_NOTE',
  data: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

### Pure functions, immutable

The initial version of the reducer is very simple:

```js
const taskReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    state.push(action.data)
    return state
  }

  return state
}
```

The state is now an Array.
*NEW_NOTE*-type actions cause a new task to be added to the state with the [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method.

The application seems to be working, but the reducer we have declared is bad.
It breaks the [basic assumption](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers) of Redux reducer
that reducers must be [pure functions](https://en.wikipedia.org/wiki/Pure_function).

Pure functions are such, that they **do not cause any side effects** and they must always return the same response when called with the same parameters.

We added a new task to the state with the method `state.push(action.data)` which ***changes*** the state of the state-object.
This is not allowed.
The problem is easily solved by using the
[concat method,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
which creates a *new array*,
which contains all the elements of the old array and the new element:

```js
const taskReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return state.concat(action.data)
  }

  return state
}
```

A reducer state must be composed of [immutable](https://en.wikipedia.org/wiki/Immutable_object) objects.
If there is a change in the state, the old object is not changed, but it is ***replaced with a new, changed, object***.
This is exactly what we did with the new reducer: the old array is replaced with the new one.

Let's expand our reducer so that it can handle the change of a task's importance:

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```

Since we do not have any code which uses this functionality yet, we are expanding the reducer in the 'test-driven' way.
Let's start by creating a test for handling the action `NEW_NOTE`.

To make testing easier, we'll first move the reducer's code to its own module to file *src/reducers/taskReducer.js*.
We'll also add the library [deep-freeze](https://www.npmjs.com/package/deep-freeze),
which can be used to ensure that the reducer has been correctly defined as an immutable function.
Let's install the library as a development dependency

```js
npm install deep-freeze --save-dev
```

The test, which we define in file *src/reducers/taskReducer.test.js*, has the following content:

```js
import taskReducer from './taskReducer'
import deepFreeze from 'deep-freeze'

describe('taskReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      data: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = taskReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.data)
  })
})
```

The `deepFreeze(state)` command ensures that the reducer does not change the state of the store given to it as a parameter.
If the reducer uses the `push` command to manipulate the state, the test will not pass

![terminal showing test failure and error about not using array.push](../../images/6/2.png)

Now we'll create a test for the `TOGGLE_IMPORTANCE` action:

```js
test('returns new state with action TOGGLE_IMPORTANCE', () => {
  const state = [
    {
      content: 'the app state is in redux store',
      important: true,
      id: 1
    },
    {
      content: 'state changes are made with actions',
      important: false,
      id: 2
    }]

  const action = {
    type: 'TOGGLE_IMPORTANCE',
    data: {
      id: 2
    }
  }

  deepFreeze(state)
  const newState = taskReducer(state, action)

  expect(newState).toHaveLength(2)

  expect(newState).toContainEqual(state[0])

  expect(newState).toContainEqual({
    content: 'state changes are made with actions',
    important: true,
    id: 2
  })
})
```

So the following action

```js
{
  type: 'TOGGLE_IMPORTANCE',
  data: {
    id: 2
  }
}
```

has to change the importance of the task with the id 2.

The reducer is expanded as follows

```js
const taskReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return state.concat(action.data)
    case 'TOGGLE_IMPORTANCE': {
      const id = action.data.id
      const taskToChange = state.find(t => t.id === id)
      const changedTask = { 
        ...taskToChange, 
        important: !taskToChange.important 
      }
      return state.map(task =>
        task.id !== id ? task : changedTask 
      )
     }
    default:
      return state
  }
}
```

We create a copy of the task whose importance has changed with the syntax [familiar from part 2](/part2/altering_data_in_server#changing-the-importance-of-tasks),
and replace the state with a new state containing all the tasks which have not changed and the copy of the changed task `changedTask`.

Let's recap what goes on in the code.
First, we search for a specific task object, the importance of which we want to change:

```js
const taskToChange = state.find(t => t.id === id)
```

then we create a new object, which is a *copy* of the original task, only the value of the ***important*** field has been changed to the opposite of what it was:

```js
const changedTask = { 
  ...taskToChange, 
  important: !taskToChange.important 
}
```

A new state is then returned.
We create it by taking all of the tasks from the old state except for the desired task, which we replace with its slightly altered copy:

```js
state.map(task =>
  task.id !== id ? task : changedTask 
)
```

### Array spread syntax

Because we now have quite good tests for the reducer, we can refactor the code safely.

Adding a new task creates the state it returns with Array's `concat` function.
Let's take a look at how we can achieve the same
by using the JavaScript [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) syntax:

```js
const taskReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'TOGGLE_IMPORTANCE':
      // ...
    default:
    return state
  }
}
```

The spread -syntax works as follows.
If we declare

```js
const numbers = [1, 2, 3]
```

`...numbers` breaks the array up into individual elements, which can be placed in another array.

```js
[...numbers, 4, 5]
```

and the result is an array `[1, 2, 3, 4, 5]`.

If we would have placed the array to another array without the spread

```js
[numbers, 4, 5]
```

the result would have been `[ [1, 2, 3], 4, 5]`.

When we take elements from an array by [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment),
a similar-looking syntax is used to *gather* the rest of the elements:

```js
const numbers = [1, 2, 3, 4, 5, 6]

const [first, second, ...rest] = numbers

console.log(first)     // prints 1
console.log(second)   // prints 2
console.log(rest)     // prints [3, 4, 5, 6]
```

</div>

<div class="tasks">

### Exercises 6.1-6.2

Let's make a simplified version of the studytracker exercise from part 1.
Let's handle the state management with Redux.

You can take the project from this repository <https://github.com/comp227/studytracker-redux> for the base of your project.

> *Start by removing the git configuration of the cloned repository, and by installing dependencies*

```bash
cd studytracker-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

#### 6.1: studytracker revisited, step1

Before implementing the functionality of the UI, let's implement the functionality required by the store.

We have to save the number of each kind of feedback to the store, so the form of the state in the store is:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

The project has the following base for a reducer:

```js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'ZERO':
      return state
    default: return state
  }

}

export default counterReducer
```

and a base for its tests

```js
import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('studytracker reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```

**Implement the reducer and its tests.**

In the tests, make sure that the reducer is an **immutable function** with the ***deep-freeze*** library.
Ensure that the provided first test passes, because Redux expects that the reducer returns a sensible original state when it is called so that the first parameter `state`,
which represents the previous state, is `undefined`.

Start by expanding the reducer so that both tests pass.
Then add the rest of the tests, and finally the functionality that they are testing.

A good model for the reducer is the [redux-tasks](/part6/flux_architecture_and_redux#pure-functions-immutable)
example above.

#### 6.2: studytracker revisited, step2

Now implement the actual functionality of the application.

Notice that since all the code is in the file *index.js* and you might need to manually reload the page after each change
since the automatic reloading of the browser content does not always work for that file!

</div>

<div class="content">

### Uncontrolled form

Let's add the functionality for adding new tasks and changing their importance:

```js
const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      data: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = (id) => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      data: { id }
    })
  }

  return (
    <div>
      <form onSubmit={addTask}>
        <input name="task" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(task =>
          <li
            key={task.id} 
            onClick={() => toggleImportance(task.id)}
          >
            {task.content} <strong>{task.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}
```

The implementation of both functionalities is straightforward.
Notice that we **have not** bound the state of the form fields to the state of the `App` component like we have previously done.
React calls this kind of form [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html).

>Uncontrolled forms have certain limitations (for example, dynamic error messages or disabling the submit button based on input are not possible).
However they are suitable for our current needs.

You can read more about uncontrolled forms [here](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/).

The method handler for adding new tasks is simple, it just dispatches the action for adding tasks:

```js
addTask = (event) => {
  event.preventDefault()
  const content = event.target.task.value  // highlight-line
  event.target.task.value = ''
  store.dispatch({
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  })
}
```

We can get the content of the new task straight from the form field.
Because the field has a name, we can access the content via the event object `event.target.task.value`.

```js
<form onSubmit={addTask}>
  <input name="task" /> // highlight-line
  <button type="submit">add</button>
</form>
```

A task's importance can be changed by clicking its name.
The event handler is very simple:

```js
toggleImportance = (id) => {
  store.dispatch({
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  })
}
```

### Action creators

We begin to notice that, even in applications as simple as ours, using Redux can simplify the frontend code.
However, we can do a lot better.

React components don't need to know the Redux action types and forms.
Let's separate creating actions into separate functions:

```js
const createTask = (content) => {
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}
```

Functions that create actions are called [action creators](https://redux.js.org/advanced/async-actions#synchronous-action-creators).

The `App` component does not have to know anything about the inner representation of the actions anymore, it just gets the right action by calling the creator function:

```js
const App = () => {
  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    store.dispatch(createTask(content)) // highlight-line
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))// highlight-line
  }

  // ...
}
```

### Forwarding Redux Store to various components

Aside from the reducer, our application is in one file.
This is of course not sensible, and we should separate `App` into its module.

Now the question is, how can the `App` access the store after the move?
And more broadly, when a component is composed of many smaller components, there must be a way for all of the components to access the store.
There are multiple ways to share the Redux store with components.
First, we will look into the newest, and possibly the easiest way is using the [hooks](https://react-redux.js.org/api/hooks) API of the [react-redux](https://react-redux.js.org/) library.

First, we install react-redux

```bash
npm install react-redux
```

Next, we move the `App` component into its own file *App.js*.
Let's see how this affects the rest of the application files.

*index.js* becomes:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import { createStore } from 'redux'
import { Provider } from 'react-redux' // highlight-line
import taskReducer from './reducers/taskReducer'

const store = createStore(taskReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  // highlight-line
    <App />
  </Provider>  // highlight-line
)
```

Notice that the application is now defined as a child of a [Provider](https://react-redux.js.org/api/provider) component provided by the react-redux library.
The application's store is given to the Provider as its attribute `store`.

Defining the action creators has been moved to the file *reducers/taskReducer.js* where the reducer is defined.
That file looks like this:

```js
const taskReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const createTask = (content) => { // highlight-line
  return {
    type: 'NEW_NOTE',
    data: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => { // highlight-line
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default taskReducer
```

If the application has many components which need the store, the `App` component must pass *store* as props to all of those components.

The module now has multiple [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) commands.

The reducer function is still returned with the `export default` command, so the reducer can be imported the usual way:

```js
import taskReducer from './reducers/taskReducer'
```

A module can have only ***one default export***, but multiple "normal" exports

```js
export const createTask = (content) => {
  // ...
}

export const toggleImportanceOf = (id) => { 
  // ...
}
```

Normally (not as defaults) exported functions can be imported with the curly brace syntax:

```js
import { createTask } from './../reducers/taskReducer'
```

Code for the `App` component

```js
import { createTask, toggleImportanceOf } from './reducers/taskReducer' // highlight-line
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  const tasks = useSelector(state => state)  // highlight-line

  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    dispatch(createTask(content))  // highlight-line
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  return (
    <div>
      <form onSubmit={addTask}>
        <input name="task" /> 
        <button type="submit">add</button>
      </form>
      <ul>
        {tasks.map(task =>  // highlight-line
          <li
            key={task.id} 
            onClick={() => toggleImportance(task.id)}
          >
            {task.content} <strong>{task.important ? 'important' : ''}</strong>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
```

There are a few things to observe in the code.
Previously the code dispatched actions by calling the dispatch method of the Redux store:

```js
store.dispatch({
  type: 'TOGGLE_IMPORTANCE',
  data: { id }
})
```

Now it does it with the `dispatch` function from the [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) hook.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  const dispatch = useDispatch()  // highlight-line
  // ...

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id)) // highlight-line
  }

  // ...
}
```

The `useDispatch` hook provides any React component access to the dispatch function of the Redux store defined in *index.js*.
This allows all components to make changes to the state of the Redux store.

The component can access the tasks stored in the store with the [useSelector](https://react-redux.js.org/api/hooks#useselector)-hook of the react-redux library.

```js
import { useSelector, useDispatch } from 'react-redux'  // highlight-line

const App = () => {
  // ...
  const tasks = useSelector(state => state)  // highlight-line
  // ...
}
```

`useSelector` receives a function as a parameter.
The function either searches for or selects data from the Redux store.
Here we need all of the tasks, so our selector function returns the whole state:

```js
state => state
```

which is a shorthand for:

```js
(state) => {
  return state
}
```

Usually, selector functions are a bit more interesting and return only selected parts of the contents of the Redux store.
We could for example return only tasks marked as important:

```js
const importantTasks = useSelector(state => state.filter(task => task.important))  
```

### More components

Let's separate creating a new task into a component.

```js
import { useDispatch } from 'react-redux' // highlight-line
import { createTask } from '../reducers/taskReducer' // highlight-line

const NewTask = (props) => {
  const dispatch = useDispatch() // highlight-line

  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    dispatch(createTask(content)) // highlight-line
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewTask
```

Unlike in the React code we did without Redux, the event handler for changing the state of the app (which now lives in Redux)
has been moved away from the `App` to a child component.
The logic for changing the state in Redux is still neatly separated from the whole React part of the application.

We'll also separate the list of tasks and displaying a single task into their own components (which will both be placed in the *Notices.js* file ):

```js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/taskReducer' // highlight-line

const Task = ({ task, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {task.content} 
      <strong> {task.important ? 'important' : ''}</strong>
    </li>
  )
}

const Tasks = () => {
  const dispatch = useDispatch() // highlight-line
  const tasks = useSelector(state => state) // highlight-line

  return(
    <ul>
      {tasks.map(task =>
        <Task
          key={task.id}
          task={task}
          handleClick={() => 
            dispatch(toggleImportanceOf(task.id))
          }
        />
      )}
    </ul>
  )
}

export default Tasks
```

The logic for changing the importance of a task is now in the component managing the list of tasks.

There is not much code left in `App`:

```js
const App = () => {

  return (
    <div>
      <NewTask />
      <Tasks />
    </div>
  )
}
```

`Task`, responsible for rendering a single task, is very simple and is not aware that the event handler it gets as props dispatches an action.
These kinds of components are called [presentational](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) in React terminology.

`Tasks`, on the other hand, is a
[container component,](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
as it contains some application logic:
it defines what the event handlers of the `Task` components do and coordinates the configuration of **presentational** components, that is, the `Task`s.

We will return to the presentational/container division later in this part.

The code of the Redux application can be found on
[GitHub](https://github.com/comp227/redux-tasks/tree/part6-1), branch *part6-1*.

</div>

<div class="tasks">

### Exercises 6.3-6.8

Let's make a new version of the joke voting application from part 1.
Take the project from this repository <https://github.com/comp227/redux-jokes> to base your solution on.

If you clone the project into an existing git repository, *remove the git configuration of the cloned application:*

```bash
cd redux-jokes  // go to the cloned repository
rm -rf .git
```

The application can be started as usual, but you have to install the dependencies first:

```bash
npm install
npm start
```

After completing these exercises, your application should look like this:

![browser showing jokes and vote buttons](../../images/6/3.png)

#### 6.3: jokes, step1

Implement the functionality for voting jokes.
The number of votes must be saved to a Redux store.

#### 6.4: jokes, step2

Implement the functionality for adding new jokes.

You can keep the form uncontrolled like we did [earlier](/part6/flux_architecture_and_redux#uncontrolled-form).

#### 6.5: jokes, step3

Make sure that the jokes are ordered by the number of votes.

#### 6.6: jokes, step4

If you haven't done so already, separate the creation of action-objects to [action creator](https://read.reduxbook.com/markdown/part1/04-action-creators.html)
functions and place them in the *src/reducers/jokeReducer.js* file,
so do what we have been doing since the chapter [action creators](/part6/flux_architecture_and_redux#action-creators).

#### 6.7: jokes, step5

Separate the creation of new jokes into a component called `JokeForm`.
Move all logic for creating a new joke into this new component.

#### 6.8: jokes, step6

Separate the rendering of the joke list into a component called `JokeList`.
Move all logic related to voting for a joke to this new component.

Now the `App` component should look like this:

```js
import JokeForm from './components/JokeForm'
import JokeList from './components/JokeList'

const App = () => {
  return (
    <div>
      <h2>Jokes</h2>
      <JokeForm />
      <JokeList />
    </div>
  )
}

export default App
```

</div>
