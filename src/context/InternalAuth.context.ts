import { CognitoUser } from '@aws-amplify/auth';
import { createContext } from 'react';

export interface UserCredentials {
  email: string;
  password: string;
  referrer: 'login' | 'register';
}

export interface InternalAuthContextProps {
  user?: CognitoUser;
  handleLoginAction: () => void;
  handleRegisterAction: () => void;
  handleVerificationAction: (details: UserCredentials) => void;

  /** Persist the verification info between stages */
  verificationCredentials?: UserCredentials;
}

const InternalAuthContext = createContext<InternalAuthContextProps>({
  user: undefined,
  // eslint-disable-next-line
  handleLoginAction: () => {},
  // eslint-disable-next-line
  handleRegisterAction: () => {},
  // eslint-disable-next-line
  handleVerificationAction: () => {},

  verificationCredentials: undefined,
});

export default InternalAuthContext;
