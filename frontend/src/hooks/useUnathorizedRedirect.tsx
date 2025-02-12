import axios from "axios";

import { TOKEN_KEY } from "../auth/authService";
import { useCustomNavigation } from "./useCustomNavigation.ts";

const useUnauthorizedRedirect = () => {
  const { navigateToLoginPage } = useCustomNavigation();

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        navigateToLoginPage();
      }

      return Promise.reject(error);
    },
  );
};

export default useUnauthorizedRedirect;