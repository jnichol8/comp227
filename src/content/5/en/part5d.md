---
mainImage: ../../../images/part-5.svg
part: 5
letter: d
lang: en
---

<div class="content">

So far we have tested the backend as a whole on an API level using integration tests and tested some frontend components using unit tests.

Next, we will look into one way to test the [system as a whole](https://en.wikipedia.org/wiki/System_testing) using **End to End** (E2E) tests.

We can do E2E testing of a web application using a browser and a testing library.
There are multiple libraries available.
One example is [Selenium](http://www.seleniumhq.org/),
which can be used with almost any browser.
Another browser option is so-called [headless browsers](https://en.wikipedia.org/wiki/Headless_browser),
which are browsers with no graphical user interface.
For example, Chrome can be used in headless mode.

E2E tests are potentially the most useful category of tests because they test the system through the same interface as real users use.

They do have some drawbacks too.
Configuring E2E tests is more challenging than unit or integration tests.
They also tend to be quite slow, and with a large system, their execution time can be minutes or even hours.
This is bad for development because during coding it is beneficial to be able to run tests as often as possible in case of code [regressions](https://en.wikipedia.org/wiki/Regression_testing).

E2E tests can also be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359).
Some tests might pass one time and fail another, even if the code does not change at all.

### Cypress

E2E library [Cypress](https://www.cypress.io/) has become popular within the last year.
Cypress is exceptionally easy to use, and when compared to Selenium, for example, it requires a lot less hassle and headache.
Its operating principle is radically different than most E2E testing libraries because Cypress tests are run completely within the browser.
Other libraries run the tests in a Node process, which is connected to the browser through an API.

Let's make some end-to-end tests for our task application.

We begin by installing Cypress to *the frontend* as a development dependency

```js
npm install cypress --save-dev
```

and by adding an npm-script to run it:

```js
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 db.json",
    "cypress:open": "cypress open"  // highlight-line
  },
  // ...
}
```

Unlike the frontend's unit tests, Cypress tests can be in the frontend or the backend repository, or even in their separate repository.

The tests require the tested system to be running.
Unlike our backend integration tests, Cypress tests **do not start** the system when they are run.

Let's add an npm script to *the backend* which starts it in test mode, or so that `NODE_ENV` is `test`.

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../../../2/luento/tasks && npm run build && cp -r build ../../../3/luento/tasks-backend",
    "deploy": "git push heroku master",
    "deploy:full": "npm run build:ui && git add .
&& git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand",
    "start:test": "cross-env NODE_ENV=test node index.js" // highlight-line
  },
  // ...
}
```

NB! To get Cypress working with WSL2 one might need to do some additional configuring first.
These two [links](https://docs.cypress.io/guides/getting-started/installing-cypress#Windows-Subsystem-for-Linux)
are great places to [start](https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress).
  
When both the backend and frontend are running, we can start Cypress with the command

```js
npm run cypress:open
```

When we first run Cypress, it creates a *cypress* directory.
It contains an *e2e* subdirectory, where we will place our tests.
Cypress creates a bunch of example tests for us in two subdirectories: the *e2e/1-getting-started* and the *e2e/2-advanced-examples* directory.
We can delete both directories and make our test in the file *task_app.cy.js*:

```js
describe('Task app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Tasks')
    cy.contains('Task app, Department of Computer Science, University of Helsinki 2022')
  })
})
```

We start the test from the opened window:

![cypress screenshot with run 1 integration spec](../../images/5/40x.png)

**NOTE**: you might need to restart Cypress after deleting the example tests.

Running the test opens your browser and shows how the application behaves as the test is run:

![cypress showing automation of task test](../../images/5/32x.png)

The structure of the test should look familiar.
They use `describe` blocks to group different test cases, just like Jest.
The test cases have been defined with the `it` method.
Cypress borrowed these parts from the [Mocha](https://mochajs.org/) testing library it uses under the hood.

[cy.visit](https://docs.cypress.io/api/commands/visit.html) and [cy.contains](https://docs.cypress.io/api/commands/contains.html) are Cypress commands, and their purpose is quite obvious.
[cy.visit](https://docs.cypress.io/api/commands/visit.html) opens the web address given to it as a parameter in the browser used by the test.
[cy.contains](https://docs.cypress.io/api/commands/contains.html) searches for the string it received as a parameter from the page.

We could have declared the test using an arrow function

```js
describe('Task app', () => { // highlight-line
  it('front page can be opened', () => { // highlight-line
    cy.visit('http://localhost:3000')
    cy.contains('Tasks')
    cy.contains('Task app, Department of Computer Science, University of Helsinki 2022')
  })
})
```

However, Mocha [recommends](https://mochajs.org/#arrow-functions) that arrow functions are not used, because they might cause some issues in certain situations.

If `cy.contains` does not find the text it is searching for, the test does not pass.
So if we extend our test like so

```js
describe('Task app', function() {
  it('front page can be opened',  function() {
    cy.visit('http://localhost:3000')
    cy.contains('Tasks')
    cy.contains('Task app, Department of Computer Science, University of Helsinki 2022')
  })

// highlight-start
  it('front page contains random text', function() {
    cy.visit('http://localhost:3000')
    cy.contains('wtf is this app?')
  })
// highlight-end
})
```

the test fails

![cypress showing failure expecting to find wtf but no](../../images/5/33x.png)

Let's remove the failing code from the test.

### Writing to a form

Let's extend our tests so that the test tries to log in to our application.
We assume our backend contains a user with the username `powercat` and password `tigers`.

The test begins by opening the login form.

```js
describe('Task app',  function() {
  // ...

  it('login form can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('login').click()
  })
})
```

The test first searches for the login button by its text and clicks the button with the command [cy.click](https://docs.cypress.io/api/commands/click.html#Syntax).

Both of our tests begin the same way, by opening the page *<http://localhost:3000>*, so we should
separate the shared part into a `beforeEach` block run before each test:

```js
describe('Task app', function() {
  // highlight-start
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  // highlight-end

  it('front page can be opened', function() {
    cy.contains('Tasks')
    cy.contains('Task app, Department of Computer Science, University of Helsinki 2022')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })
})
```

The login field contains two *input* fields, which the test should write into.

The [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) command allows for searching elements by CSS selectors.

We can access the first and the last input field on the page,
and write to them with the command [cy.type](https://docs.cypress.io/api/commands/type.html#Syntax) like so:

```js
it('user can login', function () {
  cy.contains('login').click()
  cy.get('input:first').type('powercat')
  cy.get('input:last').type('tigers')
})  
```

The test works.
The problem is if we later add more input fields, the test will break because it expects the fields it needs to be the first and the last on the page.

It would be better to give our inputs unique *ids* and use those to find them.
We change our login form like so:

```js
const LoginForm = ({ ... }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            id='username'  // highlight-line
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id='password' // highlight-line
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit"> // highlight-line
          login
        </button>
      </form>
    </div>
  )
}
```

We also added an id to our submit button so we can access it in our tests.

The test becomes:

```js
describe('Task app',  function() {
  // ..
  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('powercat')  // highlight-line    
    cy.get('#password').type('tigers')  // highlight-line
    cy.get('#login-button').click()  // highlight-line

    cy.contains('Matti Luukkainen logged in') // highlight-line
  })
})
```

The last row ensures that the login was successful.

Notice that the CSS [id-selector](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors) is #,
so if we want to search for an element with the id `username` the CSS selector is `#username`.

### Some things to remember

The test first clicks the button opening the login form:

```js
cy.contains('login').click()
```

When the form has been filled, the form is submitted by clicking the submit button:

```js
cy.get('#login-button').click()
```

Both buttons have the text ***login***, but they are two separate buttons.
While both buttons are in the application's DOM the whole time, only one is visible at a time because of the `display:none` styling on one of them.

If we search for a button by its text, [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) will return the first of them, or the one opening the login form.
This will happen even if the button is not visible.
To avoid name conflicts, we gave the submit button the id `login-button` we can use to access it.

Now we notice that the variable `cy` our tests use gives us a nasty Eslint error

![vscode screenshot showing cy is not defined](../../images/5/30ea.png)

We can get rid of it by installing [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) as a development dependency

```js
npm install eslint-plugin-cypress --save-dev
```

and changing the configuration in *.eslintrc.js* like so:

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true,
        "cypress/globals": true // highlight-line
    },
    "extends": [ 
      // ...
    ],
    "parserOptions": {
      // ...
    },
    "plugins": [
        "react", "jest", "cypress" // highlight-line
    ],
    "rules": {
      // ...
    }
}
```

### Testing new task form

Let's next add test methods to test the "new task" functionality:

```js
describe('Task app', function() {
  // ..
  // highlight-start
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('powercat')
      cy.get('input:last').type('tigers')
      cy.get('#login-button').click()
    })
    // highlight-end

    // highlight-start
    it('a new task can be created', function() {
      cy.contains('new task').click()
      cy.get('input').type('a task created by cypress')
      cy.contains('save').click()

      cy.contains('a task created by cypress')
    })
  })
  // highlight-end
})
```

The test has been defined in its own `describe` block.
Only logged-in users can create new tasks, so we added logging in to the application to a `beforeEach` block.

The test trusts that when creating a new task the page contains only one input, so it searches for it like so:

```js
cy.get('input')
```

If the page contained more inputs, the test would break

![cypress error - cy.type can only be called on a single element](../../images/5/31x.png)

Due to this problem, it would again be better to give the input an *id* and search for the element by its id.

The structure of the tests looks like so:

```js
describe('Task app', function() {
  // ...

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('powercat')
    cy.get('#password').type('tigers')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('powercat')
      cy.get('input:last').type('tigers')
      cy.get('#login-button').click()
    })

    it('a new task can be created', function() {
      // ...
    })
  })
})
```

Cypress runs the tests in the order they are in the code.
So first it runs `user can log in`, where the user logs in.
Then cypress will run `a new task can be created` for which a `beforeEach` block logs in as well.
Why do this? Isn't the user logged in after the first test?
No, because ***each*** test starts from zero as far as the browser is concerned.
All changes to the browser's state are reversed after each test.

### Controlling the state of the database

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated.
Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.

As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run.
The challenge with E2E tests is that they do not have access to the database.

The solution is to create API endpoints for the backend tests.
We can empty the database using these endpoints.
Let's create a new **router** for the tests

```js
const testingRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Task.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
```

and add it to the backend only *if the application is run in test-mode*:

```js
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/tasks', tasksRouter)

// highlight-start
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
// highlight-end

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

After the changes, an HTTP POST request to the ***/api/testing/reset*** endpoint empties the database.
Make sure your backend is running in test mode by starting it with this command (previously configured in the package.json file):

```js
  npm run start:test
```

The modified backend code can be found on the [GitHub](https://github.com/comp227/part3-tasks-backend/tree/part5-1) branch *part5-1*.

Next, we will change the `beforeEach` block so that it empties the server's database before tests are run.

Currently, it is not possible to add new users through the frontend's UI, so we add a new user to the backend from the beforeEach block.

```js
describe('Task app', function() {
   beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'powercat',
      password: 'tigers'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    // highlight-end
    cy.visit('http://localhost:3000')
  })
  
  it('front page can be opened', function() {
    // ...
  })

  it('user can login', function() {
    // ...
  })

  describe('when logged in', function() {
    // ...
  })
})
```

During the formatting, the test does HTTP requests to the backend with [cy.request](https://docs.cypress.io/api/commands/request.html).

Unlike earlier, now the testing starts with the backend in the same state every time.
The backend will contain one user and no tasks.

Let's add one more test for checking that we can change the importance of tasks.
First, we change the frontend so that a new task is unimportant by default, or the `important` field is `false`:

```js
const TaskForm = ({ createTask }) => {
  // ...

  const addTask = (event) => {
    event.preventDefault()
    createTask({
      content: newTask,
      important: false // highlight-line
    })

    setNewTask('')
  }
  // ...
} 
```

There are multiple ways to test this.
In the following example, we first search for a task and click its ***make important*** button.
Then we check that the task now contains a ***make not important*** button.

```js
describe('Task app', function() {
  // ...

  describe('when logged in', function() {
    // ...

    describe('and a task exists', function () {
      beforeEach(function () {
        cy.contains('new task').click()
        cy.get('input').type('another task cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        cy.contains('another task cypress')
          .contains('make important')
          .click()

        cy.contains('another task cypress')
          .contains('make not important')
      })
    })
  })
})
```

The first command searches for a component containing the text `another task cypress`, and then for a ***make important*** button within it.
It then clicks the button.

The second command checks that the text on the button has changed to ***make not important***.

The tests and the current frontend code can be found on the [GitHub](https://github.com/comp227/part2-tasks/tree/part5-9) branch *part5-9*.

### Failed login test

Let's make a test to ensure that a login attempt fails if the password is wrong.

Cypress will run all tests each time by default, and as the number of tests increases, it starts to become quite time-consuming.
When developing a new test or when debugging a broken test,
we can define the test with `it.only` instead of `it`, so that Cypress will only run the required test.
When the test is working, we can remove `.only`.

First version of our tests is as follows:

```js
describe('Task app', function() {
  // ...

  it.only('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('powercat')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })

  // ...
)}
```

The test uses [cy.contains](https://docs.cypress.io/api/commands/contains.html#Syntax) to ensure that the application prints an error message.

The application renders the error message to a component with the CSS class `error`:

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error"> // highlight-line
      {message}
    </div>
  )
}
```

We could make the test ensure that the error message is rendered to the correct component, that is, the component with the CSS class `error`:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').contains('wrong credentials') // highlight-line
})
```

First, we use [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax) to search for a component with the CSS class `error`.
Then we check that the error message can be found from this component.
Notice that the [CSS class selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors)
starts with a full stop, so the selector for the class `error` is `.error`.

We could do the same using the [should](https://docs.cypress.io/api/commands/should.html) syntax:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') // highlight-line
})
```

Using `should` is a bit trickier than using `contains`, but it allows for more diverse tests than `contains` which works based on text content only.

A list of the most common assertions which can be used with `should`
can be found [here](https://docs.cypress.io/guides/references/assertions.html#Common-Assertions).

We can, for example, make sure that the error message is red and it has a border:

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error').should('contain', 'wrong credentials') 
  cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
  cy.get('.error').should('have.css', 'border-style', 'solid')
})
```

Cypress requires the colors to be given as [rgb](https://rgbcolorcode.com/color/red).

Because all tests are for the same component we accessed using [cy.get](https://docs.cypress.io/api/commands/get.html#Syntax),
we can chain them using [and](https://docs.cypress.io/api/commands/and.html).

```js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

Let's finish the test so that it also checks that the application does not render the success message `'Matti Luukkainen logged in'`:

```js
it('login fails with wrong password', function() {
  cy.contains('login').click()
  cy.get('#username').type('powercat')
  cy.get('#password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in') // highlight-line
})
```

Always consider chaining `should` with `get` (or another chainable command).
We used `cy.get('html')` to access the whole visible content of the application.

**NOTE:** Some CSS properties [behave differently on Firefox](https://github.com/cypress-io/cypress/issues/9349).
If you run the tests with Firefox:
  
  ![running](https://user-images.githubusercontent.com/4255997/119015927-0bdff800-b9a2-11eb-9234-bb46d72c0368.png)
  
  then tests that involve, for example, `border-style`, `border-radius` and `padding`, will pass in Chrome or Electron, but fail in Firefox:
  
  ![borderstyle](https://user-images.githubusercontent.com/4255997/119016340-7b55e780-b9a2-11eb-82e0-bab0418244c0.png)

### Bypassing the UI

Currently, we have the following tests:

```js
describe('Task app', function() {
  it('user can login', function() {
    cy.contains('login').click()
    cy.get('#username').type('powercat')
    cy.get('#password').type('tigers')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    // ...
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input:first').type('powercat')
      cy.get('input:last').type('tigers')
      cy.get('#login-button').click()
    })

    it('a new task can be created', function() {
      // ...

    })
   
  })
})
```

First, we test logging in.
Then, in their own describe block, we have a bunch of tests, which expect the user to be logged in.
User is logged in in the `beforeEach` block.

As we said above, each test starts from zero! Tests do not start from the state where the previous tests ended.

The Cypress documentation gives us the following advice:
[Fully test the login flow – but only once!](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow-but-only-once).
So instead of logging in a user using the form in the `beforeEach` block, Cypress recommends that we
[bypass the UI](https://docs.cypress.io/guides/getting-started/testing-your-app.html#Bypassing-your-UI)
and do an HTTP request to the backend to log in.
The reason for this is that logging in with an HTTP request is much faster than filling out a form.

Our situation is a bit more complicated than in the example in the Cypress documentation because when a user logs in, our application saves their details to the localStorage.
However, Cypress can handle that as well.
The code is the following

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'powercat', password: 'tigers'
    }).then(response => {
      localStorage.setItem('loggedTaskappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
    // highlight-end
  })

  it('a new task can be created', function() {
    // ...
  })

  // ...
})
```

We can access the response to a [cy.request](https://docs.cypress.io/api/commands/request.html) with the `then` method.
Under the hood `cy.request`, like all Cypress commands,
are [promises](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Commands-Are-Promises).
The callback function saves the details of a logged-in user to localStorage, and reloads the page.
Now there is no difference to a user logging in with the login form.

If and when we write new tests to our application, we have to use the login code in multiple places.
We should make it a [custom command](https://docs.cypress.io/api/cypress-api/custom-commands.html).

Custom commands are declared in *cypress/support/commands.js*.
The code for logging in is as follows:

```js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedTaskappUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})
```

Using our custom command is easy, and our test becomes cleaner:

```js
describe('when logged in', function() {
  beforeEach(function() {
    // highlight-start
    cy.login({ username: 'powercat', password: 'tigers' })
    // highlight-end
  })

  it('a new task can be created', function() {
    // ...
  })

  // ...
})
```

The same applies to creating a new task now that we think about it.
We have a test, which makes a new task using the form.
We also make a new task in the `beforeEach` block of the test testing changing the importance of a task:

```js
describe('Task app', function() {
  // ...

  describe('when logged in', function() {
    it('a new task can be created', function() {
      cy.contains('new task').click()
      cy.get('input').type('a task created by cypress')
      cy.contains('save').click()

      cy.contains('a task created by cypress')
    })

    describe('and a task exists', function () {
      beforeEach(function () {
        cy.contains('new task').click()
        cy.get('input').type('another task cypress')
        cy.contains('save').click()
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

Let's make a new custom command for making a new task.
The command will make a new task with an HTTP POST request:

```js
Cypress.Commands.add('createTask', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/tasks',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedTaskappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})
```

The command expects the user to be logged in and the user's details to be saved to localStorage.

Now the formatting block becomes:

```js
describe('Task app', function() {
  // ...

  describe('when logged in', function() {
    it('a new task can be created', function() {
      // ...
    })

    describe('and a task exists', function () {
      beforeEach(function () {
        // highlight-start
        cy.createTask({
          content: 'another task cypress',
          important: false
        })
        // highlight-end
      })

      it('it can be made important', function () {
        // ...
      })
    })
  })
})
```

The tests and the frontend code can be found on the [GitHub](https://github.com/comp227/part2-tasks/tree/part5-10) branch *part5-10*.

### Changing the importance of a task

Lastly, let's take a look at the test we did for changing the importance of a task.
First, we'll change the formatting block so that it creates three tasks instead of one:

```js
describe('when logged in', function() {
  describe('and several tasks exist', function () {
    beforeEach(function () {
      // highlight-start
      cy.createTask({ content: 'first task', important: false })
      cy.createTask({ content: 'second task', important: false })
      cy.createTask({ content: 'third task', important: false })
      // highlight-end
    })

    it('one of those can be made important', function () {
      cy.contains('second task')
        .contains('make important')
        .click()

      cy.contains('second task')
        .contains('make not important')
    })
  })
})
```

How does the [cy.contains](https://docs.cypress.io/api/commands/contains.html) command actually work?

When we click the `cy.contains('second task')` command in Cypress [Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner.html),
we see that the command searches for the element containing the text `second task`:

![cypress test runner clicking testbody and second task](../../images/5/34x.png)

By clicking the next line `.contains('make important')` we see that the test uses
the 'make important' button corresponding to the ***second task***:

![cypress test runner clicking make important](../../images/5/35x.png)

When chained, the second `contains` command ***continues*** the search from within the component found by the first command.

If we had not chained the commands, and instead write:

```js
cy.contains('second task')
cy.contains('make important').click()
```

the result would have been entirely different.
The second line of the test would click the button of a wrong task:

![cypress showing error and incorrectly trying to click first button](../../images/5/36x.png)

When coding tests, you should check in the test runner that the tests use the right components!

Let's change the `Task` component so that the text of the task is rendered to a `span`.

```js
const Task = ({ task, toggleImportance }) => {
  const label = task.important
    ? 'make not important' : 'make important'

  return (
    <li className='task'>
      <span>{task.content}</span> // highlight-line
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```

Our tests break! As the test runner reveals, `cy.contains('second task')` now returns the component containing the text, and the button is not in it.

![cypress showing test is broken trying to click make important](../../images/5/37x.png)

One way to fix this is the following:

```js
it('one of those can be made important', function () {
  cy.contains('second task').parent().find('button').click()
  cy.contains('second task').parent().find('button')
    .should('contain', 'make not important')
})
```

In the first line, we use the [parent](https://docs.cypress.io/api/commands/parent.html)
command to access the parent element of the element containing ***second task*** and find the button from within it.
Then we click the button and check that the text on it changes.

Notice that we use the command [find](https://docs.cypress.io/api/commands/find.html#Syntax) to search for the button.
We cannot use [cy.get](https://docs.cypress.io/api/commands/get.html) here,
because it always searches from the **whole** page and would return all 5 buttons on the page.

Unfortunately, we have some copy-paste in the tests now, because the code for searching for the right button is always the same.

In these kinds of situations, it is possible to use the [as](https://docs.cypress.io/api/commands/as.html) command:

```js
it('one of those can be made important', function () {
  cy.contains('second task').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make not important')
})
```

Now the first line finds the right button and uses `as` to save it as `theButton`.
The following lines can use the named element with `cy.get('@theButton')`.

### Running and debugging the tests

Finally, some tasks on how Cypress works and debugging your tests.

The form of the Cypress tests gives the impression that the tests are normal JavaScript code, and we could for example try this:

```js
const button = cy.contains('login')
button.click()
debugger() 
cy.contains('logout').click()
```

This won't work, however.
When Cypress runs a test, it adds each `cy` command to an execution queue.
When the code of the test method has been executed, Cypress will execute each command in the queue one by one.

Cypress commands always return `undefined`, so `button.click()` in the above code would cause an error.
An attempt to start the debugger would not stop the code between executing the commands, but before any commands have been executed.

Cypress commands are *like promises*, so if we want to access their return values,
we have to do it using the [then](https://docs.cypress.io/api/commands/then.html) command.
For example, the following test would print the number of buttons in the application, and click the first button:

```js
it('then example', function() {
  cy.get('button').then( buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

Stopping the test execution with the debugger is [possible](https://docs.cypress.io/api/commands/debug.html).
The debugger starts only if Cypress test runner's developer console is open.

The developer console is all sorts of useful when debugging your tests.
You can see the HTTP requests done by the tests on the Network tab, and the console tab will show you information about your tests:

![developer console while running cypress](../../images/5/38ea.png)

So far we have run our Cypress tests using the graphical test runner.
It is also possible to run them [from the command line](https://docs.cypress.io/guides/guides/command-line.html).
We just have to add an npm script for it:

```js
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json",
    "cypress:open": "cypress open",
    "test:e2e": "cypress run" // highlight-line
  },
```

Now we can run our tests from the command line with the command `npm run test:e2e`

![terminal output of running npm e2e tests showing passed](../../images/5/39x.png)

Notice that videos of the test execution will be saved to *cypress/videos/*, so you should probably git ignore this directory.

The frontend and the test code can be found on the [GitHub](https://github.com/comp227/part2-tasks/tree/part5-11) branch *part5-11*.

</div>

<div class="tasks">

### Exercises 5.17-5.22

In the last exercises of this part, we will do some E2E tests for our blog application.
The material of this part should be enough to complete the exercises.
You **must check out the Cypress [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)**.
It is probably the best documentation I have ever seen for an open-source project.

I especially recommend reading
[Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Can-Be-Simple-Sometimes), which states

> **This is the single most important guide for understanding how to test with Cypress. Read it. Understand it.**

#### 5.17: bloglist end to end testing, step1

Configure Cypress for your project.
Make a test for checking that the application displays the login form by default.

The structure of the test must be as follows:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })
})
```

The `beforeEach` formatting blog must empty the database using for example the method we used in the [material](/part5/end_to_end_testing#controlling-the-state-of-the-database).

#### 5.18: bloglist end to end testing, step2

Make tests for logging in.
Test both successful and unsuccessful login attempts.
Make a new user in the `beforeEach` block for the tests.

The test structure extends like so:

```js
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create here a user to backend
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    // ...
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
})
```

**Optional bonus exercise**: Check that the notification shown with unsuccessful login is displayed red.

#### 5.19: bloglist end to end testing, step3

Make a test that verifies a logged-in user can create a new blog.
The structure of the test could be as follows:

```js
describe('Blog app', function() {
  // ...

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
    })

    it('A blog can be created', function() {
      // ...
    })
  })

})
```

The test has to ensure that a new blog is added to the list of all blogs.

#### 5.20: bloglist end to end testing, step4

Make a test that confirms users can like a blog.

#### 5.21: bloglist end to end testing, step5

Make a test for ensuring that the user who created a blog can delete it.

**Optional bonus exercise:** also check that other users cannot delete the blog.

#### 5.22: bloglist end to end testing, step6

Make a test that checks that the blogs are ordered according to likes with the blog with the most likes being first.

This exercise is quite a bit trickier than the previous ones.
One solution is to add a certain class for the element which wraps the blog's content
and use the [eq](https://docs.cypress.io/api/commands/eq#Syntax) method to get the blog element in a specific index:
  
```js
cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
```

Notice that you might end up having problems if you click a like button many times in a row.
It might be that cypress does the clicking so fast that it does not have time to update the app state in between the clicks.
One remedy for this is to wait for the number of likes to update in between all clicks.

This was the last exercise of this part, and it's time to push your code to GitHub if you haven't already and mark the exercises that were completed on Canvas.

</div>
