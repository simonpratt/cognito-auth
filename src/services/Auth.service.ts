import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
  CognitoUserAttribute,
  ISignUpResult,
} from 'amazon-cognito-identity-js';

export type AuthEventTypes = 'signUp' | 'signIn' | 'signOut' | 'configured' | 'verificationRequired';
export interface AuthEvent {
  type: string;
  data?: any;
}

const promisifiedCognito = {
  authenticateUser: (cognitoUser: CognitoUser, email: string, password: string) => {
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    return new Promise<CognitoUserSession>((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (error) => {
          reject(error);
        },
      });
    });
  },
  registerUser: (userPool: CognitoUserPool, email: string, password: string) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    return new Promise<ISignUpResult>((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null as any, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Unexpected error'));
          return;
        }

        resolve(result);
      });
    });
  },
  refreshSession: (cognitoUser: CognitoUser, cognitoUserSession: CognitoUserSession): Promise<CognitoUserSession> => {
    return new Promise<CognitoUserSession>((resolve, reject) => {
      cognitoUser.refreshSession(cognitoUserSession.getRefreshToken(), (err) => {
        if (err) {
          reject(err);
        }

        cognitoUser.getSession((_err: any, session: CognitoUserSession) => {
          if (_err) {
            reject(_err);
          }

          resolve(session);
        });
      });
    });
  },
};

class AuthService {
  private userPool: CognitoUserPool | undefined = undefined;
  private cognitoUser: CognitoUser | undefined = undefined;
  private cognitoUserSession: CognitoUserSession | undefined = undefined;

  private authListeners: ((event: AuthEvent) => Promise<void>)[] = [];

  public async configure(_userPoolId: string, _clientId: string) {
    this.userPool = new CognitoUserPool({
      UserPoolId: _userPoolId,
      ClientId: _clientId,
    });

    await this.bootstrapUserFromStorage();
    this.emit({ type: 'configured' });
  }

  private async bootstrapUserFromStorage() {
    return new Promise<void>((resolve) => {
      if (!this.userPool) {
        resolve();
        return;
      }

      const currentUser = this.userPool.getCurrentUser();

      if (!currentUser) {
        resolve();
        return;
      }

      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          resolve();
          return;
        }

        if (!session.isValid()) {
          resolve();
          return;
        }

        this.cognitoUser = currentUser;
        this.cognitoUserSession = session;
        resolve();
      });
    });
  }

  private emit(event: AuthEvent) {
    this.authListeners.forEach((fn) => fn(event));
  }

  public listen(fn: (event: AuthEvent) => Promise<void>) {
    this.authListeners.push(fn);
  }

  public remove(fn: (event: AuthEvent) => Promise<void>) {
    this.authListeners = this.authListeners.filter((_fn) => _fn !== fn);
  }

  public getCurrentAuthenticatedUserId(): Promise<string> {
    return this.cognitoUserSession?.getAccessToken()?.payload?.username;
  }

  public async getCurrentUserSession(): Promise<CognitoUserSession | undefined> {
    if (!this.cognitoUserSession?.isValid()) {
      await this.refreshSession();
    }

    return this.cognitoUserSession;
  }

  public async refreshSession() {
    if (!this.cognitoUser || !this.cognitoUserSession) {
      return;
    }

    const newSession = await promisifiedCognito.refreshSession(this.cognitoUser, this.cognitoUserSession);
    this.cognitoUserSession = newSession;
  }

  public async signIn(email: string, password: string) {
    if (!this.userPool) {
      throw new Error('App is not configured');
    }

    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });

    try {
      const result = await promisifiedCognito.authenticateUser(cognitoUser, email, password);
      this.cognitoUser = cognitoUser;
      this.cognitoUserSession = result;
      this.emit({ type: 'signIn' });
    } catch (error: any) {
      if (error.code === 'UserNotConfirmedException') {
        this.resendSignUp(email);
        this.emit({ type: 'verificationRequired', data: { email, password } });
      } else {
        throw error;
      }
    }
  }

  public async signUp(email: string, password: string) {
    if (!this.userPool) {
      throw new Error('App is not configured');
    }

    const result = await promisifiedCognito.registerUser(this.userPool, email, password);

    if (result.userConfirmed === false) {
      this.emit({ type: 'verificationRequired', data: { email, password } });
      return;
    }

    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });
    const loggedInResult = await promisifiedCognito.authenticateUser(cognitoUser, email, password);
    this.cognitoUser = cognitoUser;
    this.cognitoUserSession = loggedInResult;
    this.emit({ type: 'signUp' });
  }

  public async signOut() {
    if (!this.cognitoUser) {
      throw new Error('User not found');
    }

    this.cognitoUser.signOut();
    this.cognitoUser = undefined;
    this.cognitoUserSession = undefined;
    this.emit({ type: 'signOut' });
  }

  public async confirmSignUp(email: string, code: string) {
    if (!this.userPool) {
      throw new Error('App is not configured');
    }

    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  public async resendSignUp(email: string) {
    if (!this.userPool) {
      throw new Error('App is not configured');
    }

    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }
}

const authService = new AuthService();
export default authService;
