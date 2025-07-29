"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 계좌 타입
export interface Account {
  id: number;
  name: string;
  accountNumber: string;
  balance: number;
}

// 거래 타입
export interface Transaction {
  id: number;
  accountId: number;
  type: "ADD" | "REMOVE";
  amount: number;
  content: string;
  date: string;
}

// Context에서 제공할 타입
interface AccountContextType {
  accounts: Account[];
  transactions: Transaction[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, newNumber: string) => void;
  deleteAccount: (id: number) => void;

  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: number) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 계좌 추가
  const addAccount = (account: Account) => {
    const fetchCreateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/accounts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: 1,
            name: account.name,
            accountNumber: account.accountNumber,
            balance: account.balance,
          }),
          credentials: "include",
        });
        const result = await response.json();

        if (result.resultCode === "200-1") {
          console.log("계좌가 생성되었습니다.");
          setAccounts((prev) => [...prev, account]);
          alert("계좌가 생성되었습니다.");
        } else {
          console.log("계좌 생성에 실패하였습니다.");
        }
      } catch (error) {
        console.error("계좌 생성 요청에 실패했습니다.");
      }
    };
    fetchCreateAccount();
  };

  // 계좌 번호 수정
  const updateAccount = (id: number, newNumber: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, accountNumber: newNumber } : acc
      )
    );

    const fetchUpdateAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/accounts/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountNumber: newNumber }),
            credentials: "include",
          }
        );
        const result = await response.json();

        if (result.resultCode === "200-1") {
          alert("계좌번호가 변경되었습니다.");
        }
      } catch (error) {
        console.error("계좌번호 변경 요청 실패.", error);
      }
    };

    fetchUpdateAccount();
  };

  // 계좌 삭제
  const deleteAccount = (id: number) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    // 관련 거래들도 삭제
    setTransactions((prev) => prev.filter((tx) => tx.accountId !== id));

    const fetchDeleteAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/accounts/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const result = await response.json();

        if (result.resultCode === "200-1") {
          console.log(result.msg);
        }
      } catch (error) {
        console.error("계좌 삭제 요청을 실패하였습니다.");
      }
    };
    fetchDeleteAccount();
  };

  // 거래 추가
  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);

    // 거래 추가 시 계좌 잔액도 업데이트
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === transaction.accountId) {
          const newBalance =
            transaction.type === "ADD"
              ? acc.balance + transaction.amount
              : acc.balance - transaction.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );
  };

  // 거래 삭제 (필요하면)
  const deleteTransaction = (id: number) => {
    const txToDelete = transactions.find((tx) => tx.id === id);
    if (!txToDelete) return;

    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    // 삭제한 거래 반영해서 잔액 업데이트 (거래가 삭제되면 잔액 되돌리기)
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === txToDelete.accountId) {
          const newBalance =
            txToDelete.type === "ADD"
              ? acc.balance - txToDelete.amount
              : acc.balance + txToDelete.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        transactions,
        setAccounts,
        setTransactions,
        addAccount,
        updateAccount,
        deleteAccount,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// Context 훅
export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }
  return context;
};
