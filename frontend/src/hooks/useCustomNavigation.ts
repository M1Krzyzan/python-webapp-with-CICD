import { useNavigate } from "react-router-dom";

export function useCustomNavigation() {
  const navigate = useNavigate();

  function navigateToLoginPage() {
    navigate("/login");
  }

  function navigateToHome() {
    navigate("/");
  }

  return {
    navigateToLoginPage,
    navigateToHome,
  };
}