import { Alert, PaddedLayout } from '@dtdot/lego';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/Auth.context';

export interface UnguardedRouteProps {
  component: React.FunctionComponent<any>;
  /** If strict is set, an authenticated user wont be able to access this page */
  strict?: boolean;
  /** Component to render when an authenticated user tries to access this page */
  strictRouteViolationComponent?: React.FunctionComponent<any>;

  /** Pass through props from routes */
  [k: string]: any;
}

const UnguardedRoute = ({
  component: Component,
  strict,
  strictRouteViolationComponent: StrictRouteViolationComponent,
  ...props
}: UnguardedRouteProps) => {
  const { authenticated } = useContext(AuthContext);
  const [routeViolationBehavior, setRouteViolationBehavior] = useState<'LOADING' | 'REDIRECT' | 'RENDER'>('LOADING');

  useEffect(() => {
    // Check only once when the page first loads
    // Some unguarded pages perform authentication actions and we want to allow them to control the navigation afterwards
    if (routeViolationBehavior === 'LOADING') {
      if (authenticated && strict) {
        setRouteViolationBehavior('REDIRECT');
      } else {
        setRouteViolationBehavior('RENDER');
      }
    }
  }, [authenticated, strict, routeViolationBehavior, setRouteViolationBehavior]);

  if (routeViolationBehavior === 'LOADING') {
    return null;
  }

  if (routeViolationBehavior === 'REDIRECT') {
    return StrictRouteViolationComponent ? (
      <StrictRouteViolationComponent />
    ) : (
      <PaddedLayout>
        <Alert message='You are not allowed to view this page' variant='info' />
      </PaddedLayout>
    );
  }

  return <Component {...props} />;
};

export default UnguardedRoute;
