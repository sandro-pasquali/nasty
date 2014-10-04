Nasty
=====

Quick and Dirty™ app construction set, with emphasis on Quick.

Build
=====

> npm install

> gulp

This will fire up a browser window with something on it for you to play with.

Requirements
============

This uses `compass`, and `gulp`. The first needs `Ruby`, but you probably have that already -- if not, install it. 

`gulp` will be installed for you if not already installed. 

`compass` will *not* be installed for you. If you need to install `compass`, do this:

`gem update --system;` 
`gem install compass --version 0.12.7`

*The version number is important*

Purpose
=======

Most websites are not complicated. A folder of .html files, some simple views, a plugin or two, some media files, can be composed into fun and charming destinations for your friends and fans. 

Create a very simple, but complete, deployable design and build system. This is mostly an experimental playground, but it will work pretty well for many things.

Config
======

1. Modify `gulp/build.json`
2. Play with the gulp tasks in `gulp/tasks`, in particular `gulp/tasks/default.js`

Develop
=======

`localhost:8081`

This should spawn automatically when you run `gulp`.

Code/css/js/html changes in `/src` will be hot pushed, so no need to refresh as you develop.

Testing
=======

Running `gulp` will automatically run any indicated tests, as well as booting up a visual testing server.

### Headless browser testing

You are able to declare a test script for any given script within a page. Consider this page:

```html
<body>
	<script src="foo.js"></script>
</body>
```

If you write a test suite for `foo.js`, change that page to this:

```html
<body>
	<!-- @test foo.js -->
</body>
```

On next build `foo.js` will be inserted in a `script` tag as before, but the builder will search for a Mocha test file at `/test/foo.js`, which it will then instrument on the page and execute within `PhantomJS`, giving you headless browser testing of your pages. `Chai` is the assertion library used.

###Visual testing

After building you can fire up `localhost:8082`. 

This is a very simple visual tester. How does what you've done respond to different screen sizes/devices?

Configuration is done within `/gulp/tasks/default.js`

ES6 & Traceur
=============

All `js` files in `/src/js` and `/src/components` are piped through `Traceur` on build.

This allows you to use many ES6 features, now. For example arrow functions. This:

```javascript
var tester = () => true;
```

Instead of this:

```javascript
var tester = function() {
	return true
}
```

For a list of what `Traceur` provides, visit [this page.](https://github.com/google/traceur-compiler/wiki/LanguageFeatures)

LevelDB
=======

Try it out. If you really hate it, not very hard to remove the dependency. It isn't needed to run the framework, though it is necessary if you want to store data using the built-in access methods (you can always do something else)

