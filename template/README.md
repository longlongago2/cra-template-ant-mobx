This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run elcc`

rimraf node_modules/.cache/eslint-loader

## Configuration

### Theme of Ant Design

Change the `theme` key in package.json

This theme variable will be automatically applied to all `*.less` files.

If you want to add custom theme variables, please add them in the `src/theme.less`.

### Public path

Change the `homepage` key in package.json. 

By default, CRA assumes your app will be deployed at the root of a domain, e.g. https://www.my-app.com/. If your app is deployed at a sub-path, you will need to specify that sub-path using this option. For example, if your app is deployed at https://www.foobar.com/my-app/, set publicPath to '/my-app/'.

### HTML Website name

.env `REACT_APP_WEBSITE_NAME` will control the html title.

