// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { VerificationData, VerificationScreen } from '@dtdot/lego';
import InternalAuthContext from '../context/InternalAuth.context';
import authService from '../services/Auth.service';

const VerificationContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
`;

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { verificationCredentials, handleLoginAction } = useContext(InternalAuthContext);

  useEffect(() => {
    if (!verificationCredentials) {
      handleLoginAction();
    }
  }, [verificationCredentials, handleLoginAction]);

  const handleVerification = async (data: VerificationData) => {
    const code = data.code?.trim();

    if (!verificationCredentials) {
      return;
    }

    const { email, password } = verificationCredentials;

    if (code) {
      try {
        setLoading(true);
        await authService.confirmSignUp(email, code);
        await authService.signIn(email, password);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <VerificationContainer>
      <VerificationScreen
        error={error}
        loading={loading}
        message='We just sent a verification code to your email! Enter it here to verify your account.'
        handleVerification={handleVerification}
      />
    </VerificationContainer>
  );
};

export default VerificationPage;
