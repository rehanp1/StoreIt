import { userAccount } from "@/context/UserAccountContext";
import { useContext } from "react";

const useUserAccount = () => {
  const context = useContext(userAccount);
  if (!context) {
    throw new Error("useUserAccount must be used within a UserAccountProvider");
  }
  return context;
};

export default useUserAccount