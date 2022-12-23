// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext } from 'react';
import AuthContext from '../context/Auth.context';

export interface GuardedRouteProps {
  component: React.FunctionComponent<any>;
  /** Component to render when auth is required */
  authRequiredComponent: React.FunctionComponent<any>;

  /** Pass through props from routes */
  [k: string]: any;
}

const GuardedRoute = ({
  component: Component,
  authRequiredComponent: AuthRequiredComponent,
  ...props
}: GuardedRouteProps) => {
  const { authenticated } = useContext(AuthContext);

  if (!authenticated) {
    return <AuthRequiredComponent />;
  }

  return <Component {...props} />;
};

export default GuardedRoute;
