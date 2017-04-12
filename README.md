# scaffolding
Simple static scaffolding

Clone the repo:
```
git clone [repo url]
```

Change into your newly cloned folder, then remove existing git history:
```
rm -rf .git
```

Now you'll need to set up your initial commit:
```
git init
git add .
git commit -m "Scaffolding commit"
```

Create a new repo on github, then grab the clone url, and using that, add your remote:
```
git remote add [path]
```

Kinda like:
```
git remote add origin git@github.com:stephenp/repoName.git
```


Ah...push it.
```
git push -u origin master
```


## Required
- node
- npm (`npm install npm -g`)
- gulp (`npm install gulp -g`)

## Setup
Change into the repo directory, then:
```
npm install
```

## Dev
```
npm start
```

Then in a new terminal window, to compile / live reload:
```
gulp
```

View your site at:
```
localhost:8080
```

## Shipping
Kill gulp, then run:
```
gulp ship
```

## Known issues
Images aren't moved to the public folder when you modify them in /src.  You'll need to relaunch gulp if you're making changes to images.
