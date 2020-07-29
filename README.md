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
┌─────────┬───────────────────────────────────────┬───────┐
│ (index) │                   0                   │   1   │
├─────────┼───────────────────────────────────────┼───────┤
│    0    │             './question'              │  13   │
│    1    │             './directory'             │   7   │
│    2    │              './output'               │   9   │
│    3    │              'inquirer'               │  17   │
│    4    │               './store'               │   9   │
│    5    │             './ifinding'              │   7   │
│    6    │                'File'                 │   8   │
│    7    │ 'should return the answer when it...' │   6   │
│    8    │                'dummy'                │  17   │
│    9    │               'dummy1'                │  10   │
│   10    │                 '...'                 │       │
└─────────┴───────────────────────────────────────┴───────┘
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
