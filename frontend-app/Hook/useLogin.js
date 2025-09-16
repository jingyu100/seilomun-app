import { useContext } from "react";
import LoginContext from "../Context/LoginContext";

const useLogin = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error("useLogin은 LoginProvider 내에서 사용되어야 합니다.");
  }

  return context;
};

export default useLogin;
