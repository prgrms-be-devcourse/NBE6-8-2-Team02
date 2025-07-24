"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface Account {
  id: number;
  name: string;
  accountNumber: string;
  balance: number;
}

interface AccountContextType {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, newNumber: string) => void;
  deleteAccount: (id: number) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const initialAccounts: Account[] = [
  { id: 1, name: "농협", accountNumber: "123456789", balance: 120000 },
  { id: 2, name: "국민", accountNumber: "987654321", balance: 500000 },
];

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const addAccount = (account: Account) => {
    setAccounts((prev) => [...prev, account]);
  };

  const updateAccount = (id: number, newNumber: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, accountNumber: newNumber } : acc
      )
    );
  };

  const deleteAccount = (id: number) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        setAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccountContext must be used within an AccountProvider");
  return context;
};
