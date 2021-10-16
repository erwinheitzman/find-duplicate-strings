# Contributing

This file contains all the information you need to get started contributing to this project.

If there is any information missing that prevents you from sending in a pull request, please let me know by creating an issue over [here](https://github.com/erwinheitzman/find-duplicate-strings/issues).

Also if there is anything that could be simplified, also please let me know as well.

## Set Up Project

To set up the project follow these simple steps:

- Fork the project.

- Clone the project somewhere on your computer

```bash
git clone git@github.com:<your-username>/find-duplicate-strings.git
```

- If you need to update your fork you can do so following the steps [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)

- Install dependencies:

```bash
npm i
```

- Run tests:

```bash
npm t
```

You can also use watch mode

```bash
npm t -- --watch #runs jest -o by default
npm t -- --watchAll #runs all tests
```

## Debugging

When you want to run Jest in debug mode, run the following:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand [any other arguments here]
or on Windows
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand [any other arguments here]
```
