import { checkStatus } from "../client/CatTrackAPI";
import CONFIG from "config";

function parseJwt(token) {
  if (!token) {
    return {};
  }

  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

function dummyLogin(dataOverride) {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 2);
  let data = dataOverride;
  if (!data) {
    data = {
      exp: expiry.valueOf() / 1000,
      username: "A User",
      user_id: "aid",
      email: "noone@nowhere.com",
    };
  }

  let dataStr = JSON.stringify(data);
  let encoded = window.btoa(dataStr).replace("/", "_").replace("+", "-");
  localStorage.setItem("jwt", `a.${encoded}.c`);
}

function login(username, password) {
  return fetch(CONFIG.API_URI + "/api-token-auth/", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    headers: { "Content-Type": "application/json" },
  })
    .then(checkStatus)
    .then((resp) => {
      localStorage.setItem("jwt", resp.token);

      return {
        token: resp.token,
      };
    });
}

function restoreLogin() {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return {
      is_logged_in: false,
    };
  }

  const payload = parseJwt(token);
  const authExpires = new Date(payload.exp * 1000);
  if (authExpires <= new Date()) {
    console.log("Auth expired. Expiry: " + authExpires);
    // Do more to ensure logout?;
    return {
      is_logged_in: false,
      expires: authExpires,
    };
  }

  return {
    is_logged_in: true,
    username: payload.username,
    user_id: payload.user_id,
    email: payload.email,
    expires: authExpires,
    token: token,
  };
}

function logout() {
  localStorage.removeItem("jwt");
}

export default {
  login,
  dummyLogin,
  restoreLogin,
  logout,
};
