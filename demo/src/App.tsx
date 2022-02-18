import React from 'react';
import AppAuthProvider from '../core/AppAuthProvider';
import RootProvider from '../core/RootProvider';
import Router from './Router';

const App = () => {
  return (
    <>
      <RootProvider>
        <AppAuthProvider>
          <Router />
        </AppAuthProvider>
      </RootProvider>
    </>
  );
};

export default App;
