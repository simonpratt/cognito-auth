(window as any).global = window;

export { default as AuthContext } from './context/Auth.context';
export { default as CognitoAuthProvider } from './provider/CognitoAuth.provider';

export { default as authService } from './services/Auth.service';

export { default as LoginPage } from './pages/Login.page';
export { default as RegisterPage } from './pages/Register.page';
export { default as VerificationPage } from './pages/Verification.page';

export { default as GuardedRoute } from './components/GuardedRoute.component';
export { default as UnguardedRoute } from './components/UnguardedRoute.component';
