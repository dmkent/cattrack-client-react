import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "react-intl";
import { render, RenderResult } from "@testing-library/react";
import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { vi } from "vitest";

import { AxiosContext } from "./hooks/AxiosContext";
import { AuthContext, AuthContextType } from "./hooks/AuthContext";

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
              user: null,
              loading: false,
              signin: vi.fn(),
              signout: vi.fn(),
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
