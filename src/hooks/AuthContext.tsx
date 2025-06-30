import React, { useEffect } from "react";

import AuthService from "../services/auth.service";

export interface AuthData {
  is_logged_in: boolean;
  username: string;
  user_id: number;
  email: string;
  expires: Date;
  token: string;
}

export interface AuthContextType {
  authData: AuthData | undefined;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  refresh: () => Promise<AuthData | undefined>;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = React.useState<AuthData>();
  const [loading, setLoading] = React.useState<boolean>(true);

  const refresh = async () => {
    let restoredData = authData;
    try {
      restoredData = await AuthService.refreshToken();
      setAuthData(restoredData);
    } catch {
      setAuthData(undefined);
    } finally {
      setLoading(false);
    }
    return restoredData;
  };

  const signin = (
    username: string,
    password: string,
    callback: VoidFunction,
  ) => {
    return AuthService.login(username, password).then((data) => {
      setAuthData(data);
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    AuthService.logout();
    setAuthData(undefined);
    callback();
  };

  useEffect(() => {
    // Restore login state from local storage on mount.
    refresh();
  }, []);

  const value = { authData, signin, signout, refresh, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
