import { Alert, PaddedLayout } from '@dtdot/lego';
import React, { useContext } from 'react';
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

  if (authenticated && strict) {
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
