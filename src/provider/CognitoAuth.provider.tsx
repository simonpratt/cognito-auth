// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useEffect, useState } from 'react';
import AuthContext from '../context/Auth.context';

import InternalAuthContext, { UserCredentials } from '../context/InternalAuth.context';
import AuthService, { AuthEvent } from '../services/Auth.service';

export interface CognitoAuthProviderProps {
  children: React.ReactNode;
  userPoolId: string;
  userPoolWebClientId: string;

  // Functions to define linking of pages
  handleLoginFinished: () => void;
  handleRegisterFinished: () => void;

  // Functions to handle "route" changes within auth
  handleLoginAction: () => void;
  handleRegisterAction: () => void;
  handleVerificationAction: () => void;
}

const safeGetAuthenticatedUser = async () => {
  try {
    const userId = await AuthService.getCurrentAuthenticatedUserId();
    return userId;
  } catch {
    return undefined;
  }
};

const CognitoAuthProvider = ({
  children,
  userPoolId,
  userPoolWebClientId,
  handleLoginFinished,
  handleRegisterFinished,
  handleLoginAction,
  handleRegisterAction,
  handleVerificationAction,
}: CognitoAuthProviderProps) => {
  const [userId, setUserId] = useState<string>();
  const [verificationCredentials, setVerificationCredentials] = useState<UserCredentials>();
  const [initFinished, setInitFinished] = useState(false);

  useEffect(() => {
    const authListener = async (event: AuthEvent) => {
      switch (event.type) {
        case 'verificationRequired':
          setVerificationCredentials(event.data);
          handleVerificationAction();
          break;
        case 'signIn': {
          const _userId = await safeGetAuthenticatedUser();
          setUserId(_userId);
          setVerificationCredentials(undefined);
          handleLoginFinished();
          break;
        }
        case 'signUp': {
          const _userId = await safeGetAuthenticatedUser();
          setUserId(_userId);
          setVerificationCredentials(undefined);
          handleRegisterFinished();
          break;
        }
        case 'signOut': {
          setUserId(undefined);
          break;
        }
        case 'configured': {
          const _userId = await safeGetAuthenticatedUser();
          setUserId(_userId);
          setInitFinished(true);
          break;
        }
      }
    };

    AuthService.listen(authListener);

    return () => AuthService.remove(authListener);
  }, [handleLoginFinished, handleRegisterFinished, handleVerificationAction]);

  useEffect(() => {
    AuthService.configure(userPoolId, userPoolWebClientId);
  }, [userPoolId, userPoolWebClientId]);

  const logout = async () => {
    await AuthService.signOut();
  };

  const internalValue = {
    userId,
    verificationCredentials,
    handleLoginAction,
    handleRegisterAction,
  };

  const externalValue = {
    authenticated: !!userId,
    userId,
    logout,
  };

  if (!initFinished) {
    return null;
  }

  return (
    <InternalAuthContext.Provider value={internalValue}>
      <AuthContext.Provider value={externalValue}>{children}</AuthContext.Provider>
    </InternalAuthContext.Provider>
  );
};

export default CognitoAuthProvider;
