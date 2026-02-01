import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useMemo, ReactNode } from "react";

import CONFIG from "ctrack_config";

import { useAuth } from "./AuthContext";

export const AxiosContext = createContext<AxiosInstance>(null!);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const { authData: user, refresh } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: CONFIG.API_URI,
    });

    instance.interceptors.request.use((config) => {
      if (!config.headers.Authorization && user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      const csrf_token = Cookies.get("csrftoken");
      if (csrf_token) {
        config.headers["X-CSRFToken"] = csrf_token;
      }

      /* Force content type to undefined, allows browser to deal with content
         type for multipart form-data. Needs to set boundary as part of content
         type. */
      if (config.headers["Content-Type"] === "null") {
        delete config.headers["Content-Type"];
      }

      return config;
    });

    instance.interceptors.response.use(
      (response) => response, // Directly return successful responses.
      async (error) => {
        const originalRequest = error.config;
        if (
          (error.response.status === 401 || error.response.status == 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
          try {
            const data = await refresh();

            if (data?.token) {
              // Update the authorization header with the new access token.
              originalRequest.headers.Authorization = `Bearer ${data.token}`;

              return instance(originalRequest); // Retry the original request with the new access token.
            }
          } catch (refreshError) {
            // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error); // For all other errors, return the error as is.
      },
    );

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
