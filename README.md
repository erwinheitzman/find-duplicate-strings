![ci](https://github.com/erwinheitzman/find-duplicate-strings/workflows/ci/badge.svg)
![codecov](https://codecov.io/gh/erwinheitzman/find-duplicate-strings/branch/master/graph/badge.svg)

# find-duplicate-strings

**Easy to use CLI that finds duplicate strings in a directory and stores them in a external file for easy reference**

Note that this does not find matches in files like grep does, instead it searches for quoted characters. In other words, this tool can be used by development teams that want to know if there's any duplicate string values in their project and if so, where these can be found.

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

Example without passing any flags or arguments (you will be asked for input):

```bash
find-duplicate-strings
```

Example with all the supported flags and arguments:

```bash
find-duplicate-strings --exclusions node_modules,coverage --extensions ts,js,json --treshold 10 --silent ./example/path
```

Breakdown of flags:

- `--exclusions node_modules,coverage` excludes any files and directories matching `node_modules` or `coverage`
- `--extensions ts,js,json` includes any files that have one of the following extentions `.ts`, `.js` or `.json`
- `--treshold 10` only outputs matches found greater than or equal to 10
- `--silent` runs the program in silent mode

Breakdown of arguments:

- `./example/path` this is the path to scan (can be absolute or relative)

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
