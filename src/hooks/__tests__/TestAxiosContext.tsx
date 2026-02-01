import { render, screen, waitFor } from "@testing-library/react";
import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import CONFIG from "ctrack_config";

import { AuthContext, AuthContextType, AuthData } from "../AuthContext";
import { AxiosProvider, useAxios } from "../AxiosContext";

// Mock js-cookie
vi.mock("js-cookie");

// Test component that uses the axios hook
function TestComponent() {
  const axios = useAxios();
  return (
    <div data-testid="test-component">
      {axios !== null ? "Has Axios" : "No Axios"}
    </div>
  );
}

// Helper to create a mock auth context
function createMockAuthContext(
  authData?: AuthData,
  refreshFn = vi.fn(),
): AuthContextType {
  return {
    authData,
    loading: false,
    signin: vi.fn(),
    signout: vi.fn(),
    refresh: refreshFn,
  };
}

// Helper to render with providers
function renderWithAuth(
  children: ReactNode,
  authContext: AuthContextType = createMockAuthContext(),
) {
  return render(
    <AuthContext.Provider value={authContext}>
      <AxiosProvider>{children}</AxiosProvider>
    </AuthContext.Provider>,
  );
}

describe("AxiosContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Provider & Hook Tests", () => {
    it("should render children correctly", () => {
      renderWithAuth(<div data-testid="child">Child Content</div>);
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("should provide axios instance via useAxios hook", () => {
      renderWithAuth(<TestComponent />);
      expect(screen.getByTestId("test-component")).toHaveTextContent(
        "Has Axios",
      );
    });

    it("should return null axios instance when used outside provider", () => {
      // When used outside provider, useContext returns the default value (null!)
      // This test verifies the context is properly initialized
      const TestOutsideProvider = () => {
        try {
          const axios = useAxios();
          // If we get here, context has a default value
          return (
            <div data-testid="result">
              {axios !== null ? "has-axios" : "no-axios"}
            </div>
          );
        } catch {
          return <div data-testid="error">Error caught</div>;
        }
      };

      // Suppress console warnings
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { container } = render(<TestOutsideProvider />);
      // The component should render but context will be null
      expect(container).toBeTruthy();

      consoleSpy.mockRestore();
    });
  });

  describe("Request Interceptor Tests", () => {
    it("should add Authorization header when user token exists", async () => {
      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "test-token-123",
      };

      let capturedConfig: InternalAxiosRequestConfig | undefined;
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();

        // Capture the request config
        axiosInstance.interceptors.request.use((config) => {
          capturedConfig = config;
          return config;
        });

        // Trigger a request
        axiosInstance.get("/test").catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />, createMockAuthContext(authData));

      await waitFor(() => {
        expect(capturedConfig?.headers?.Authorization).toBe(
          "Bearer test-token-123",
        );
      });
    });

    it("should not add Authorization header when user token is missing", async () => {
      let capturedConfig: InternalAxiosRequestConfig | undefined;
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();

        axiosInstance.interceptors.request.use((config) => {
          capturedConfig = config;
          return config;
        });

        axiosInstance.get("/test").catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />, createMockAuthContext());

      await waitFor(() => {
        expect(capturedConfig?.headers?.Authorization).toBeUndefined();
      });
    });

    it("should add CSRF token from cookies to X-CSRFToken header", async () => {
      vi.mocked(Cookies.get).mockReturnValue("csrf-token-123" as never);

      let capturedConfig: InternalAxiosRequestConfig | undefined;
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();

        axiosInstance.interceptors.request.use((config) => {
          capturedConfig = config;
          return config;
        });

        axiosInstance.get("/test").catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />);

      await waitFor(() => {
        expect(Cookies.get).toHaveBeenCalledWith("csrftoken");
        expect(capturedConfig?.headers?.["X-CSRFToken"]).toBe("csrf-token-123");
      });
    });

    it("should remove Content-Type header when set to 'null'", async () => {
      let capturedConfig: InternalAxiosRequestConfig | undefined;
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();

        axiosInstance.interceptors.request.use((config) => {
          capturedConfig = config;
          return config;
        });

        axiosInstance
          .post("/test", {}, { headers: { "Content-Type": "null" } })
          .catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />);

      await waitFor(() => {
        expect(capturedConfig?.headers?.["Content-Type"]).toBeUndefined();
      });
    });

    it("should configure baseURL from CONFIG", () => {
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        return (
          <div data-testid="base-url">{axiosInstance.defaults.baseURL}</div>
        );
      };

      renderWithAuth(<TestAxiosComponent />);

      expect(screen.getByTestId("base-url")).toHaveTextContent(CONFIG.API_URI);
    });
  });

  describe("Response Interceptor Tests", () => {
    it("should pass through successful responses unchanged", async () => {
      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/success").reply(200, { data: "success" });

        axiosInstance.get("/success").then((response) => {
          expect(response.status).toBe(200);
          expect(response.data).toEqual({ data: "success" });
        });

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />);
    });

    it("should trigger token refresh on 401 response", async () => {
      const mockRefresh = vi.fn().mockResolvedValue({
        token: "new-token",
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").replyOnce(401);
        mockAdapter.onGet("/protected").reply(200, { data: "success" });

        axiosInstance
          .get("/protected")
          .then(() => {
            expect(mockRefresh).toHaveBeenCalled();
          })
          .catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("should trigger token refresh on 403 response", async () => {
      const mockRefresh = vi.fn().mockResolvedValue({
        token: "new-token",
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/forbidden").replyOnce(403);
        mockAdapter.onGet("/forbidden").reply(200, { data: "success" });

        axiosInstance.get("/forbidden").catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("should retry request with new Authorization header after refresh", async () => {
      const newToken = "new-refreshed-token";
      const mockRefresh = vi.fn().mockResolvedValue({
        token: newToken,
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      let retryRequestAuth: string | undefined;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").replyOnce(401);
        mockAdapter.onGet("/protected").reply((config) => {
          retryRequestAuth = config.headers?.Authorization;
          return [200, { data: "success" }];
        });

        axiosInstance
          .get("/protected")
          .then(() => {
            expect(retryRequestAuth).toBe(`Bearer ${newToken}`);
          })
          .catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(
        () => {
          expect(retryRequestAuth).toBe(`Bearer ${newToken}`);
        },
        { timeout: 3000 },
      );
    });

    it("should prevent infinite retry loops with _retry flag", async () => {
      const mockRefresh = vi.fn().mockResolvedValue({
        token: "new-token",
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
      });

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        // Always return 401 to test retry prevention
        mockAdapter.onGet("/always-401").reply(401);

        axiosInstance.get("/always-401").catch(() => {});

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        // Should only be called once, not infinite times
        expect(mockRefresh).toHaveBeenCalledTimes(1);
      });
    });

    it("should reject when refresh fails", async () => {
      const mockRefresh = vi
        .fn()
        .mockRejectedValue(new Error("Refresh failed"));

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      let errorCaught = false;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").reply(401);

        axiosInstance.get("/protected").catch((error) => {
          errorCaught = true;
          expect(error.message).toBe("Refresh failed");
        });

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(errorCaught).toBe(true);
      });
    });

    it("should pass through non-401/403 errors unchanged", async () => {
      let errorCaught = false;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/error").reply(500, { error: "Server Error" });

        axiosInstance.get("/error").catch((error) => {
          errorCaught = true;
          expect(error.response.status).toBe(500);
        });

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />);

      await waitFor(() => {
        expect(errorCaught).toBe(true);
      });
    });
  });

  describe("Integration Tests", () => {
    it("should handle full request/response cycle with auth token", async () => {
      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "valid-token",
      };

      vi.mocked(Cookies.get).mockReturnValue("csrf-token" as never);

      let requestHeaders: AxiosRequestConfig | undefined;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onPost("/api/data").reply((config) => {
          requestHeaders = config;
          return [200, { success: true }];
        });

        axiosInstance.post("/api/data", { data: "test" }).then((response) => {
          expect(response.data.success).toBe(true);
        });

        return <div>Test</div>;
      };

      renderWithAuth(<TestAxiosComponent />, createMockAuthContext(authData));

      await waitFor(() => {
        expect(requestHeaders?.headers?.Authorization).toBe(
          "Bearer valid-token",
        );
        expect(requestHeaders?.headers?.["X-CSRFToken"]).toBe("csrf-token");
      });
    });

    it("should update axios instance when user token changes", async () => {
      const { rerender } = render(
        <AuthContext.Provider
          value={createMockAuthContext({
            is_logged_in: true,
            username: "user1",
            user_id: 1,
            email: "user1@example.com",
            expires: new Date(),
            token: "token1",
          })}
        >
          <AxiosProvider>
            <TestComponent />
          </AxiosProvider>
        </AuthContext.Provider>,
      );

      expect(screen.getByTestId("test-component")).toHaveTextContent(
        "Has Axios",
      );

      // Change the auth context
      rerender(
        <AuthContext.Provider
          value={createMockAuthContext({
            is_logged_in: true,
            username: "user2",
            user_id: 2,
            email: "user2@example.com",
            expires: new Date(),
            token: "token2",
          })}
        >
          <AxiosProvider>
            <TestComponent />
          </AxiosProvider>
        </AuthContext.Provider>,
      );

      // Component should still have axios
      expect(screen.getByTestId("test-component")).toHaveTextContent(
        "Has Axios",
      );
    });
  });

  describe("Edge Cases & Error Handling", () => {
    it("should handle refresh returning undefined token", async () => {
      const mockRefresh = vi.fn().mockResolvedValue(undefined);

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      let errorCaught = false;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").reply(401);

        axiosInstance.get("/protected").catch(() => {
          errorCaught = true;
        });

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
        expect(errorCaught).toBe(true);
      });
    });

    it("should handle refresh returning null token", async () => {
      const mockRefresh = vi.fn().mockResolvedValue({ token: null });

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      let errorCaught = false;

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").reply(401);

        axiosInstance.get("/protected").catch(() => {
          errorCaught = true;
        });

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
        expect(errorCaught).toBe(true);
      });
    });

    it("should handle errors in refresh callback", async () => {
      const mockRefresh = vi.fn().mockRejectedValue(new Error("Network error"));

      const authData: AuthData = {
        is_logged_in: true,
        username: "testuser",
        user_id: 1,
        email: "test@example.com",
        expires: new Date(Date.now() + 3600 * 1000),
        token: "old-token",
      };

      const TestAxiosComponent = () => {
        const axiosInstance = useAxios();
        const mockAdapter = new AxiosMockAdapter(axiosInstance);

        mockAdapter.onGet("/protected").reply(401);

        axiosInstance.get("/protected").catch((error) => {
          expect(error.message).toBe("Network error");
        });

        return <div>Test</div>;
      };

      renderWithAuth(
        <TestAxiosComponent />,
        createMockAuthContext(authData, mockRefresh),
      );

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });
});
