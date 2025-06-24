import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IntlProvider } from "react-intl";
import { render, RenderResult } from "@testing-library/react";
import { AxiosContext } from "./hooks/AxiosContext";
import { AuthContext, AuthContextType } from "./hooks/AuthContext";
import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export function renderWithProviders(
  children: React.ReactElement,
  authState?: AuthContextType,
  configureMocks?: (mockAdapter: AxiosMockAdapter) => void,
  axiosInstance: AxiosInstance | null = null
): RenderResult {
  const queryClient = new QueryClient();

  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: "http://localhost:8000",
    });
    const mockAdapter = new AxiosMockAdapter(axiosInstance);
    if (configureMocks) {
      configureMocks(mockAdapter);
    }
  }

  return render(
    <IntlProvider locale="en-AU">
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authState ?? { user: null, loading: false, signin: jest.fn(), signout: jest.fn() }}>
          <AxiosContext.Provider value={axiosInstance}>
            {children}
          </AxiosContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </IntlProvider>
  );
}