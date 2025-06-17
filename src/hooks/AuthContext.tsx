import React, { useEffect } from "react";
import AuthService from "../services/auth.service";

interface AuthContextType {
  user: any;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    // Restore login state from local storage on mount.
    const fetchAuth = async () => {
      try {
        const restoredUser = await AuthService.refreshToken();
        setUser(restoredUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAuth();
  }, []);

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

  let value = { user, signin, signout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
