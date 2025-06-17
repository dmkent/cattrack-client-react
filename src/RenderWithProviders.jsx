import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";
import { AxiosContext } from "./hooks/AxiosContext";
import { AuthContext } from "./hooks/AuthContext";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

export function renderWithProviders(children, authState, configureMocks, axiosInstance = null) {
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
        <AuthContext.Provider value={authState}>
          <AxiosContext.Provider value={axiosInstance}>
            {children}
          </AxiosContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </IntlProvider>
  );
}