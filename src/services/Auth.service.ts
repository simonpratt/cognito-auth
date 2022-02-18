import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

export type AuthEvent = 'signUp' | 'signIn' | 'signOut' | 'configured' | 'verificationRequired';

class AuthService {
  private userPoolId: string | undefined = undefined;
  private clientId: string | undefined = undefined;
  private userPool: CognitoUserPool | undefined = undefined;

  private authListeners: ((event: AuthEvent) => Promise<void>)[] = [];

  public configure(_userPoolId: string, _clientId: string) {
    this.userPoolId = _userPoolId;
    this.clientId = _clientId;

    this.userPool = new CognitoUserPool({
      UserPoolId: _userPoolId,
      ClientId: _clientId,
    });

    this.emit('configured');
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
    throw new Error('test');
  }

  public async signIn(email: string, password: string) {
    if (!this.userPool) {
      throw new Error('App is not configured');
    }

    const cognitoUser = new CognitoUser({ Username: email, Pool: this.userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          // const { accessToken, } = result;
          console.log(result.getAccessToken().getJwtToken());
        },
        onFailure: (error) => reject(error),
      });
    })
    
  }

  public async signOut() {}

  public async resendSignUp(email: string) {}
}

const instance = new AuthService();
export default instance;
