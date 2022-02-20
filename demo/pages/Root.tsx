import React, { useContext } from 'react';
import { Button, Heading, PaddedLayout, Spacer, Text } from '@dtdot/lego';
import { AuthContext } from '../../src';
import authService from '../../src/services/Auth.service';

const Root = () => {
  const { userId } = useContext(AuthContext);
  return (
    <>
      <PaddedLayout>
        <Heading>Welcome to the root of the app</Heading>
        <Spacer size='1x' />
        <Text>Current user is {userId}</Text>
        <Spacer size='1x' />
        <Text>Current auth token is {authService.getCurrentUserSession()?.getAccessToken().getJwtToken()}</Text>
        <Spacer size='1x' />
        <Button onClick={() => authService.signOut()}>Sign Out</Button>
      </PaddedLayout>
    </>
  );
};

export default Root;
