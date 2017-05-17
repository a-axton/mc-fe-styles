# Masterclass Front End Style Builder
Currently maintained by Stephen and Andy for Masterclass, this repo contains the build scripts to process our sass library of styles for the MC website.  The final output is minified and compressed to be imported in the app's asset pipeline for final compilation with the rest of the css.

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
NOTE: To sync assets to S3 (for a "deploy") you'll need to make sure you have the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in either your bash_profile or zshrc files.  Make sure these two variables are defined before running `npm install` or you'll run into issues later.

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

Commit any changes to the repo, then push both your code and the tags:
```
git push origin master && git push origin master --tags
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

# Updating the masterclass repo
First create a new branch for versioning!  If we were updating to version v0.0.4:

```
git checkout -b fe-update-v0.0.4 upstream/develop
```

Now you'll need to manually increment the package.json file in the masterclass repo under:

```
/vendor/assets/package.json
```

You'll increment the number after the `#` to match the new version number that you got above.

```
"@masterclass/mc-fe-styles": "yankaindustries/mc-fe-styles#0.0.4"
```

Now run a `yarn install`:
```
cd vendor/assets
```

```
yarn install
```

