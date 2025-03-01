---
mainImage: ../../../images/part-1.svg
part: 1
letter: d
lang: en
---

<div class="content">

### Complex state

In our previous example, the application state was simple as it was comprised of a single integer.
What if our application requires a more complex state?

In most cases, the easiest and best way to accomplish this is by using the `useState` function multiple times to create separate "pieces" of state.

In the following code we create two pieces of state for the application named `left` and `right` that both get the initial value of 0:

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

The component gets access to the functions `setLeft` and `setRight` that it can use to update the two pieces of state.

The component's state or a piece of its state can be of any type.
We could implement the same functionality by saving the click count of both the `left` and `right` buttons into a single object:

```js
{
  left: 0,
  right: 0
}
```

In this case, the application would look like this:

```js
const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

Now the component only has a single piece of state and the event handlers have to take care of changing the **entire application state**.

The event handler looks a bit messy.
When the left button is clicked, the following function is called:

```js
const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
```

The following object is set as the new state of the application:

```js
{
  left: clicks.left + 1,
  right: clicks.right
}
```

The new value of the `left` property is now the same as the value of `left + 1` from the previous state,
and the value of the `right` property is the same as the value of the `right` property from the previous state.

We can define the new state object a bit more neatly by using the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
syntax that was added to the language specification in the summer of 2018:

```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}
```

The syntax may seem a bit strange at first.
In practice `{ ...clicks }` creates a new object that has copies of all of the properties of the `clicks` object.
When we specify a particular property - e.g. `right` in `{ ...clicks, right: 1 }`, the value of the `right` property in the new object will be 1.

In the example above, this:

```js
{ ...clicks, right: clicks.right + 1 }
```

creates a copy of the `clicks` object where the value of the `right` property is increased by one.

Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:

```js
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

Some readers might be wondering why we didn't just update the state directly, like this:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

The application appears to work.
However, **it is forbidden in React to mutate state directly**, since [it can result in unexpected side effects](https://stackoverflow.com/a/40309023).
Changing state has to always be done by setting the state to a new object.
If properties from the previous state object are not changed, they need to simply be copied,
which is done by copying those properties into a new object and setting that as the new state.

Storing all of the state in a single state object is a bad choice for this particular application;
there's no apparent benefit and the resulting application is a lot more complex.
In this case, storing the click counters into separate pieces of state is a far more suitable choice.

There are situations where it can be beneficial to store a piece of application state in a more complex data structure.
[The official React documentation](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) contains some helpful guidance on the topic.

### Handling arrays

Let's add a piece of state to our application containing an array `allClicks` that remembers every click that has occurred in the application.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([]) // highlight-line

// highlight-start
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }
// highlight-end  

// highlight-start
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }
// highlight-end  

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

Every click is stored in a separate piece of state called `allClicks` that is initialized as an empty array:

```js
const [allClicks, setAll] = useState([])
```

When the `left` button is clicked, we add the letter `L` to the `allClicks` array:

```js
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}
```

The piece of state stored in `allClicks` is now set to be an array that contains all of the items of the previous state array plus the letter `L`.
Adding the new item to the array is accomplished with the [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method,
which does not mutate the existing array but rather returns a **new copy of the array** with the item added to it.

As mentioned previously, it's also possible in JavaScript to add items to an array with the
[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) method.
If we add the item by pushing it to the `allClicks` array and then updating the state, the application would still appear to work:

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

However, **don't** do this.
As mentioned previously, the state of React components like `allClicks` must not be mutated directly.
Even if mutating state appears to work in some cases, *it can lead to problems that are very hard to debug*.

Let's take a closer look at how the clicking
is rendered to the page:

```js
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p> // highlight-line
    </div>
  )
}
```

We call the [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method
on the `allClicks` array that joins all the items into a single string,
separated by the string passed as the function parameter, which in our case is an empty space.

### Conditional rendering

Let's modify our application so that the rendering of the clicking history is handled by a new `History` component:

```js
// highlight-start
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} /> // highlight-line
    </div>
  )
}
```

Now the behavior of the component depends on whether or not any buttons have been clicked.
If not, meaning that the `allClicks` array is empty, the component renders a div element with some instructions instead:

```js
<div>the app is used by pressing the buttons</div>
```

And in all other cases, the component renders the clicking history:

```js
<div>
  button press history: {props.allClicks.join(' ')}
</div>
```

The `History` component renders completely different React elements depending on the state of the application.
This is called **conditional rendering**.

React also offers many other ways of doing [conditional rendering](https://reactjs.org/docs/conditional-rendering.html).
We will take a closer look at this in [part 2](/part2).

Let's make one last modification to our application by refactoring it to use the `Button` component that we defined earlier on:

```js
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// highlight-start
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
// highlight-end

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      // highlight-start
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      // highlight-end
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
```

### Old React

In this course, we use the [state hook](https://reactjs.org/docs/hooks-state.html) to add state to our React components,
which is part of the newer versions of React and is available from version [16.8.0](https://www.npmjs.com/package/react/v/16.8.0) onwards.
Before the addition of hooks, there was no way to add state to functional components.
Components that required state had to be defined as [class](https://reactjs.org/docs/react-component.html) components, using the JavaScript class syntax.

In this course, we have made the slightly radical decision to use hooks exclusively from day one,
to ensure that we are learning the current and future variations of React.
Even though functional components are the future of React, it is still important to learn the class syntax,
as there are billions of lines of legacy React code that you might end up maintaining someday.
The same applies to documentation and examples of React that you may stumble across on the internet.

We will learn more about React class components later on in the course.

### Debugging React applications

A large part of a typical developer's time is spent on debugging and reading existing code.
Every now and then we do get to write a line or two of new code,
but a large part of our time is spent trying to figure out why something is broken or how something works.
Good practices and tools for debugging are extremely important for this reason.

Lucky for us, React is an extremely developer-friendly library when it comes to debugging.

Before we move on, let us remind ourselves of one of the most important rules of web development.

#### The first rule of web development

> **Keep the browser's developer console open at all times.**
>
> The `Console` tab in particular should always be open, unless there is a specific reason to view another tab.

Keep both your code and the web page open together **at the same time, all the time**.

If and when your code fails to compile and your browser lights up like a Christmas tree:

![screenshot of code](../../images/1/6x.png)

don't write more code but rather find and fix the problem **immediately**.
There has yet to be a moment in the history of coding where code that fails to compile would miraculously start working after writing large amounts of additional code.
I highly doubt that such an event will transpire during this course either.

Old-school, print-based debugging is always a good idea.
If the component

```js
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)
```

is not working as intended, it's useful to start printing its variables out to the console.
To do this effectively, we must transform our function into the less compact form
and receive the entire props object without destructuring it immediately:

```js
const Button = (props) => { 
  console.log(props) // highlight-line
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
```

This will immediately reveal if, for instance, one of the attributes has been misspelled when using the component.

**NB** When you use `console.log` for debugging, **don't combine objects** in a Java-like fashion by using the plus operator.
Instead of writing:

```js
console.log('props value is ' + props)
```

Separate the things you want to log to the console with a comma:

```js
console.log('props value is', props)
```

If you use the Java-like way of concatenating a string with an object, you will end up with a rather uninformative log message:

```js
props value is [object Object]
```

Whereas the items separated by a comma will all be available in the browser console for further inspection.

Logging output to the console is by no means the only way of debugging our applications.
You can pause the execution of your application code in the Chrome developer console's *debugger*,
by writing the command [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) anywhere in your code.

The execution will pause once it arrives at a point where the ***debugger*** command gets executed:

![debugger paused in dev tools](../../images/1/7a.png)

By going to the *Console* tab, it is easy to inspect the current state of variables:

![console inspection screenshot](../../images/1/8a.png)

Once the cause of the bug is discovered you can remove the ***debugger*** command and refresh the page.

The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the ***Sources*** tab.

You can also access the debugger without the ***debugger*** command by adding breakpoints in the ***Sources*** tab.
Inspecting the values of the component's variables can be done in the ***Scope*** section:

![breakpoint example in devtools](../../images/1/9a.png)

It is highly recommended to add the [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension to Chrome.
It adds a new ***Components*** tab to the developer tools.
The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props:

![screenshot react developer tools extension](../../images/1/10ea.png)

The `App` component's state is defined like so:

```js
const [left, setLeft] = useState(0)
const [right, setRight] = useState(0)
const [allClicks, setAll] = useState([])
```

Dev tools show the state of hooks in the order of their definition:

![state of hooks in react dev tools](../../images/1/11ea.png)

The first *State* contains the value of the `left` state,
the next contains the value of the `right` state and the last contains the value of the `allClicks` state.

### Rules of Hooks

There are a few limitations and rules we have to follow to ensure that our application uses hooks-based state functions correctly.

The `useState` function (as well as the `useEffect` function introduced later on in the course) **must not be called** from inside of a loop,
a conditional expression, or any place that is not a function defining a component.
This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

To recap, hooks may only be called from the inside of a function body that defines a React component:

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('CW Longbottom')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

### Event Handling Revisited

Event handling is tricky, so we will revisit the topic.

Let's assume that we're developing this simple application with the following component `App`:

```js
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

We want the clicking of the button to reset the state stored in the `value` variable.

In order to make the button react to a click event, we have to add an **event handler** to it.

Event handlers must always be a function or a reference to a function.
The button will not work if the event handler is set to a variable of any other type.

If we were to define the event handler as a string:

```js
<button onClick="crap...">button</button>
```

React would warn us about this in the console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `string` type.
    in button (at index.js:20)
    in div (at index.js:18)
    in App (at index.js:27)
```

The following attempt would also not work:

```js
<button onClick={value + 1}>button</button>
```

We have attempted to set the event handler to `value + 1` which simply returns the result of the operation.
React will kindly warn us about this in the console:

```js
index.js:2178 Warning: Expected `onClick` listener to be a function, instead got a value of `number` type.
```

This attempt would not work either:

```js
<button onClick={value = 0}>button</button>
```

The event handler is not a function but a variable assignment, and React will once again issue a warning to the console.
This attempt is also flawed in the sense that we must never mutate state directly in React.

What about the following:

```js
<button onClick={console.log('clicked the button')}>
  button
</button>
```

The message gets printed to the console once when the component is rendered but nothing happens when we click the button.
Why does this not work even when our event handler contains a function `console.log`?

The issue here is that our event handler is defined as a *function call*
which means that the event handler is assigned the returned value from the function, which in the case of `console.log` is `undefined`.

The `console.log` function call gets executed when the component is rendered and for this reason, it gets printed once to the console.

The following attempt is flawed as well:

```js
<button onClick={setValue(0)}>button</button>
```

We have once again tried to set a function call as the event handler.
This does not work.
This particular attempt also causes another problem.
When the component is rendered the function `setValue(0)` gets executed which in turn causes the component to be re-rendered.
Re-rendering in turn calls `setValue(0)` again, resulting in an infinite recursion.

Executing a particular function call when the button is clicked can be accomplished like this:

```js
<button onClick={() => console.log('clicked the button')}>
  button
</button>
```

Now the event handler is a function defined with the arrow function syntax *() => console.log('clicked the button')*.
When the component gets rendered, no function gets called and only the reference to the arrow function is set to the event handler.
Calling the function happens only once the button is clicked.

We can implement resetting the state in our application with this same technique:

```js
<button onClick={() => setValue(0)}>button</button>
```

The event handler is now the function *() => setValue(0)*.

Defining event handlers directly in the attribute of the button is not necessarily the best possible idea.

You will often see event handlers defined in a separate place.
In the following version of our application we define a function that then gets assigned to the `handleClick` variable in the body of the component function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () =>
    console.log('clicked the button')

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

The `handleClick` variable is now assigned to a reference to the function.
The reference is passed to the button as the `onClick` attribute:

```js
<button onClick={handleClick}>button</button>
```

Naturally, our event handler function can be composed of multiple commands.
In these cases we use the longer curly brace syntax for arrow functions:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
   // highlight-end

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

### A function that returns a function

Another way to define an event handler is to use a **function that returns a function**.

You probably won't need to use functions that return functions in any of the exercises in this course.
If the topic seems particularly confusing, you may skip over this section for now and return to it later.

Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = () => {
    const handler = () => console.log('hello comp227')

    return handler
  }
  // highlight-end

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

The code functions correctly even though it looks complicated.

The event handler is now set to a function call:

```js
<button onClick={hello()}>button</button>
```

Earlier on we stated that an event handler may not be a call to a function and that it has to be a function or a reference to a function.
Why then does a function call work in this case?

When the component is rendered, the following function gets executed:

```js
const hello = () => {
  const handler = () => console.log('hello comp227')

  return handler
}
```

The *return value* of the function is another function that is assigned to the `handler` variable.

When React renders the line:

```js
<button onClick={hello()}>button</button>
```

It assigns the return value of `hello()` to the `onClick` attribute.
Essentially the line gets transformed into:

```js
<button onClick={() => console.log('hello comp227')}>
  button
</button>
```

Since the `hello` function returns a function, the event handler is now a function.

What's the point of this concept?

Let's change the code a tiny bit:

```js
const App = () => {
  const [value, setValue] = useState(10)

  // highlight-start
  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }

    return handler
  }
  // highlight-end  

  return (
    <div>
      {value}
  // highlight-start      
      <button onClick={hello('comp227')}>button</button>
      <button onClick={hello('you')}>button</button>
      <button onClick={hello('function')}>button</button>
  // highlight-end      
    </div>
  )
}
```

Now the application has three buttons with event handlers defined by the `hello` function that accepts a parameter.

The first button is defined as

```js
<button onClick={hello('comp227')}>button</button>
```

The event handler is created by *executing* the function call `hello('comp227')`.
The function call returns the function:

```js
() => {
  console.log('hello', 'comp227')
}
```

The second button is defined as:

```js
<button onClick={hello('you')}>button</button>
```

The function call `hello('you')` that creates the event handler returns:

```js
() => {
  console.log('hello', 'you')
}
```

Both buttons get their individualized event handlers.

Functions returning functions can be utilized in defining generic functionality that can be customized with parameters.
The `hello` function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

Our current definition is slightly verbose:

```js
const hello = (who) => {
  const handler = () => {
    console.log('hello', who)
  }

  return handler
}
```

Let's eliminate the helper variables and directly return the created function:

```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```

Since our `hello` function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:

```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```

Lastly, let's write all of the arrows on the same line:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

We can use the same trick to define event handlers that set the state of the component to a given value.
Let's make the following changes to our code:

```js
const App = () => {
  const [value, setValue] = useState(10)
  
  // highlight-start
  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }
  // highlight-end
  
  return (
    <div>
      {value}
      // highlight-start
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
      // highlight-end
    </div>
  )
}
```

When the component is rendered, the ***thousand*** button is created:

```js
<button onClick={setToValue(1000)}>thousand</button>
```

The event handler is set to the return value of `setToValue(1000)` which is the following function:

```js
() => {
  console.log('value now', 1000)
  setValue(1000)
}
```

The increase button is declared as follows:

```js
<button onClick={setToValue(value + 1)}>increment</button>
```

The event handler is created by the function call `setToValue(value + 1)`
which receives as its parameter the current value of the state variable `value` increased by one.
If the value of `value` was 10, then the created event handler would be the function:

```js
() => {
  console.log('value now', 11)
  setValue(11)
}
```

Using functions that return functions is not required to achieve this functionality.
Let's return the `setToValue` function which is responsible for updating state into a normal function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```

We can now define the event handler as a function that calls the `setToValue` function with an appropriate parameter.
The event handler for resetting the application state would be:

```js
<button onClick={() => setToValue(0)}>reset</button>
```

Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.

### Passing Event Handlers to Child Components

Let's extract the button into its own component:

```js
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
```

The component gets the event handler function from the `handleClick` prop, and the text of the button from the `text` prop.

Using the `Button` component is simple, although we have to make sure that we use the correct attribute names when passing props to the component.

![using correct attribute names code screenshot](../../images/1/12e.png)

### Do Not Define Components Within Components

Let's start displaying the value of the application in its `Display` component.

We will change the application by defining a new component inside of the `App` component.

```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component
  const Display = props => <div>{props.value}</div> // highlight-line

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

The application still appears to work, but **don't implement components like this!** Never define components inside of other components.
The method provides no benefits and leads to many unpleasant problems.
The biggest problems are because React treats a component defined inside of another component as a new component in every render.
This makes it impossible for React to optimize the component.

Let's instead move the `Display` component function to its correct place, which is outside of the `App` component function:

```js
const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

### Useful Reading

The internet is full of React-related material.
However, we use the new style of React for which a large majority of the material found online is outdated.

You may find the following links useful:

- The [official React documentation](https://reactjs.org/docs/hello-world.html) is worth checking out at some point,
- although most of it will become relevant only later on in the course.
Also, everything related to class-based components is irrelevant to us;
- Some courses on [Egghead.io](https://egghead.io) like [Start learning React](https://egghead.io/courses/start-learning-react) are of high quality,
  and the recently updated [Beginner's Guide to React](https://egghead.io/courses/the-beginner-s-guide-to-reactjs) is also relatively good;
  both courses introduce concepts that will also be introduced later on in this course.
**NB** The first one uses class components but the latter uses the new functional ones.

</div>

<div class="tasks">

### Exercises 1.6-1.14

Submit your solutions to the exercises by first pushing your code to GitHub and then marking the completed exercises in Canvas.

Once you have marked your submission as complete, **you cannot submit more exercises**.

*Some of the exercises work on the same application.
In these cases, it is sufficient to submit just the final version of the application,
but you will need to commit regularly, it should often be at least 4 or 5 times while working on a particular exercise*

**WARNING** ensure you are at the base folder of the correct repository when using `create-react-app` to create the studytracker and jokes apps/directories.

In some situations you may also have to run the command below from the root of the project:

```bash
rm -rf node_modules/ && npm i
```

#### 1.6: studytracker step1

Let's figure out a way to devise a web application that helps track your self-reported feelings on whether or not you had a good study day.
There are only three options: ***yeah***, ***kinda***, and ***nah***.

The application must display the total number of collected samples for each response.
Your final application could look like this:

![screenshot of study day options](../../images/1/13e.png)

Notice that your application needs to work only during a single browser session.
Once you refresh the page, the collected data is allowed to disappear.

It is advisable to use the same structure that is used in the material and previous exercise.
File *index.js* is as follows:

```js
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```negative

You can use the code below as a starting point for the *App.js* file:

```js
import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [yeah, setYeah] = useState(0)
  const [kinda, setKinda] = useState(0)
  const [nah, setNah] = useState(0)

  return (
    <div>
      code here
    </div>
  )
}

export default App
```

#### 1.7: studytracker step2

Expand your application so that it shows more statistics about the gathered data.
The application should show:

- the total number of days recorded,
- the average score using this scoring system - (nah: -1, kinda: 0, yeah: 1)
- the percentage of days that the use clicked yeah.

![average and percentage good screenshot feedback](../../images/1/14e.png)

#### 1.8: studytracker step3

Refactor your application so that displaying the statistics is extracted into its own `Statistics` component.
The state of the application should remain in the `App` root component.

Remember that components should not be defined inside other components:

```js
// a proper place to define a component
const Statistics = (props) => {
  // ...
}

const App = () => {
  const [yeah, setYeah] = useState(0)
  const [kinda, setKinda] = useState(0)
  const [nah, setNah] = useState(0)

  // do not define a component within another component
  const Statistics = (props) => {
    // ...
  }

  return (
    // ...
  )
}
```

#### 1.9: studytracker step4

Change your application to display the statistics only once a response has been gathered.

![no answers recorded yet text screenshot](../../images/1/15e.png)

#### 1.10: studytracker step5

Let's continue refactoring the application.
Extract the following two components:

- `Button` for defining the buttons used for submitting mood
- `StatisticLine` for displaying a single statistic, e.g. the average score.

To be clear: the `StatisticLine` component always displays a single statistic,
meaning that the application uses multiple components for rendering all of the statistics:

```js
const Statistics = (props) => {
  /// ...
  return(
    <div>
      <StatisticLine text="yeah" value ={...} />
      <StatisticLine text="kinda" value ={...} />
      <StatisticLine text="nah" value ={...} />
      // ...
    </div>
  )
}

```

The application's state should still be kept in the root `App` component.

#### 1.11*: studytracker step6

Display the statistics in an HTML [table](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics),
so that your application looks roughly like this:

![screenshot of statistics table](../../images/1/16e.png)

Remember to keep your console open at all times.
If you see this warning in your console:

![console warning](../../images/1/17a.png)

Then perform the necessary actions to make the warning disappear.
Try pasting the error message into a search engine if you get stuck.

*Typical source of an error `Unchecked runtime.lastError: Could not establish connection.
Receiving end does not exist.` is Chrome extension.
Try going to `chrome://extensions/` and try disabling them one by one and refreshing React app page; the error should eventually disappear.*

**Make sure that from now on you don't see any warnings in your console!**

#### 1.12*: jokes step1

The world of software engineering is filled with [bad jokes](https://www.devtopics.com/best-programming-jokes/).

Expand the following application by adding a button that can be clicked to display a *random* joke from the field of software engineering:

```js
import { useState } from 'react'

const App = () => {
  const jokes = [
    'How many programmers does it take to change a light bulb? None - That is a hardware problem',
    'All programmers are playwrights, and all computers are lousy actors.',
    'The generation of random numbers is too important to be left to chance.',
    'I just saw my life flash before my eyes and all I could see was a close tag',
    'The computer is mightier than the pen, the sword, and usually, the programmer.',
    'A programmer had a problem. He thought to himself, "I know, I’ll solve it with threads!" has Now problems. two he',
    '!false is funny because it is true'
  ]
   
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {jokes[selected]}
    </div>
  )
}

export default App
```

The content of the file *index.js* is the same as in previous exercises.

Find out how to generate random numbers in JavaScript, eg.
via a search engine or on [Mozilla Developer Network](https://developer.mozilla.org).
Remember that you can test generating random numbers e.g. straight in the console of your browser.

Your finished application could look something like this:

![random joke with next button](../../images/1/18a.png)

**WARNING** Make sure that when you call create-react-app that you are inside of your repo's base folder - not inside of your other folders (like *reading*!)!

#### 1.13*: jokes step2

Expand your application so that you can vote for the displayed joke.

![joke app with votes button added](../../images/1/19a.png)

**NB** store the votes of each joke into an array or object in the component's state.
Remember that the correct way of updating state stored in complex data structures like objects and arrays is to make a copy of the state.

You can create a copy of an object like this:

```js
const points = { 0: 1, 1: 3, 2: 4, 3: 2 }

const copy = { ...points }
// increment the property 2 value by one
copy[2] += 1     
```

OR a copy of an array like this:

```js
const points = [1, 4, 6, 3]

const copy = [...points]
// increment the value in position 2 by one
copy[2] += 1     
```

Using an array might be the simpler choice in this case.
Searching the Internet will provide you with lots of hints on how to [create a zero-filled array of the desired length](https://stackoverflow.com/questions/20222501/how-to-create-a-zero-filled-javascript-array-of-arbitrary-length/22209781).

#### 1.14*: jokes step3

Now implement the final version of the application that displays the joke with the largest number of votes:

![joke with largest number of votes](../../images/1/20a.png)

If multiple jokes are tied for first place it is sufficient to just show one of them.

This was the last exercise for this part of the course and it's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
