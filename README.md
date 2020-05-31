[![Build Status](https://travis-ci.org/erwinheitzman/find-duplicate-strings.svg?branch=master)](https://travis-ci.org/erwinheitzman/find-duplicate-strings)
[![codecov](https://codecov.io/gh/erwinheitzman/find-duplicate-strings/branch/master/graph/badge.svg)](https://codecov.io/gh/erwinheitzman/find-duplicate-strings)

# find-duplicate-strings

**Easy to use CLI that finds duplicate strings in a directory and stores them in a external file for easy reference**

## Getting started

First clone the repository:

```bash
npm i -g find-duplicate-strings
```

Then run the cli:

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

You will be asked to enter the file extensions that you want to scan:

```bash
? Please provide the file extensions you want to scan or leave empty to scan all files (separated list by ;)
```

It will output a table containing it's findings:

```bash
┌─────────┬────────┐
│ (index) │ counts │
├─────────┼────────┤
│   foo   │   6    │
│   bar   │   6    │
└─────────┴────────┘
```

You will be asked to enter a path to a file that the results can be written to (json):

```bash
? Please provide a filepath to store the output.
./output
```

### License

MIT
