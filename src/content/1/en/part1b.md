---
mainImage: ../../../images/part-1.svg
part: 1
letter: b
lang: en
---

<div class="content">

During the course, we have a goal and a need to learn a sufficient amount of JavaScript in addition to web development.

JavaScript has advanced rapidly in the last few years and in this course, we use features from the newer versions.
The official name of the JavaScript standard is [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript).
At this moment, the latest version is the one released in June of 2022 with the name
[ECMAScript®2022](https://www.ecma-international.org/ecma-262/), otherwise known as ES13.

Browsers do not yet support all of JavaScript's newest features.
Due to this fact, a lot of code run in browsers has been *transpiled* from a newer version of JavaScript to an older, more compatible version.

Today, the most popular way to transpile is via [Babel](https://babeljs.io/).
Transpilation is automatically configured in React applications created with create-react-app.
We will take a closer look at transpilation in [part 7](/part7) of this course.

[Node.js](https://nodejs.org/en/) is a JavaScript runtime environment based on Google's [Chrome V8](https://developers.google.com/v8/)
JavaScript engine and works practically anywhere - from servers to mobile phones.
Let's practice writing some JavaScript using Node.
It is expected that the version of Node.js installed on your machine is at least version *16.13.0*.
The latest versions of Node already understand the latest versions of JavaScript, so the code does not need to be transpiled.

The code is written into files ending with *.js* that are run by issuing the command `node name_of_file.js`

It is also possible to write JavaScript code into the Node.js console,
which is opened by typing `node` in the command line, as well as into the browser's developer tool console.
[The newest revisions of Chrome handle the newer features of JavaScript pretty well](http://kangax.github.io/compat-table/es2016plus/) without transpiling the code.
Alternatively, you can use a tool like [JS Bin](https://jsbin.com/?js,console).

JavaScript is sort of reminiscent, both in name and syntax, to Java.
But when it comes to the core mechanism of the language they could not be more different.
Coming from a Java background, the behavior of JavaScript can seem a bit alien, especially if one does not make the effort to look up its features.

In certain circles, it has also been popular to attempt "simulating" Java features and design patterns in JavaScript.
We do not recommend doing this as the languages and their ecosystems are ultimately very different.

### Variables

In JavaScript there are a few ways to go about defining variables:

```js
const x = 1
let y = 5

console.log(x, y)   // 1, 5 are printed
y += 10
console.log(x, y)   // 1, 15 are printed
y = 'sometext'
console.log(x, y)   // 1, sometext are printed
x = 4               // causes an error
```

[const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
does not define a variable but a **constant** for which the value can no longer be changed.
On the other hand, [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) defines a normal variable.

In the example above, we also see that the variable's data type can change during execution.
At the start, `y` stores an integer; at the end, it stores a string.

It is also possible to define variables in JavaScript using the keyword [var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var).
var was, for a long time, the only way to define variables.
`const` and `let` were only recently added in version ES6.
In specific situations, var works differently compared to variable definitions in most languages - see
[JavaScript Variables - Should You Use let, var or const? on Medium](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) or
[Keyword: var vs let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) for more information.
During this course, ***you should only use const and let***!
Avoid var as if it tested positive for COVID.
You can find more on this topic on YouTube - e.g. [var, let and const - ES6 JavaScript Features](https://youtu.be/sjyJBL5fkp8)

![let const meme](../../images/1/custom/let_const_meme.png)

### Arrays

An [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and a couple of examples of its use:

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
})                    
```

Notable in this example is the fact that the contents of the array can be modified even though it is defined as a `const`.
Because the array is an object, the variable always points to the same object.
However, the content of the array changes as new items are added to it.

One way of iterating through the items of the array is using `forEach` as seen in the example.
ForEach receives a **function** defined using the arrow syntax as a parameter.

```js
value => {
  console.log(value)
}
```

ForEach calls the function *for each of the items in the array*, always passing the individual item as an argument.
The function as the argument of `forEach` may also receive [other arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

In the previous example, a new item was added to the array using the method [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push).
When using React, techniques from functional programming are often used.
One characteristic of the functional programming paradigm is the use of [immutable](https://en.wikipedia.org/wiki/Immutable_object) data structures.
In React code, it is preferable to use the method [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat),
which does not add the item to the array but creates a new array in which the content of the old array and the new item are both included.

```js
const t = [1, -1, 3]

const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```

The method call *t.concat(5)* does not add a new item to the old array but returns a new array which,
besides containing the items of the old array, also contains the new item.

There are plenty of useful methods defined for arrays.
Let's look at a short example of using the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed
```

Based on the old array, `map` creates a ***new array***, for which the function given as a parameter is used to create the items.
In the case of this example, the original value is multiplied by two.

Map can also transform the array into something completely different:

```js
const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```

Here an array filled with integer values is transformed into an array containing strings of HTML using the map method.
In [part 2](/part2) of this course, we will see that map is used quite frequently in React.

Individual items of an array are easy to assign to variables with the help of the
[destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4, 5] is printed
```

Thanks to the assignment, the variables `first` and `second` will receive the first two integers of the array as their values.
The remaining integers are "collected" into an array of their own which is then assigned to the variable `rest`.

### Objects

There are a few different ways of defining objects in JavaScript.
One very common method is using [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals),
which happens by listing its properties within braces:

```js
const object1 = {
  name: 'Powercat',
  age: 23,
  education: 'BS',
}

const object2 = {
  name: 'COMP 227',
  level: 'graduate',
  units: 3,
}

const object3 = {
  name: {
    first: 'Randy',
    last: 'Lau',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}
```

The values of the properties can be of any type, like integers, strings, arrays, objects...

The properties of an object are referenced by using the "dot" notation, or by using brackets:

```js
console.log(object1.name)         // Powercat is printed
const fieldName = 'age' 
console.log(object1[fieldName])    // 23 is printed
```

You can also add properties to an object on the fly by either using dot notation or brackets:

```js
object1.address = 'University of the Pacific'
object1['student id'] = 989123456
```

The latter of the additions has to be done by using brackets because when using dot notation,
`student id` is not a valid property name because of the space character.

Naturally, objects in JavaScript can also have methods.
However, during this course, we do not need to define any objects with methods of their own.
This is why they are only discussed briefly during the course.

Objects can also be defined using so-called constructor functions, which results in a mechanism reminiscent of many other programming languages, e.g. Java's classes.
Despite this similarity, JavaScript does not have classes in the same sense as object-oriented programming languages.
There has been, however, an addition of the *class syntax* starting from version ES6, which in some cases helps structure object-oriented classes.

### Functions

We have already become familiar with defining arrow functions.
The complete process, without cutting corners, of defining an arrow function is as follows:

```js
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}
```

and the function is called as can be expected:

```js
const result = sum(1, 5)
console.log(result)
```

If there is just a single parameter, we can exclude the parentheses from the definition:

```js
const square = p => {
  console.log(p)
  return p * p
}
```

If the function only contains a single expression then the braces are not needed.
In this case, the function only returns the result of its only expression.
Now, if we remove console printing, we can further shorten the function definition:

```js
const square = p => p * p
```

This form is particularly handy when manipulating arrays - e.g. when using the map method:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p)
// tSquared is now [1, 4, 9]
```

The arrow function feature was added to JavaScript only a couple of years ago, with version [ES6](http://es6-features.org/).
Before this, the only way to define functions was by using the keyword `function`.

There are two ways to reference the function via the old way.

|[function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)|[function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)|
| :--- | :--- |
|<pre>function subtract(a, b) {<br/>  return a - b<br/>}<br/><br/>const result = subtract(6, 2)<br>// result is now 4|<pre>const subtract = function(a, b) {<br/>  return a - b<br/>}<br/><br/>const result = subtract(6, 2)<br>// result is now 4|

In the function expression case, there is no need to give the function a name and the definition may reside among the rest of the code:

During this course, we will define all functions using the arrow syntax, which means that the above function would be:

```js
const product = (a, b) => {
    return a * b
}

const result = product(2, 6)
```

</div>

<div class="tasks">

### Exercises 1.3-1.5

*We continue building the application that we started working on in the previous exercises.
You can write the code into the same project since you have been committing your changes from the previous exercises.*

**Pro-tip:** you may run into issues when it comes to the structure of the `props` that components receive.
A good way to make things more clear is by printing the props to the console, e.g. as follows:

```js
const Header = (props) => {
  console.log(props) // highlight-line
  return <h1>{props.course}</h1>
}
```

#### 1.3: handheld arcade info step3

Let's move forward to using objects in our application.
Modify the variable definitions of the `App` component as follows and also refactor the application so that it still works:

```js
const App = () => {
  const company = 'Nintendo'
  const handheld1 = {
    name: 'Game Boy',
    games: 1046
  }
  const handheld2 = {
    name: 'Game Boy Advance',
    games: 1538
  }
  const handheld3 = {
    name: 'DS',
    games: 1791
  }

  return (
    <div>
      ...
    </div>
  )
}
```

#### 1.4: handheld arcade info step4

And then place the objects into an array.
Modify the variable definitions of `App` into the following form and modify the other parts of the application accordingly:

```js
const App = () => {
  const company = 'Nintendo'
  const handhelds = [
    {
      name: 'Game Boy',
      games: 1046
    },
    {
      name: 'Game Boy Advance',
      games: 1538
    },
    {
      name: 'DS',
      games: 1791
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```

**NB** at this point *you can assume that there are always three items*, so there is no need to go through the arrays using loops.
We will come back to the topic of rendering components based on items in arrays with a more thorough exploration in the [next part of the course](/part2).

However, do not pass different objects as separate props from the `App` component to the components `Content` and `Total`.
Instead, pass them directly as an array:

```js
const App = () => {
  // const definitions

  return (
    <div>
      <Header company={company} />
      <Content handhelds={handhelds} />
      <Total handhelds={handhelds} />
    </div>
  )
}
```

#### 1.5: handheld arcade info step5

Let's take the changes one step further.
Change the company and its handhelds into a single JavaScript object.
Fix everything that breaks.

```js
const App = () => {
  const company = {
    name: 'Nintendo',
    handhelds: [
      {
        name: 'Game Boy',
        games: 1046
      },
      {
        name: 'Game Boy Advance',
        games: 1538
      },
      {
        name: 'DS',
        games: 1791
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

</div>

<div class="content">

### Object methods and "this"

Because this course uses a version of React containing React Hooks we do not need to define objects with methods.
**The contents of this chapter are not relevant to the course** but are certainly in many ways good to know.
In particular, when using older versions of React one must understand the topics of this chapter.

Arrow functions and functions defined using the `function` keyword vary substantially when it comes to how they behave with respect to the keyword
[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this),
which refers to the object itself.

We can assign methods to an object by defining properties that are functions:

```js
const mascot = {
  name: 'Powercat',
  age: 23,
  education: 'BS',
  // highlight-start
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-end
}

mascot.greet()  // "hello, my name is Powercat" gets printed
```

Methods can be assigned to objects even after the creation of the object:

```js
const mascot ={
  name: 'Powercat',
  age: 23,
  education: 'BS',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

// highlight-start
mascot.growOlder = function() {
  this.age += 1
}
// highlight-end

console.log(mascot.age)   // 23 is printed
mascot.growOlder()
console.log(mascot.age)   // 36 is printed
```

Let's slightly modify the object:

```js
const mascot ={
  name: 'Powercat',
  age: 23,
  education: 'BS',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
  // highlight-start
  doAddition: function(a, b) {
    console.log(a + b)
  },
  // highlight-end
}

mascot.doAddition(1, 4)        // 5 is printed

const referenceToAddition = mascot.doAddition
referenceToAddition(10, 15)   // 25 is printed
```

Now the object has the method `doAddition` which calculates the sum of numbers given to it as parameters.
The method is called in the usual way, using the object `mascot.doAddition(1, 4)`
or by storing a **method reference** in a variable and calling the method through the variable:
`referenceToAddition(10, 15)`.

If we try to do the same with the method `greet` we run into an issue:

```js
mascot.greet()       // "hello, my name is Powercat" gets printed

const referenceToGreet = mascot.greet
referenceToGreet() // prints "hello, my name is undefined"
```

When calling the method through a reference, the method loses knowledge of what the original `this` was.
Contrary to other languages, in JavaScript the value of
[this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
is defined based on *how the method is called*.
When calling the method through a reference the value of `this` becomes the so-called [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object)
and the end result is often not what the software developer had originally intended.

Losing track of `this` when writing JavaScript code brings forth a few potential issues.
Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser)
needs to call some method in an object that the developer has defined.
However, in this course, we avoid these issues by using "this-less" JavaScript.

One situation leading to the "disappearance" of `this` arises when we set a timeout to call the `greet` function on the `mascot` object,
using the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) function.

```js
const mascot ={
  name: 'Powercat',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

setTimeout(mascot.greet, 1000)  // highlight-line
```

As mentioned, the value of `this` in JavaScript is defined based on how the method is being called.
When `setTimeout` is calling the method, it is the JavaScript engine that actually calls the method and, at that point, `this` refers to the global object.

There are several mechanisms by which the original `this` can be preserved.
One of these is using a method called [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind):

```js
setTimeout(mascot.greet.bind(mascot), 1000)
```

Calling `mascot.greet.bind(mascot)` creates a new function where `this` is bound to point to Arto, independent of where and how the method is being called.

Using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) it is possible to solve some of the problems related to `this`.
They should not, however, be used as methods for objects because then `this` does not work at all.
We will come back later to the behavior of `this` in relation to arrow functions.

If you want to gain a better understanding of how `this` works in JavaScript,
the Internet is full of material about the topic,
e.g. the screencast series [Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth)
by [egghead.io](https://egghead.io) is highly recommended!

### Classes

As mentioned previously, there is no class mechanism in JavaScript like the ones in object-oriented programming languages.
There are, however, features to make "simulating" object-oriented [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) possible.

Let's take a quick look at the **class syntax** that was introduced into JavaScript with ES6,
which substantially simplifies the definition of classes (or class-like things) in JavaScript.

In the following example we define a "class" called Person and two Person objects:

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const inigo = new Person('Inigo Montoya', 31)
inigo.greet()

const osvaldo = new Person('Too Hard to Pronounce', 51)
osvaldo.greet()
```

When it comes to syntax, the classes and the objects created from them are very reminiscent of Java classes and objects.
Their behavior is also quite similar to Java objects.
At the core, they are still objects based on JavaScript's [prototypal inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance).
The type of both objects is actually `Object`, since JavaScript essentially only defines the types
[Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).

The introduction of the class syntax was a controversial addition.
Check out [Not Awesome: ES6 Classes](https://github.com/petsel/not-awesome-es6-classes)
or [Is “Class” In ES6 The New “Bad” Part? on Medium](https://medium.com/@rajaraodv/is-class-in-es6-the-new-bad-part-6c4e6fe1ee65) for more details.

The ES6 class syntax is used a lot in "old" React and also in Node.js, hence an understanding of it is beneficial even in this course.
However, since we are using the new [Hooks](https://reactjs.org/docs/hooks-intro.html) feature of React throughout this course,
we have no concrete use for JavaScript's class syntax.

### JavaScript materials

There exist both good and poor guides for JavaScript on the Internet.
Most of the links on this page relating to JavaScript features reference [Mozilla's JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

It is highly recommended to immediately read
[A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
on Mozilla's website.

If you wish to get to know JavaScript deeply there is a great free book series on the Internet called [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS).

Another great resource for learning JavaScript is [javascript.info](https://javascript.info).
  
The free and highly engaging book [Eloquent JavaScript](https://eloquentjavascript.net) takes you from the basics to interesting stuff quickly.
It is a mixture of theory projects and exercises and covers general programming theory as well as the JavaScript language.

[egghead.io](https://egghead.io) has plenty of quality screencasts on JavaScript, React, and other interesting topics.
Unfortunately, some of the material is behind a paywall.

</div>
