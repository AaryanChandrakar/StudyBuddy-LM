# Commands and Instructions for CI/CD:

## Client

Step 1:

```
npm i -D eslint prettier @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh
```

Step 2:

```
"scripts": {
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"lint": "eslint . --ext .js,.jsx",
"lint:fix": "eslint . --ext .js,.jsx --fix",
"format": "prettier --write ."
},
```

Step 3: Create .prettierrc file

```
{
  "semi": true,
  "singleQuote": false
}

```

## Server

Step 1:

```
npm i -D eslint prettier
```

Step 2:

```
"scripts": {
"start": "node src/app.js",
"dev": "nodemon src/app.js",
"lint": "eslint . --ext .js,.jsx",
"lint:fix": "eslint . --ext .js,.jsx --fix",
"format": "prettier --write ."
},
```

Step 3: Create eslint.config.js file

```
export default [
  {
    files: ["**/*.js"],
    rules: { semi: "error", "no-unused-vars": "warn" },
  },
];

```

Step 4: Create .prettierrc file

```
{
  "semi": true,
  "singleQuote": false
}

```

### Check Lint for both Client and Server

```
npm run lint
```
