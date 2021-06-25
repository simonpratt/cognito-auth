// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Auth from '@aws-amplify/auth';
import { LoginData, LoginScreen } from '@dtdot/lego';
import InternalAuthContext from '../context/InternalAuth.context';

const LoginContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
`;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { handleRegisterAction, handleVerificationAction } = useContext(InternalAuthContext);

  const handleLogin = async (data: LoginData) => {
    const email = data.email?.toLowerCase().trim();
    const password = data.password?.trim();

    if (!email) {
      setError('Email address must be provided');
      return;
    }

    if (!password) {
      setError('Password must be provided');
      return;
    }

    try {
      setLoading(true);
      await Auth.signIn(email, password);
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        await Auth.resendSignUp(email);
        handleVerificationAction({ email, password, referrer: 'login' });
        return;
      }

      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <LoginContainer>
      <LoginScreen handleLogin={handleLogin} onRegisterClicked={handleRegisterAction} loading={loading} error={error} />
    </LoginContainer>
  );
};

export default LoginPage;
