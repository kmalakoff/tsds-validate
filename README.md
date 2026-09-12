# tsds-validate

This package is an internal command adapter for [ts-dev-stack](https://www.npmjs.com/package/ts-dev-stack), not a standalone end-user command.

Install and run the parent CLI:

```bash
npm install --save-dev ts-dev-stack
tsds validate
```

Validation formats the project, rebuilds it, sorts `package.json`, checks for
unused dependencies, and regenerates API documentation. These steps can modify
project files; review the resulting diff before publishing.
