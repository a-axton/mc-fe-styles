# Masterclass Front End Style Builder
Maintained by Stephen Pontes for Masterclass, this repo contains the build scripts to process our sass library of styles for the MC website.  The final output is minified and compressed to be imported in the app's asset pipeline for final compilation with the rest of the css.

## Required
- node (If you have brew, it's just `brew install node`)
- npm (`npm install npm -g`)
- gulp (`npm install gulp -g`)

# Getting started
Clone the repo:
```
git clone git@github.com:yankaindustries/mc-fe-styles.git mc-fe-styles
```

Change into your newly cloned folder
```
cd mc-fe-styles
```

Install dependencies
```
npm install
```

# Development
Once you've finished the "getting started" steps, you're ready to build!

```
npm start
```

This process will remain running and will automatically re-compile any scss and js files in the `/src/` directory if they change.

A http-server process will also start up.  You can see your changes "live" here:

```
http://localhost:3001
```

# "Deploying"
We aren't really deploying anything to production, this is a node_module that gets included in the main app.  So we need to make sure we just minify/compress everything with our gulp task.

Kill the `npm start` process if it's still running (`control + c`), then you're good to release a new version! Version type can be `patch` (0.0.x), `minor` (0.x.0), `major` (x.0.0).

```
npm version [type]
```

For example: To go from 0.0.1 to 0.0.2, you'd use a "patch":

```
npm version patch
```

If that all works, you can publish a new version of our assets to the app!

```
npm publish
```

If successfull, you'll see:
```
+ @masterclass/mc-fe-styles@@0.0.0
```

Where 0.0.0 is the new version number!