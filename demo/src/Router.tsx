import React, { useEffect } from 'react';
import qs from 'qs';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { GuardedRoute, LoginPage, RegisterPage, UnguardedRoute, VerificationPage } from '../../src';
import Root from '../pages/Root';

const NavigateToRoot = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};

const NavigateToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    const query = qs.stringify({ redirect: path }, { addQueryPrefix: true });
    navigate(`/login${query}`);
  }, [navigate]);

  return null;
};

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<GuardedRoute component={Root} authRequiredComponent={NavigateToLogin} />} />
      <Route
        path='/login'
        element={<UnguardedRoute component={LoginPage} strict={true} strictRouteViolationComponent={NavigateToRoot} />}
      />
      <Route
        path='/register'
        element={
          <UnguardedRoute component={RegisterPage} strict={true} strictRouteViolationComponent={NavigateToRoot} />
        }
      />
      <Route
        path='/verify'
        element={
          <UnguardedRoute component={VerificationPage} strict={true} strictRouteViolationComponent={NavigateToRoot} />
        }
      />
      <Route path='*'>Not found</Route>
    </Routes>
  );
};

export default Router;
