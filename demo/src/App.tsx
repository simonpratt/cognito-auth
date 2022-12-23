import { Alert, PaddedLayout } from '@dtdot/lego';
import React from 'react';
import AppAuthProvider from '../core/AppAuthProvider';
import RootProvider from '../core/RootProvider';
import Router from './Router';

const App = () => {
  const userPool = (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_ID;
  const clientId = (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID;

  if (!userPool || !clientId) {
    return (
      <RootProvider>
        <PaddedLayout>
          <Alert
            message='Missing environment! Please check the ".env.example" file and populate a ".env" file with the corresponding values'
            variant='warn'
          />
        </PaddedLayout>
      </RootProvider>
    );
  }

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
