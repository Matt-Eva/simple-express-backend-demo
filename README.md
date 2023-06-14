# Express Server Demo

So, you want to create a basic backend for your frontend project. Great!

Before you do, make sure your frontend app is working the way you want it to
and meets all the project requirements - _don't get sidetracked_! This is an
extra-bonus thing for you to try out.

This is a good strategy if you have a secret API key you need to hide. API keys
can never be hidden if they're referenced directly in frontend code - that's why
we often want to store them on the backend, where they aren't visible to users.

This walkthrough will guide you through the steps to implementing a backend
server written in JavaScript using the Express framework. We won't be talking
about the underlying concepts in great detail. (But you can definitely research
them if you're interested!)

**IMPORTANT**: Don't run any `git adds` or `git commits` until instructed to in
this walkthrough. If the connecting to a GitHub repository walkthrough tells you
to run an add or a commit, go ahead and do so.

## Setup

First, create a new folder to store your Express server and connect it to a new
GitHub repository.
([Walkthrough](https://matteweva.medium.com/github-workflow-a-basic-guide-fdfd68d034b6).)

Once that folder has been set up and connected to GitHub, run the `npm init`
command within the folder. You can press enter to accept all of the default
options that it asks you for.

Awesome! Now we can install `npm` packages!

## Installing Packages

We'll run the following commands to install all of the tools we'll need in this
project:

```Bash
npm install express cors axios
```

We'll also run the following command to save this tool as a "dev" dependency -
that means we won't be using it when our application is deployed:

```Bash
npm install --save-dev dotenv
```

If you look at your `package.json` file, you should see all of these dependecies
installed! (Consult the `package.json` file in this repo for reference).

## .gitignore and .env

If we're using a secret API key within this project, we'll want to find a way
to access it in our code without pushing that key up to GitHub.

We can do this using a combination of two files - a `.gitignore` file and a
`.env` file!

Let's start by creating those two files. You can do so by running the command
`touch .gitignore .env` in the command line.

### .gitignore

The `.gitignore` file is used to hide files and folders from Git, such that
they're not included in version control history and are not pushed up to GitHub.

The `.env` file is used to store _environment variables_, which are pieces of
information we want to access in our code but keep secret.

We'll add two lines to our `.gitignore` file:

```Git
node_modules
.env
```

This tells Git to ignore the `node_modules` folder and the `.env` file. You
should see both of these grayed out in VS Code after adding them to your
`.gitignore`.

_Now_ you can run your first `git add .` and `git commit -m "commit message"`.

If we run a `git add` or a `git commit` before we add `.env` or `node_modules`
to our `.gitignore` file, we won't be able to successfully ignore them. They
_must_ be added to the `.gitignore` _before_ they are saved in version history.

### .env

Within our `.env` file, we can create a variable representing our API Key by
adding the following to your file:

```
API_KEY=insert-your-api-key
```

It's convention to uppercase environment variables. Note that there should be no
spaces around the `=` sign.

## Adding a Script

Within our `package.json` file, you should see a section labelled `scripts`. It
will probably look like this:

```JSON
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

We're going to add a new entry to this section!

```JSON
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
     "dev": "node -r dotenv/config index.js dotenv_config_path=./.env"
  }
```

This will allow us to start our server by running the command `npm run dev`. We
also added some configuration to this command that will allow us to use
environment variables in our application using the `dotenv` package.

We don't need the `dotenv` package to access Environment Variables in deployed
environments, which is why we saved it as a dev dependency earlier.

## Creating the Server

It's time to actually create our server! Let's start by creating a new file
called `index.js` using the following command: `touch index.js`.

We're going to be adding code to this file throughout the rest of this
walkthrough.

First, let's start by including some `require` statements at the top of our
file. `require` allows us to import different packages we've installed into our
file.

We'll add the following `require` statements:

```JavaScript
const express = require("express")
const axios = require("axios")
const cors = require("cors")
```

Next, let's create a new variable called `app`. This variable will represent our
server!

```JavaScript
const app = express()
```

Now, we're going to tell our server - `app` - that we want it to use the `cors`
package we required. This will prevent us from running into CORS errors - Cross
Origin Resource Sharing - when we connect to this server from our frontend
application.

Add the following line of code:

```JavaScript
app.use(cors())
```

Now, we need to tell our `app` which port it should run on. Let's use `4000`.
This means that when developing your frontend, you'll need to make fetch
requests to `localhost:4000` to communicate with this server.

Add the following code:

```JavaScript
app.listen(4000, () =>{
    console.log("app running on port 4000")
})
```

Almost there! Next we need to set up an API route to handle requests from the
frontend.

Let's say that I'm using the Game of Thrones API, and I want to make a request
to a character. I'm going to set up a backend API route that will allow me to
make fetch requests to `http://localhost:4000/character` from my frontend:

Add the following code (or something similar that works for your project):

```JavaScript
app.get('/character', (req, res) =>{
    res.send('You fetched me!')
})
```

This sets up app to listen for `GET` requests to the
`http://localhost:4000/character` endpoint. The function has access to both the
request from the client - `req` - and the response that we'll send from the
server - `res`.

When we want to send back a response, we'll use the `res.send` method! In this
example, we're sending back the string `'You fetched me!'`.

But that's not exactly what we want to do - we want to query another API!

For that, we'll use the `axios` package we required before. It works very
similarly to `fetch`, but can be used in server-side code as well as client-side
code.

I'll make an example request to the Game of Thrones API. It doesn't require an
API Key, but this is where you can include your API Key in your request if you
need to.

You can access your API Key by accessing the environment variable in which it's
stored. To do so, write `process.env.API_KEY` in your code. This will inject
your API key into your code.

Here's my example (remember, I don't have an API Key):

```JavaScript
app.get('/character', (req, res) =>{
    axios.get("https://anapioficeandfire.com/api/characters/1") // use process.env.API_KEY to access your API Key and insert it where you need to into your code
        .then(response =>{
            res.json(response.data)
        })
        .catch(error =>{
            res.status(500).json({error: error})
        })
})
```

First, we run `axios.get` and pass it the URL to our API to make our request.
This works very similarly to a `fetch` request!

Just like fetch, we want to use a `.then` statement to run code after `axios`
has successfully retrieved our data from our API. 

Within that `.then` statement, we'll use the `res.json` method to pass
information back to our frontend as `json` (it works the same as `res.send` but
converts the data to `json` first). We'll pass in the `response.data` object as
the argument to this method.

If we receive an error when trying to access our API, our `catch` statement will
catch it, and we can send back an appropriate error message to our frontend.

## Testing it out

Ok! We're all set! If we need multiple endpoints, we can just create new ones
using `app.get` and passing them in the appropriate endpoints. 

Let's start our app up by running `npm run dev`. You can close this down again
by hitting `CTRL C` in your terminal. (You'll need to restart your server if you
make changes to your file while your server is running.)


Then, open Postman and start running some queries! Once you've verified things
are working in Postman, try querying this server on your frontend.

Congrats! You just built your first Express Server!