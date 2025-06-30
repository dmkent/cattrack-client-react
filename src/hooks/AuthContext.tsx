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
  authData: AuthData | null;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  refresh: () => Promise<AuthData | null>;
  loading: boolean;
}

export let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [authData, setAuthData] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<boolean>(true);

  let refresh = async () => {
    let restoredData = authData;
    try {
      restoredData = await AuthService.refreshToken();
      setAuthData(restoredData);
    } catch {
      setAuthData(null);
    } finally {
      setLoading(false);
    }
    return restoredData;
  };

  let signin = (username: string, password: string, callback: VoidFunction) => {
    return AuthService.login(username, password).then((data) => {
      setAuthData(data);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    AuthService.logout();
    setAuthData(null);
    callback();
  };

  useEffect(() => {
    // Restore login state from local storage on mount.
    refresh();
  }, []);

  let value = { authData, signin, signout, refresh, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
