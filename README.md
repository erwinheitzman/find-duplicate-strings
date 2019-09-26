Squasher
===========

**Easy to use CLI that will squash any duplicate string values and store them in a external file which can be imported instead**

## Getting started

First compile the code like so:
```shell
npm run compile
```

Then (while under development) run it like so:
```shell
node ./dist/cli/index.js -r
```
You will be asked to enter a path to a existing directory to be scanned for duplicate string values (answer `./data` for now):
```shell
? Please provide a directory to scan for duplicate values.
./data
```
It will output a table containing it's findings:
```shell
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│   foo   │   6    │
│   bar   │   6    │
│ unique  │   2    │
└─────────┴────────┘
```
You will be asked to enter the file extensions that you want to scan:
```
? Please provide the file extensions you want to scan or leave empty to scan all files
)O js
)O ts
)O json
```
You will be asked to enter a path to a file that the results can be written to (you can use both `json` and `js` file formats):
```shell
? Please provide a filepath to store the values.
./result.json
```
or
```shell
? Please provide a filepath to store the values.
./result.js
```


### License

MIT
