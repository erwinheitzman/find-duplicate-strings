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

When no arguments are passed, the CLI will ask you for the required information.

For more information about what arguments and flags are supported, use the -h or --help flag.

Example:

```bash
find-duplicate-strings . --exclusions node_modules --extensions ts,js -s
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

After that, you will be asked to enter a path for a file to be created that the results can be written to (json):

```bash
? Please provide a filepath to store the output.
./output/filename
```

This will write the output to `./output/filename.json` if the output directory exists.

## Help

Use the help flag to get more information about how to use the CLI.

```bash
find-duplicate-strings --help
```

### License

MIT
