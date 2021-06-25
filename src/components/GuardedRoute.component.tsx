// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/Auth.context';

export interface GuardedRouteProps {
  component: React.FunctionComponent<any>;
  /** Handler for when auth is required */
  onAuthRequired: () => void;

  /** Pass through props from routes */
  [k: string]: any;
}

const GuardedRoute = ({ component: Component, onAuthRequired, ...props }: GuardedRouteProps) => {
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!authenticated) {
      onAuthRequired();
    }
  }, [authenticated, onAuthRequired]);

  if (!authenticated) {
    return null;
  }

  return <Component {...props} />;
};

export default GuardedRoute;
