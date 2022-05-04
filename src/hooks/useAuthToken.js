import AuthService from '../services/auth.service';

export function useAuthToken() {
  return AuthService.restoreLogin();
}