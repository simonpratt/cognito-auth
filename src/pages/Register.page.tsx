// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { RegisterData, RegisterScreen } from '@dtdot/lego';
import Auth from '@aws-amplify/auth';
import InternalAuthContext from '../context/InternalAuth.context';

const RegisterContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
`;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { handleVerificationAction } = useContext(InternalAuthContext);

  const handleRegister = async (data: RegisterData) => {
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
      const result = await Auth.signUp(email, password);

      if (!result.userConfirmed) {
        handleVerificationAction({ email, password, referrer: 'register' });
        return;
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <RegisterContainer>
      <RegisterScreen handleRegister={handleRegister} loading={loading} error={error} />
    </RegisterContainer>
  );
};

export default RegisterPage;
