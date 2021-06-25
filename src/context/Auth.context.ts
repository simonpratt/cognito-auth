import { createContext } from 'react';

export interface AuthContextProps {
  authenticated: boolean;
  userId?: string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  authenticated: false,
  userId: undefined,
  // eslint-disable-next-line
  logout: () => {},
});

export default AuthContext;
