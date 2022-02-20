// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useEffect, useState } from 'react';
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

  // Weird useState hack to fix what seems to be an issue with react router?
  // Navigate must be called inside useEffect, but it already was
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (authRequired) {
      onAuthRequired();
    }
  }, [authRequired, onAuthRequired]);

  useEffect(() => {
    if (!authenticated) {
      setAuthRequired(true);
    }
  }, [authenticated, onAuthRequired]);

  if (!authenticated) {
    return null;
  }

  return <Component {...props} />;
};

export default GuardedRoute;
