import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { UserRole } from "./UserRole";

type DecodedToken = {
  exp: number;
  role: UserRole;
  email: string;
};
export const TOKEN_KEY = "access_token";

export const checkTokenValidity = (unauthorizedCallback: () => void) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    unauthorizedCallback();
    return;
  }
  const decodedToken = jwtDecode(token) as DecodedToken;

  const currentTime = Date.now() / 1000;

  if (decodedToken.exp && decodedToken.exp < currentTime) {
    localStorage.removeItem(TOKEN_KEY);
    unauthorizedCallback();
  } else {
    const timeout = decodedToken.exp * 1000 - currentTime * 1000;
    setTimeout(() => checkTokenValidity(unauthorizedCallback), timeout);
    setAuthorizationHeader(token);
  }
};

export interface LoggedInUser {
  email: string;
  role: string;
}

export const getUserFromToken = () => {
  const decodedToken = getDecodedToken();

  if (!decodedToken) {
    return;
  }

  return {
    role: decodedToken.role,
    email: decodedToken.email,
  } as LoggedInUser;
};

const getDecodedToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log(token);
  if (!token) {
    return;
  }

  return jwtDecode(token) as DecodedToken;
};
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return;
  }

  return token;
};
export const setAuthorizationHeader = (token?: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token); // Save the token to localStorage
  setAuthorizationHeader(token); // Set the Authorization header for axios
};