import { authState } from "@/services/auth.service";
import type { FileProps } from "@/types";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface Account {
  id: string;
  fullName: string;
  email: string;
}

interface Data {
  files: FileProps[];
  setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
  account: Account | null;
  setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  filesSummary:any,
  setFilesSummary: React.Dispatch<React.SetStateAction<any>>

}

export const userAccount = createContext<Data | null>(null);

export const UserAccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [files, setFiles] = useState<FileProps[]>([]);
  const [filesSummary, setFilesSummary] = useState<any>();
  const getAuthState = async () => {
    const data = await authState();

    if (data?.success) {
      setIsLoggedIn(true);
      setAccount(data.user);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const data = {
    files,
    setFiles,
    account,
    setAccount,
    isLoggedIn,
    setIsLoggedIn,
    filesSummary,
    setFilesSummary
  };

  return <userAccount.Provider value={data}>{children}</userAccount.Provider>;
};
