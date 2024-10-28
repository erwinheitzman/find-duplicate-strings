![ci](https://github.com/erwinheitzman/find-duplicate-strings/workflows/ci/badge.svg)
![codecov](https://codecov.io/gh/erwinheitzman/find-duplicate-strings/branch/master/graph/badge.svg)

# find-duplicate-strings

**Easy to use CLI that finds duplicate strings in a directory or file and stores the results in a external file for easy reference**

Note that this does not find matches in files like grep does, instead it searches for (double/single) quoted characters. In other words, this tool can be used by development teams that want to know if there's any duplicate string values in their project and if so, where these can be found.

## Getting started

Install:

```bash
npm i -g find-duplicate-strings
```

Run:

```bash
find-duplicate-strings ./
```

Breakdown of flags:

- `--exclusions` excludes any files and directories that match
- `--extensions` includes any files that match these extensions
- `--treshold` only output strings that are duplicated for at least this number of times
- `--output` this allows you to change the default filename for the output
- `--interactive` runs the program in interactive mode mode

Breakdown of arguments:

- `./example/path` this is the path to scan (can be absolute or relative)

For information about what arguments and flags are supported, use the `--help` flag.

The result of the scan will be stored in file called fds-output.json or fds-output-<num>.json if it already exists.

## Help

Use the help flag to get more information about how to use the CLI.

```bash
find-duplicate-strings --help
```

### License

MIT
