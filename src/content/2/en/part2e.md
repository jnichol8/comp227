---
mainImage: ../../../images/part-2.svg
part: 2
letter: e
lang: en
---

<div class="content">

The appearance of our current application is quite modest.
In [exercise 0.2](/part0/fundamentals_of_web_apps#exercises-0-1-0-6),
the assignment was to go through Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

Before we move to the next part, let's take a look at how we can add styles to a React application.
There are several different ways of doing this and we will take a look at the other methods later on.
First, we will add CSS to our application the old-school way; in a single file without using a
[CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor)
(although this is not entirely true as we will learn later on).

Let's add a new *index.css* file under the *src* directory and then add it to the application by importing it in the *index.js* file:

```js
import './index.css'
```

Let's add the following CSS rule to the *index.css* file:

```css
h1 {
  color: green;
}
```

**Notice** when the content of the file *index.css* changes,
React might not notice that automatically, so you may need to refresh the browser to see your changes!

CSS rules comprise of **selectors** and **declarations**.
The selector defines which elements the rule should be applied to.
The selector above is `h1`, which will match all of the `h1` header tags in our application.

The declaration sets the `color` property to the value `green`.

One CSS rule can contain an arbitrary number of declarations.
Let's modify the previous rule to make the text cursive, by defining the font style as `italic`:

```css
h1 {
  color: navy;
  font-style: italic;  // highlight-line
}
```

There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

If we wanted to target, let's say, each one of the tasks with our styles,
we could use the selector `li`, as all of the tasks are wrapped inside `li` tags:

```js
const Task = ({ task, toggleImportance }) => {
  const label = task.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li>
      {task.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Let's add the following rule to our style sheet (relying on my non-existent knowledge of color theory and design):

```css
li {
  color: saddlebrown;
  padding-top: 3px;
  font-size: 18px;
}
```

Using element types for defining CSS rules is slightly problematic.
If our application contained other `li` tags, the same style rule would also be applied to them.

If we want to apply our style specifically to tasks,
then it is better to use [class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

In regular HTML, classes are defined as the value of the `class` attribute:

```html
<li class="task">some text...</li>
```

In React we have to use the [className](https://reactjs.org/docs/dom-elements.html#classname) attribute instead of the class attribute.
With this in mind, let's make the following changes to our `Task` component:

```js
const Task = ({ task, toggleImportance }) => {
  const label = task.important 
    ? 'make not important' 
    : 'make important';

  return (
    <li className='task'> // highlight-line
      {task.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Class selectors are defined with the `.classname` syntax:

```css
.task {
  color: saddlebrown;
  padding-top: 5px;
  font-size: 18px;
}
```

If you now add other `li` elements to the application, they will not be affected by the style rule above.

### Improved error message

We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted task with the `alert` method.
Let's implement the error message as its own React component.

The component is quite simple:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}
```

If the value of the `message` prop is `null`, then nothing is rendered to the screen,
and in other cases, the message gets rendered inside of a div element.

Let's add a new piece of state called `errorMessage` to the `App` component.
Let's initialize it with some error message so that we can immediately test our component:

```js
const App = () => {
  const [tasks, setTasks] = useState([]) 
  const [newTask, setNewTask] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...') // highlight-line

  // ...

  return (
    <div>
      <h1>Tasks</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      // ...
    </div>
  )
}
```

Then let's add a style rule that suits an error message:

```css
.error {
  color: red;
  background: antiquewhite;
  font-size: 22px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

Now we are ready to add the logic for displaying the error message.
Let's change the `toggleImportanceOf` function in the following way:

```js
  const toggleImportanceOf = id => {
    const task = tasks.find(t => t.id === id)
    const changedTask = { ...task, important: !task.important }

    taskService
      .update(id, changedTask).then(returnedTask => {
        setTasks(tasks.map(task => task.id !== id ? task : returnedTask))
      })
      .catch(error => {
        // highlight-start
        setErrorMessage(
          `Task '${task.content}' was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // highlight-end
        setTasks(tasks.filter(t => t.id !== id))
      })
  }
```

When the error occurs we add a descriptive error message to the `errorMessage` state.
At the same time, we start a timer, that will set the `errorMessage` state to `null` after five seconds.

The result looks like this:

![error removed from server screenshot from app](../../images/2/26e.png)

The code for the current state of our application can be found in the  *part2-7* branch on [GitHub](https://github.com/comp227/part2-tasks/tree/part2-7).

### Inline styles

React also makes it possible to write styles directly in the code as so-called [inline styles](https://react-cn.github.io/react/tips/inline-styles.html).

The idea behind defining inline styles is extremely simple.
Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://reactjs.org/docs/dom-elements.html#style) attribute.

CSS rules are defined slightly differently in JavaScript than in normal CSS files.
Let's say that we wanted to give some element the color green and italic font that's 16 pixels in size.
In CSS, it would look like this:

```css
{
  color: green;
  font-style: italic;
  font-size: 16px;
}
```

But as a React inline-style object it would look like this:

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Every CSS property is defined as a separate property of the JavaScript object.
Numeric values for pixels can be simply defined as integers.
One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.

Next, we could add a "bottom block" to our application by creating a `Footer` component and defining the following inline styles for it:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    marginTop: 30,
    paddingBottom: 15,
    backgroundColor: 'black',
    color: 'orange',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Task app, Department of Computer Science, University of the Pacific 2023</em>
    </div>
  )
}
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Tasks</h1>

      <Notification message={errorMessage} />

      // ...

      <Footer /> // highlight-line
    </div>
  )
}
```

Inline styles come with certain limitations.
For instance, so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can't be used straightforwardly.

Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions.
Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript).
According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.

The philosophy of React is, in fact, the polar opposite of this.
Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications,
React bases the division of the application along the lines of its logical functional entities.

The structural units that make up the application's functional entities are React components.
A React component defines the HTML for structuring the content,
the JavaScript functions for determining functionality, and also the component's styling; all in one place.
This is to create individual components that are as independent and reusable as possible.

The code of the final version of our application can be found in the *part2-8* branch on [GitHub](https://github.com/comp227/part2-tasks/tree/part2-8).

</div>

<div class="tasks">

### Exercises 2.19-2.20

#### 2.19: Communities step11

Use the [improved error message](/part2/adding_styles_to_react_app#improved-error-message)
example from part 2 as a guide to show a notification that lasts for a few seconds after a successful operation is executed (a group is added or a number is changed).
In these examples, use the gray and green colors.

![successful green added screenshot](../../images/2/27e.png)

#### 2.20*: Communities step12

Open your application in two browsers.
**If you delete a group in browser 1** a short while before attempting to ***change the group's URL*** in browser 2, you will get the following error message:

![error message 404 not found when changing multiple browsers](../../images/2/29b.png)

Fix the issue according to the example shown in [promise and errors](/part2/altering_data_in_server#promises-and-errors) in part 2.
Modify the example so that the user is shown a message when the operation does not succeed.
The messages shown for successful and unsuccessful events should look different:

![error message shown on screen instead of in console feature add-on](../../images/2/28e.png)

**Notice** that even if you handle the exception, the error message is printed to the console.

This was the last exercise of this part of the course.
It's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
