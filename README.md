[![Build Status](https://travis-ci.org/erwinheitzman/find-duplicate-strings.svg?branch=master)](https://travis-ci.org/erwinheitzman/find-duplicate-strings)
[![codecov](https://codecov.io/gh/erwinheitzman/find-duplicate-strings/branch/master/graph/badge.svg)](https://codecov.io/gh/erwinheitzman/find-duplicate-strings)

# find-duplicate-strings

**Easy to use CLI that finds duplicate strings in a directory and stores them in a external file for easy reference**

## Getting started

Install:

```bash
npm i -g find-duplicate-strings
```

Run:

```bash
find-duplicate-strings
```

You will be asked to enter a path to a existing directory to be scanned for duplicate string values:

```bash
? Please provide a directory to scan for duplicate values.
./data
```

You can provide any directories that you would like to exclude:

```bash
? Please provide any directories that you want to skip (separated list by ;) (node_modules)
```

Then you will be asked to enter the file extensions that you want to scan:

```bash
? Please provide the file extensions you want to scan or leave empty to scan all files (separated list by ;)
```

It will then ask you if you would like to scan any other directories (the results will be stored in a single file):

```bash
? Would you like to scan another directory? (Y/n)
```

When done, if you aren't running in silent mode it will output a table containing it's first 10 findings:

```bash
┌─────────┬──────────────┬───────────────────────────────┐
│ (index) │      0       │               1               │
├─────────┼──────────────┼───────────────────────────────┤
│    0    │    'one'     │ { count: 2, files: [Array] }  │
│    1    │    'bar'     │ { count: 15, files: [Array] } │
│    2    │    'two'     │ { count: 2, files: [Array] }  │
│    3    │    'foo'     │ { count: 14, files: [Array] } │
│    4    │   'three'    │ { count: 2, files: [Array] }  │
│    5    │    'four'    │ { count: 2, files: [Array] }  │
│    6    │    'baz'     │ { count: 2, files: [Array] }  │
│    7    │    'five'    │ { count: 2, files: [Array] }  │
│    8    │   'foobar'   │ { count: 6, files: [Array] }  │
│    9    │ 'not-unique' │ { count: 2, files: [Array] }  │
│   10    │    '...'     │             '...'             │
└─────────┴──────────────┴───────────────────────────────┘
```

Lastly you will be asked to enter a path to a file that the results can be written to (json):

```bash
? Please provide a filepath to store the output.
./output
```

## Help

Use the help flag to get more information about how to use the CLI.

```bash
find-duplicate-strings --help
```

### License

MIT
