import React from 'react';
import qs from 'qs';
import { CognitoAuthProvider } from '../../src';

const cognitoConfig = {
  userPoolId: (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
};

export interface AppAuthProviderProps {
  children: React.ReactNode;
}

const AppAuthProvider = ({ children }: AppAuthProviderProps) => {
  const handleLoginFinished = () => {
    const { redirect } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log(redirect ? redirect : '/');
  };

  const handleRegisterFinished = () => {
    const { redirect } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log('/get-started', false, { redirect });
  };

  const handleLoginAction = () => {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log('/login', false, params);
  };

  const handleRegisterAction = () => {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log('/register', false, params);
  };

  const handleVerificationAction = () => {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log('/verify', false, params);
  };

  return (
    <CognitoAuthProvider
      {...cognitoConfig}
      handleLoginFinished={handleLoginFinished}
      handleRegisterFinished={handleRegisterFinished}
      handleLoginAction={handleLoginAction}
      handleRegisterAction={handleRegisterAction}
      handleVerificationAction={handleVerificationAction}
    >
      {children}
    </CognitoAuthProvider>
  );
};

export default AppAuthProvider;
