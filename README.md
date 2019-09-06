Squasher
===========

**Easy to use CLI that will squash any duplicate string values and store them in a external file which can be imported instead**

## Getting started

While under development use it like so:
```shell
node ./cli.js -r
```
You will be asked to enter a path to a existing directory to be scanned for duplicate string values (answer `./data` for now):
```shell
? Please pass a directory to scan for duplicate values.
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
You will be asked to enter a path to a file that the results can be written to (you can use both `json` and `js` file formats):
```shell
? Please pass a filepath to store the values.
./result.json
```
or
```shell
? Please pass a filepath to store the values.
./result.js
```


### License

MIT
