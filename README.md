iRacing Web Widgets
========================

The project contains a sample web widget, that consume data from the iRacing rest data serivce
(currently at https://iracing-test.netherton.org)

The objective is to build a library of useful widgets, that web developers can utilise
with minimal effort on any existing web site.

At this point in time, there is only 1 very simple sample widget - seasons - it shows a list of season's names.

Expect new commits containing enhancements and new widgets!

You are welcome to fork and make your own, or submit pull requests.

Dev Setup
========================

## Prerequisite

This is a Node based project, so you need node installed.  You can also use
the alternative node solution - iojs

Node - https://nodejs.org/, https://nodejs.org/download/
iojs - https://iojs.org/en/index.html

### Setup

(Not tested on windows - give it a go if you want to find out.)

```
git clone https://github.com/vipoo/iracing-widgets
cd iracing-widgets
npm install
grunt   # or ./node_modules/.bin/grunt
```

browse to http://localhost:4081/


## Grunt tasks

### grunt specs

Runs the specs, uses jasmine on node - at this time, the project has no tests!

### grunt less

Compiles the src/styles/main.less (and others) to public/main.css

### grunt serve

Runs the web application (aka node app.js)

### grunt eslint

Runs the eslint javascript compliance checks

