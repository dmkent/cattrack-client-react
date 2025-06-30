import CONFIG from "ctrack_config";

import { checkStatus } from "../client/CatTrackAPI";

type JwtData = {
  exp: number;
  username: string;
  user_id: string;
  email: string;
};

function parseJwt(token: string) {
  if (!token || token.indexOf(".") === -1) {
    return {};
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

function login(username: string, password: string) {
  return fetch(CONFIG.API_URI + "/api/token/", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: { "Content-Type": "application/json" },
  })
    .then(checkStatus)
    .then((resp) => {
      localStorage.setItem("jwt", resp.refresh);

      const payload = parseJwt(resp.access);
      const authExpires = new Date(payload.exp * 1000);
      return {
        is_logged_in: true,
        username: payload.username,
        user_id: payload.user_id,
        email: payload.email,
        expires: authExpires,
        token: resp.access,
      };
    });
}

function refreshToken() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    return Promise.reject(new Error("No token found in local storage"));
  }

  return fetch(CONFIG.API_URI + "/api/token/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: token }),
    headers: { "Content-Type": "application/json" },
  })
    .then(checkStatus)
    .then((resp) => {
      const payload = parseJwt(resp.access);
      const authExpires = new Date(payload.exp * 1000);
      return {
        is_logged_in: true,
        username: payload.username,
        user_id: payload.user_id,
        email: payload.email,
        expires: authExpires,
        token: resp.access,
      };
    });
}

function logout() {
  localStorage.removeItem("jwt");
}

export default {
  login,
  refreshToken,
  logout,
};
