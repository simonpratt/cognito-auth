import React from 'react';
import qs from 'qs';
import { CognitoAuthProvider } from '../../src';
import { useNavigate } from 'react-router-dom';

const cognitoConfig = {
  userPoolId: (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_ID,
  userPoolWebClientId: (import.meta as any).env.VITE_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
};

export interface AppAuthProviderProps {
  children: React.ReactNode;
}

const AppAuthProvider = ({ children }: AppAuthProviderProps) => {
  const navigate = useNavigate();

  const handleLoginFinished = () => {
    const { redirect } = qs.parse(window.location.search, { ignoreQueryPrefix: true }) as { redirect: string };
    navigate(redirect ? redirect : '/');
  };

  const handleRegisterFinished = () => {
    const { redirect } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const query = qs.stringify({ redirect }, { addQueryPrefix: true });
    navigate(`/get-started${query}`);
  };

  const handleLoginAction = () => {
    navigate(`/login${window.location.search}`);
  };

  const handleRegisterAction = () => {
    navigate(`/register${window.location.search}`);
  };

  const handleVerificationAction = () => {
    navigate(`/verify${window.location.search}`);
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
