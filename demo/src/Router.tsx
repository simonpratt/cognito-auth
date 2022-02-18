import React from 'react';
import qs from 'qs';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { GuardedRoute, LoginPage, RegisterPage, UnguardedRoute, VerificationPage } from '../../src';
import Root from '../pages/Root';

const Router = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    const path = window.location.pathname;
    const query = qs.stringify({ redirect: path }, { addQueryPrefix: true });
    navigate(`/login${query}`);
  };

  const navigateToRoot = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route path='/' element={<GuardedRoute component={Root} onAuthRequired={navigateToLogin} />} />
      <Route
        path='/login'
        element={<UnguardedRoute component={LoginPage} strict={true} onStrictRouteViolation={navigateToRoot} />}
      />
      <Route
        path='/register'
        element={<UnguardedRoute component={RegisterPage} strict={true} onStrictRouteViolation={navigateToRoot} />}
      />
      <Route
        path='/verify'
        element={<UnguardedRoute component={VerificationPage} strict={true} onStrictRouteViolation={navigateToRoot} />}
      />
      <Route path='*'>Not found</Route>
    </Routes>
  );
};

export default Router;
