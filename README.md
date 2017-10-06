# Masterclass Front End Style Builder
This repo contains the build scripts to process our sass library of styles for the MC website.  The final output is minified and compressed to be imported in the app's asset pipeline for final compilation with the rest of the css.

## Requirements
- node (If you have brew, it's just `brew install node`)
- npm (`npm install npm -g`)
- gulp (`npm install gulp -g`)

## Clone the repo
```
git clone git@github.com:yankaindustries/mc-fe-styles.git mc-fe-styles
```

Change into your newly cloned folder
```
cd mc-fe-styles
```

## Set AWS Credentials
To sync assets to S3 (when versioning) you'll need to make sure you have the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in either your bash_profile or zshrc files.  Make sure these two variables are defined or you'll run into issues later.  To get each of these values, you'll need to have the heroku CLI tools installed, then run:
```
heroku config:get AWS_ACCESS_KEY_ID -a mc-release
heroku config:get AWS_SECRET_ACCESS_KEY -a mc-release
```

Set these in your `.bash_profile` or `.zshrc`:
```
export AWS_PROD_ACCESS_KEY_ID='ABCD1234'
export AWS_PROD_SECRET_ACCESS_KEY='ABCD1234'
```

Now quit and relaunch your terminal, or run:
```
source ~/.zshrc
```
or:
```
source ~/.bash_profile
```

## Install Dependencies
We use node package manager for all our dependencies in mc-fe-styles.  Grab all the files you'll need with:
```
npm install
```

# Active Development
Once you've finished the "getting started" steps, you're ready to build!

```
npm start
```

This process will remain running and will automatically re-compile any scss and js files in the `/src/` directory if they change.


# Versioning
See [Versioning mc-fe-styles](https://github.com/yankaindustries/mc-fe-styles/wiki/Versioning-this-app) for instructions.
