import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderResult } from "@testing-library/react";
import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import React from "react";
import { IntlProvider } from "react-intl";
import { vi } from "vitest";

import { AuthContext, AuthContextType } from "./hooks/AuthContext";
import { AxiosContext } from "./hooks/AxiosContext";

export function renderWithProviders(
  children: React.ReactElement,
  authState?: AuthContextType,
  configureMocks?: (mockAdapter: AxiosMockAdapter) => void,
  axiosInstance: AxiosInstance | null = null,
): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

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
        <AuthContext.Provider
          value={
            authState ?? {
              authData: undefined,
              loading: false,
              signin: vi.fn(),
              signout: vi.fn(),
              refresh: vi.fn(),
            }
          }
        >
          <AxiosContext.Provider value={axiosInstance}>
            {children}
          </AxiosContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </IntlProvider>,
  );
}
