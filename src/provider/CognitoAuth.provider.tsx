// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useEffect, useState } from 'react';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import { Hub, HubCapsule } from '@aws-amplify/core';
import AuthContext from '../context/Auth.context';

import InternalAuthContext, { UserCredentials } from '../context/InternalAuth.context';

export interface CognitoAuthProviderProps {
  children: React.ReactNode;
  region: string;
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
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch {
    return undefined;
  }
};

const CognitoAuthProvider = ({
  children,
  region,
  userPoolId,
  userPoolWebClientId,
  handleLoginFinished,
  handleRegisterFinished,
  handleLoginAction,
  handleRegisterAction,
  handleVerificationAction,
}: CognitoAuthProviderProps) => {
  const [user, setUser] = useState<CognitoUser>();
  const [verificationCredentials, setVerificationCredentials] = useState<UserCredentials>();
  const [initFinished, setInitFinished] = useState(false);

  useEffect(() => {
    const authListener = async (data: HubCapsule) => {
      switch (data.payload.event) {
        case 'signIn':
        case 'signUp': {
          const _user = await safeGetAuthenticatedUser();

          if (!_user) {
            // Probably a verification required 'sign up'
            // Return here so that we don't break the verification flow
            return;
          }

          setUser(_user);

          if (data.payload.event === 'signUp' || verificationCredentials?.referrer === 'register') {
            handleRegisterFinished();
          } else {
            handleLoginFinished();
          }

          break;
        }
        case 'signOot': {
          setUser(undefined);
          break;
        }
        case 'configured': {
          const _user = await safeGetAuthenticatedUser();
          setUser(_user);
          setInitFinished(true);
          break;
        }
      }
    };

    Hub.listen('auth', authListener);

    return () => Hub.remove('auth', authListener);
  }, [handleLoginFinished, handleRegisterFinished, verificationCredentials]);

  useEffect(() => {
    Auth.configure({
      Auth: {
        region,
        userPoolId,
        userPoolWebClientId,
      },
    });
  }, [region, userPoolId, userPoolWebClientId]);

  const logout = async () => {
    await Auth.signOut();
  };

  const handleVerificationActionInternal = (data: UserCredentials) => {
    setVerificationCredentials(data);
    handleVerificationAction();
  };

  const internalValue = {
    user,
    verificationCredentials,
    handleLoginAction,
    handleRegisterAction,
    handleVerificationAction: handleVerificationActionInternal,
  };

  const externalValue = {
    authenticated: !!user,
    userId: user ? user.getUsername() : undefined,
    user,
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
