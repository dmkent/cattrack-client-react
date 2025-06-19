import React, { createContext, useContext, useMemo } from "react";
import * as Cookies from "js-cookie";

import axios, { AxiosInstance } from "axios";
import { useAuth } from "./AuthContext";
import CONFIG from "ctrack_config";
 
export const AxiosContext = createContext<AxiosInstance>(null!);

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: CONFIG.API_URI,
    });

    instance.interceptors.request.use((config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      const csrf_token = Cookies.get("csrftoken");
      if (csrf_token) {
        config.headers["X-CSRFToken"] = csrf_token;
      }

      /* Force content type to undefined, allows browser to deal with content
         type for multipart form-data. Needs to set boundary as part of content
         type. */
      if (config.headers["Content-Type"] === 'null') {
        delete config.headers["Content-Type"];
      }

      return config;
    });

    return instance;
  }, [user]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => {
  return useContext(AxiosContext);
};