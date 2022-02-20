import { createContext } from 'react';

export interface UserCredentials {
  email: string;
  password: string;
  referrer: 'login' | 'register';
}

export interface InternalAuthContextProps {
  userId?: string;
  handleLoginAction: () => void;
  handleRegisterAction: () => void;

  /** Persist the verification info between stages */
  verificationCredentials?: UserCredentials;
}

const InternalAuthContext = createContext<InternalAuthContextProps>({
  userId: undefined,
  // eslint-disable-next-line
  handleLoginAction: () => {},
  // eslint-disable-next-line
  handleRegisterAction: () => {},

  verificationCredentials: undefined,
});

export default InternalAuthContext;
