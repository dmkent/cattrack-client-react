import React, { useEffect } from "react";
import AuthService from "../services/auth.service";

interface AuthContextType {
  user: any;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    // Restore login state from local storage on mount.
    AuthService.refreshToken().then((restoredUser) => {
      setUser(restoredUser);
    }).catch(() => {
      setUser(null);
    });
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

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}