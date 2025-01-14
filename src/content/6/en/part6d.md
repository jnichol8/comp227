---
mainImage: ../../../images/part-5.svg
part: 6
letter: d
lang: en
---

<div class="content">

So far we have used our Redux store with the help of the [hook](https://react-redux.js.org/api/hooks) API from react-redux.
Practically this has meant using the [useSelector](https://react-redux.js.org/api/hooks#useselector)
and [useDispatch](https://react-redux.js.org/api/hooks#usedispatch) functions.

To finish this part we will look into another older and more complicated way to use Redux,
the [connect](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md) function provided by react-redux.

***In new applications, use the hook API***.
Knowing how to use connect though is useful when maintaining older projects using Redux.

### Using the connect function to share the Redux store to components

Let's modify the `Tasks` component so that instead of using the hook API (the `useDispatch` and  `useSelector` functions) it uses the `connect` function.
We have to modify the following parts of the component:

````js
import { useDispatch, useSelector } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/taskReducer'

const Tasks = () => {
  // highlight-start
  const dispatch = useDispatch() 
  const tasks = useSelector(({filter, tasks}) => {
    if ( filter === 'ALL' ) {
      return tasks
    }
    return filter === 'IMPORTANT'
      ? tasks.filter(task => task.important)
      : tasks.filter(task => !task.important)
  })
  // highlight-end

  return(
    <ul>
      {tasks.map(task =>
        <Task
          key={task.id}
          task={task}
          handleClick={() => 
            dispatch(toggleImportanceOf(task.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}

export default Tasks
````

The `connect` function can be used for transforming "regular" React components so that the state of the Redux store can be "mapped" into the component's props.

Let's first use the `connect` function to transform our `Tasks` component into a **connected component**:

```js
import { connect } from 'react-redux' // highlight-line
import { toggleImportanceOf } from '../reducers/taskReducer'

const Tasks = () => {
  // ...
}

const ConnectedTasks = connect()(Tasks) // highlight-line
export default ConnectedTasks           // highlight-line
```

The module exports the *connected component* that works exactly like the previous regular component for now.

The component needs the list of tasks and the value of the filter from the Redux store.
The `connect` function accepts a so-called
[mapStateToProps function](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapstatetoprops-state-ownprops--object)
as its first parameter.
The function can be used for defining the props of the *connected component* that are based on the state of the Redux store.

If we define:

```js
const Tasks = (props) => { // highlight-line
  const dispatch = useDispatch()

// highlight-start
  const tasksToShow = () => {
    if ( props.filter === 'ALL' ) {
      return props.tasks
    }
    
    return props.filter  === 'IMPORTANT'
      ? props.tasks.filter(task => task.important)
      : props.tasks.filter(task => !task.important)
  }
  // highlight-end

  return(
    <ul>
      {tasksToShow().map(task => // highlight-line
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

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    filter: state.filter,
  }
}

const ConnectedTasks = connect(mapStateToProps)(Tasks) // highlight-line

export default ConnectedTasks
```

The `Tasks` component can access the state of the store directly, e.g. through `props.tasks` contains the list of tasks.
Similarly, `props.filter` references the value of the filter.

The situation that results from using `connect` with the `mapStateToProps` function we defined can be visualized like this:

![diagram task list and filter connected to redux store](../../images/6/24c.png)

The `Tasks` component has "direct access" via `props.tasks` and `props.filter` for inspecting the state of the Redux store.

The `TaskList` component does not need the information about which filter is selected, so we can move the filtering logic elsewhere.
We just have to give it correctly filtered tasks in the `tasks` prop:

```js
const Tasks = (props) => {
  const dispatch = useDispatch()

  return(
    <ul>
      {props.tasks.map(task =>
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

// highlight-start
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      tasks: state.tasks
    }
  }

  return {
    tasks: (state.filter  === 'IMPORTANT' 
      ? state.tasks.filter(task => task.important)
      : state.tasks.filter(task => !task.important)
    )
  }
}
// highlight-end

const ConnectedTasks = connect(mapStateToProps)(Tasks)
export default ConnectedTasks  
```

### mapDispatchToProps

Now we have gotten rid of `useSelector`, but `Tasks` still uses the `useDispatch` hook and the `dispatch` function returning it:

```js
const Tasks = (props) => {
  const dispatch = useDispatch() // highlight-line

  return(
    <ul>
      {props.tasks.map(task =>
        <Task
          key={task.id}
          task={task}
          handleClick={() => 
            dispatch(toggleImportanceOf(task.id)) // highlight-line
          }
        />
      )}
    </ul>
  )
}
```

The second parameter of the `connect` function can be used for defining
[mapDispatchToProps](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#mapdispatchtoprops-object--dispatch-ownprops--object),
which is a group of **action creator** functions passed to the connected component as props.
Let's make the following changes to our existing connect operation:

```js
const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    filter: state.filter,
  }
}

// highlight-start
const mapDispatchToProps = {
  toggleImportanceOf,
}
// highlight-end

const ConnectedTasks = connect(
  mapStateToProps,
  mapDispatchToProps // highlight-line
)(Tasks)

export default ConnectedTasks
```

Now the component can directly dispatch the action defined by the `toggleImportanceOf` action creator by calling the function through its props:

```js
const Tasks = (props) => {
  return(
    <ul>
      {props.tasks.map(task =>
        <Task
          key={task.id}
          task={task}
          handleClick={() => props.toggleImportanceOf(task.id)}
        />
      )}
    </ul>
  )
}
```

This means that instead of dispatching the action like this:

```js
dispatch(toggleImportanceOf(task.id))
```

When using `connect` we can simply do this:

```js
props.toggleImportanceOf(task.id)
```

There is no need to call the `dispatch` function separately since `connect` has already modified the `toggleImportanceOf` action creator into a form that contains the dispatch.

It can take some time to wrap your head around how `mapDispatchToProps` works,
especially once we take a look at an [alternative way of using it](/part6/connect#alternative-way-of-using-map-dispatch-to-props).

The resulting situation from using `connect` can be visualized like this:

![diagram showing toggle connecting to state in redux and dispatch inside of redux](../../images/6/25b.png)

In addition to accessing the store's state via `props.tasks` and `props.filter`,
the component also references a function that can be used for dispatching ***tasks/toggleImportanceOf***-type actions via its `toggleImportanceOf` prop.

The code for the newly refactored `Tasks` component looks like this:

```js
import { connect } from 'react-redux' 
import { toggleImportanceOf } from '../reducers/taskReducer'

const Tasks = (props) => {
  return(
    <ul>
      {props.tasks.map(task =>
        <Task
          key={task.id}
          task={task}
          handleClick={() => props.toggleImportanceOf(task.id)}
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      tasks: state.tasks
    }
  }

  return {
    tasks: (state.filter  === 'IMPORTANT' 
    ? state.tasks.filter(task => task.important)
    : state.tasks.filter(task => !task.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks)
```

Let's also use `connect` to create new tasks:

```js
import { connect } from 'react-redux' 
import { createTask } from '../reducers/taskReducer'

const NewTask = (props) => { // highlight-line
  
  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    props.createTask(content) // highlight-line
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}

// highlight-start
export default connect(
  null, 
  { createTask }
)(NewTask)
// highlight-end
```

Since the component does not need to access the store's state, we can simply pass `null` as the first parameter to `connect`.

You can find the code for our current application in its entirety in the *part6-5* branch of
[this GitHub repository](https://github.com/comp227/redux-tasks/tree/part6-5).

### Referencing action creators passed as props

Let's direct our attention to one interesting detail in the `NewTask` component:

```js
import { connect } from 'react-redux' 
import { createTask } from '../reducers/taskReducer'  // highlight-line

const NewTask = (props) => {
  
  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    props.createTask(content)  // highlight-line
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}

export default connect(
  null, 
  { createTask }  // highlight-line
)(NewTask)
```

Developers who are new to connect may find it puzzling that there are two versions of the `createTask` action creator in the component.

The function must be referenced as `props.createTask` through the component's props,
as this is the version that *contains the automatic dispatch* added by `connect`.

Due to the way that the action creator is imported:

```js
import { createTask } from './../reducers/taskReducer'
```

The action creator can also be referenced directly by calling `createTask`.
You should not do this, since this is the unmodified version of the action creator that does not contain the added automatic dispatch.

If we print the functions to the console from the code (we have not yet looked at this useful debugging trick):

```js
const NewTask = (props) => {
  console.log(createTask)
  console.log(props.createTask)

  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    props.createTask(content)
  }

  // ...
}
```

We can see the difference between the two functions:

![devtools console of two functions](../../images/6/10.png)

The first function is a regular *action creator* whereas the second function contains the additional dispatch to the store that was added by connect.

Connect is an incredibly useful tool although it may seem difficult at first due to its level of abstraction.

### An alternative way of using mapDispatchToProps

We defined the function for dispatching actions from the connected `NewTask` component in the following way:

```js
const NewTask = () => {
  // ...
}

export default connect(
  null,
  { createTask }
)(NewTask)
```

The connect expression above enables the component to dispatch actions for creating new tasks with the `props.createTask('a new task')` command.

The functions passed in `mapDispatchToProps` must be *action creators*, that is, functions that return Redux actions.

It is worth noting that the `mapDispatchToProps` parameter is a **JavaScript object**, as the definition:

```js
{
  createTask
}
```

Is just shorthand for defining the object literal:

```js
{
  createTask: createTask
}
```

Which is an object that has a single `createTask` property with the `createTask` function as its value.

Alternatively, we could pass the following *function* definition as the second parameter to `connect`:

```js
const NewTask = (props) => {
  // ...
}

// highlight-start
const mapDispatchToProps = dispatch => {
  return {
    createTask: value => {
      dispatch(createTask(value))
    },
  }
}
// highlight-end

export default connect(
  null,
  mapDispatchToProps
)(NewTask)
```

In this alternative definition, `mapDispatchToProps` is a function that `connect` will invoke by passing to it the `dispatch` function as its parameter.
The return value of the function is an object that defines a group of functions that get passed to the connected component as props.
Our example defines the function passed as the `createTask` prop:

```js
value => {
  dispatch(createTask(value))
}
```

Which simply dispatches the action created with the `createTask` action creator.

The component then references the function through its props by calling `props.createTask`:

```js
const NewTask = (props) => {
  const addTask = (event) => {
    event.preventDefault()
    const content = event.target.task.value
    event.target.task.value = ''
    props.createTask(content)
  }

  return (
    <form onSubmit={addTask}>
      <input name="task" />
      <button type="submit">add</button>
    </form>
  )
}
```

The concept is quite complex and describing it through text is challenging.
In most cases, it is sufficient to use the simpler form of `mapDispatchToProps`.
However, there are situations where a more complicated definition is necessary,
like if the *dispatched actions* need to reference [the props of the component](https://github.com/gaearon/redux-devtools/issues/250#issuecomment-186429931).

The creator of Redux Dan Abramov has created a wonderful tutorial called
[Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)
that you can find on Egghead.io.
I highly recommend the tutorial to everyone.
The last four videos discuss the `connect` method, particularly the more "complicated" way of using it.

### Presentational/Container revisited

The refactored `Tasks` component is almost entirely focused on rendering tasks
and is quite close to being a so-called [presentational component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, presentational components:

- Are concerned with how things look.
- May contain both presentational and container components inside, and usually have some DOM markup and styles of their own.
- Often allow containment via `props.children`.
- Have no dependencies on the rest of the app, such as Redux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.

The **connected component** that is created with the `connect` function:

```js
const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      tasks: state.tasks
    }
  }

  return {
    tasks: (state.filter  === 'IMPORTANT' 
    ? state.tasks.filter(task => task.important)
    : state.tasks.filter(task => !task.important)
    )
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks)
```

Fits the description of a **container** component.
According to the [description](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) provided by Dan Abramov, container components:

- Are concerned with how things work.
- May contain both presentational and container components inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Redux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher-order components such as connect from React Redux, rather than written by hand.

Dividing the application into presentational and container components is one way of structuring React applications that has been deemed beneficial.
The division may be a good design choice or it may not, it depends on the context.

Abramov attributes the following [benefits](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) to the division:

- Better separation of concerns.
You understand your app and your UI better by writing components this way.
- Better reusability.
You can use the same presentational component with completely different state sources,
and turn those into separate container components that can be further reused.
- Presentational components are essentially your app’s “palette”.
You can put them on a single page and let the designer tweak all their variations without touching the app’s logic.
You can run screenshot regression tests on that page.

Abramov mentions the term [higher-order component](https://reactjs.org/docs/higher-order-components.html).
The `Tasks` component is an example of a regular component, whereas the `connect` method provided by React-Redux is an example of a **high-order component**.
Essentially, a higher-order component is a function that accepts a "regular" component as its parameter, which then returns a new "regular" component as its return value.

Higher-order components, or HOCs, are a way of defining generic functionality that can be applied to components.
This is a concept from functional programming that very slightly resembles inheritance in object-oriented programming.

HOCs are a generalization of the [Higher-Order Function](https://en.wikipedia.org/wiki/Higher-order_function) (HOF) concept.
HOFs are functions that either accept functions as parameters or return functions.
We have been using HOFs throughout the course.
For instance, all of the methods used for dealing with arrays like `map`, `filter` and `find` are HOFs.

After the React hook API was published, HOCs have become less and less popular.
Almost all libraries which used to be based on HOCs have now been modified to use hooks.
Most of the time hook-based APIs are a lot simpler than HOC-based ones, as is the case with Redux as well.

### Redux and the component state

We have come a long way in this course and, finally, we have come to the point at which we are using React "the right way",
meaning React only focuses on generating the views,
and the application state is wholly separated from the React components and passed on to Redux, its actions, and its reducers.

What about the `useState` hook, which provides components with their own state?
Does it have any role if an application is using Redux or some other external state management solution?
If the application has more complicated forms, it may be beneficial to implement their local state using the state provided by the `useState` function.
One can, of course, have Redux manage the state of the forms.
However, if the state of the form is only relevant when filling the form (e.g. for validation)
it may be wise to leave the management of state to the component responsible for the form.

Should we always use Redux? Probably not.
Dan Abramov, the developer of Redux, discusses this in his article [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).

Nowadays it is possible to implement Redux-like state management without Redux by using the React [context](https://reactjs.org/docs/context.html) API
and the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook.
More about this [here](https://www.simplethread.com/cant-replace-redux-with-hooks/) and [here](https://hswolff.com/blog/how-to-usecontext-with-usereducer/).
We will also practice this in [part 8](/part8).

</div>

<div class="tasks">

### Exercises 6.19-6.21

#### 6.19 jokes and connect, step1

The *redux store* is currently being accessed by the components through the `useSelector` and `useDispatch` hooks.

Modify the `Notification` component so that it uses the `connect` function instead of the hooks.

#### 6.20 jokes and connect, step2

Do the same for the `Filter` and `JokeForm` components.

#### 6.21 jokes, the grand finale

You (probably) have one nasty bug in your application.
If the user clicks the vote button multiple times in a row, the notification is displayed funnily.
For example, if a user votes twice in three seconds,
the last notification is only displayed for two seconds (assuming the notification is normally shown for 5 seconds).
This happens because removing the first notification accidentally removes the second notification.

Fix the bug so that after multiple votes in a row, the notification for the last vote is displayed for five seconds.

The fix can be done by canceling the previous notification when a new notification is displayed, whenever necessary.
The [documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) for the setTimeout function might also be useful for this.

This was the last exercise for this part of the course and it's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
