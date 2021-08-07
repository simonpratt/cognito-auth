## About

This package is an opinionated implementation of cognito login mainly for use in my own projects. It contains login/registration screens, a context, and some other building blocks to assist in wiring up your authentication flows.

### Constraints

This package has only been tested with email-based cognito auth

## Usage

### Step 1: Create the cognito user pool

There are some constraints required when setting up the user pool
- Choose email as the primary login method
- De-select any/all standard required attributes
- When generating an app client be sure to un-tick "generate client secret"

### Step 2: Add the CognitoAuthProvider at a high level in your app and configure with the required info
There are two broad categories of handling the auth flows that are supported

1. Route-based login/registration where you have an individual route for each of the pages. Bind navigation calls like seen below for this method
2. Storing the flow in state in a single component. This implementation would look similar but have some stored state and conditional rendering of the components

```
const cognitoConfig = {
  region: 'xxxxx',
  userPoolId: 'xxxxx',
  userPoolWebClientId: 'xxxxx',
};

const handleLoginFinished = () => {
  const { redirect } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  navigate(redirect ? redirect : '/');
};

const handleRegisterFinished = () => {
  navigate('/get-started');
};

const handleLoginAction = () => {
  const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  navigate('/login', false, params);
};

const handleRegisterAction = () => {
  const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  navigate('/register', false, params);
};

const handleVerificationAction = () => {
  const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  navigate('/verify', false, params);
};

const App = () => (
  <CognitoAuthProvider
    {...cognitoConfig}
    handleLoginFinished={handleLoginFinished}
    handleRegisterFinished={handleRegisterFinished}
    handleLoginAction={handleLoginAction}
    handleRegisterAction={handleRegisterAction}
    handleVerificationAction={handleVerificationAction}
  >
    <Router />
  </CognitoAuthProvider>
);

```

### Step 3: Add the register and login screens to your router
```
const navigateToRoot = () => {
  navigate('/', true);
};

const routes = {
  '/login': () => <LoginPage />,
  '/register': () => <RegisterPage />,
  '/verify': () => <VerificationPage />,
}
```

### Step 4: Use the _GuardedRoute_ and _UnguardedRoute_ to control auth flows within your application
```
const navigateToLogin = () => {
  const path = window.location.pathname;
  navigate('/login', false, { redirect: path });
};

const navigateToRoot = () => {
  navigate('/', true);
};

const routes = {
  '/profile': () => <GuardedRoute component={ProfilePage} onAuthRequired={navigateToLogin} />,
  '/login': () => <UnguardedRoute component={LoginPage} strict={true} onStrictRouteViolation={navigateToRoot} />,
  '/register': () => <UnguardedRoute component={RegisterPage} strict={true} onStrictRouteViolation={navigateToRoot} />,
  '/verify': () => <UnguardedRoute component={VerificationPage} strict={true} onStrictRouteViolation={navigateToRoot} />,
}
```

* _GuardedRoute_: This component can be used to trigger an action when an un-authenticated user navigates to that page
* _UnguardedRoute_: This component can be used to allow un-authenticated users to access the page. If the `strict` option is set, then authenticated users can be directed away