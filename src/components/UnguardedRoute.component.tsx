// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/Auth.context';

export interface UnguardedRouteProps {
  component: React.FunctionComponent<any>;
  /** If strict is set, authenticated user wont be able to access this page */
  strict?: boolean;
  /** Handler for strict route violations */
  onStrictRouteViolation?: () => void;

  /** Pass through props from routes */
  [k: string]: any;
}

const UnguardedRoute = ({ component: Component, strict, onStrictRouteViolation, ...props }: UnguardedRouteProps) => {
  const { authenticated } = useContext(AuthContext);
  const [delayWaited, setDelayWaited] = useState(false);

  useEffect(() => {
    if (authenticated && strict && onStrictRouteViolation && delayWaited) {
      onStrictRouteViolation();
    } else if (authenticated && strict && onStrictRouteViolation) {
      setTimeout(() => setDelayWaited(true), 50);
    } else {
      setDelayWaited(false);
    }
  }, [authenticated, strict, onStrictRouteViolation, delayWaited]);

  return <Component {...props} />;
};

export default UnguardedRoute;
