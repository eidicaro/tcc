import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, apiRoot, ensureCsrfCookie, getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await api.get("/auth/me");
      setUser(response.data?.user ?? response.data ?? null);
      setStatus("authenticated");
      return true;
    } catch (requestError) {
      if ([401, 403].includes(requestError.response?.status)) {
        setUser(null);
        setStatus("guest");
        return false;
      }

      setStatus("error");
      setError(getErrorMessage(
        requestError,
        "Não foi possível validar sua sessão. Verifique a conexão e tente novamente.",
      ));
      return false;
    }
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setStatus("guest");
          setError("");
        }
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ email, password }) => {
    try {
      await apiRoot.get("/sanctum/csrf-cookie");
      const response = await apiRoot.post("/login", { email, password });
      const authenticatedUser = response.data?.user ?? null;
      setUser(authenticatedUser);
      setStatus("authenticated");
      setError("");
      return authenticatedUser;
    } catch (error) {
      setUser(null);
      setStatus("guest");
      setError("");
      throw new Error(getErrorMessage(error, "E-mail ou senha inválidos."));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await ensureCsrfCookie();
      await apiRoot.post("/logout");
      setUser(null);
      setStatus("guest");
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setStatus("guest");
        setError("");
        return;
      }
      throw new Error(getErrorMessage(error, "Não foi possível encerrar a sessão com segurança."));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      refresh,
    }),
    [error, login, logout, refresh, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
