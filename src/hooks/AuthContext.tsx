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
  user: AuthData | null;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  refresh: () => Promise<AuthData | null>;
  loading: boolean;
}

export let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<boolean>(true);

  let refresh = async () => {
    let restoredUser = user;
    try {
      restoredUser = await AuthService.refreshToken();
      setUser(restoredUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
    return restoredUser;
  };

  let signin = (username: string, password: string, callback: VoidFunction) => {
    return AuthService.login(username, password).then((data) => {
      setUser(data);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    AuthService.logout();
    setUser(null);
    callback();
  };

  useEffect(() => {
    // Restore login state from local storage on mount.
    refresh();
  }, []);

  let value = { user, signin, signout, refresh, loading };
  console.log("Expires:", user.expires);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
