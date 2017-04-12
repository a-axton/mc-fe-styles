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

# Active Development
Once you've finished the "getting started" steps, you're ready to build!  Make sure you have gulp installed:

```
npm install gulp -g
```

The default task is just "gulp":

```
gulp
```

This process will remain running and will compile automatically if any files change.

There's also a bundled webserver so you can test out the styles "live".

```
npm start
```

**Note: This server runs on port 3000, just like our default app server, so if you're currently running one, you'll need to kill it first before using this build system.**

Then check your work out here:

```
http://localhost:8080
```


# "Deploying"
We aren't really deploying anything, just minifying the css and uglifying the JS (and compressing any image assets).

Kill gulp if it's currently running (`control + c`), then run:

```
gulp ship
```

## Known issues
Images aren't moved to the public folder when you modify them in /src.  You'll need to relaunch gulp if you're making changes to images.