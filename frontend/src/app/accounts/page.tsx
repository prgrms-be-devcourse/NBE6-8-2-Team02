"use client";

import Link from "next/link";
import { useAccountContext } from "@/context/AccountContext";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountsPage() {
  const { accounts, setAccounts, addAccount, updateAccount, deleteAccount } =
    useAccountContext();
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/accounts", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();

        if (result.resultCode === "200-1") {
          setAccounts(result.data);
        } else {
          console.error("계좌 조회 실패", result.msg);
        }
      } catch (error) {
        console.error("계좌 데이터를 가져오는 중 오류 발생", error);
      }
    };
    fetchAccounts();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  const handleAdd = () => {
    if (!name || !accountNumber || !balance) return;

    addAccount(name, accountNumber, balance);
    setName("");
    setAccountNumber("");
    setBalance("");
    setShowForm(false);
  };

  const [editId, setEditId] = useState<number | null>(null);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const bankOptions = [
    "국민",
    "신한",
    "우리",
    "농협",
    "기업",
    "하나",
    "카카오뱅크",
    "케이뱅크",
  ];

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 계좌 목록</h1>
        <Button onClick={() => setShowForm(!showForm)}>계좌 추가</Button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-2">
          {/* 은행 선택 */}
          <Select onValueChange={(value: string) => setName(value)}>
            <SelectTrigger>
              <SelectValue placeholder="은행 선택" />
            </SelectTrigger>
            <SelectContent>
              {bankOptions.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 계좌번호 입력 */}
          <Input
            placeholder="계좌번호"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/[^0-9-]/g, ""))
            }
          />

          {/* 잔고 입력 */}
          <Input
            placeholder="잔고"
            type="number"
            min={0}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />

          <Button onClick={handleAdd}>추가</Button>
        </div>
      )}

      <div className="space-y-4">
        {accounts.map((account) => (
          <Card key={account.id} className="p-4">
            <Link href={`/accounts/${account.id}`}>
              <div className="text-xl font-semibold">{account.name}</div>
              <div className="text-gray-600 font-medium">
                {account.accountNumber}
              </div>
              <div className="mt-2">
                잔액: {account.balance.toLocaleString()}원
              </div>
            </Link>

            {editId === account.id ? (
              <div className="mt-2 flex gap-2">
                <Input
                  value={newAccountNumber}
                  onChange={(e) =>
                    setNewAccountNumber(e.target.value.replace(/[^0-9-]/g, ""))
                  }
                />
                <Button
                  onClick={() => {
                    updateAccount(account.id, newAccountNumber);
                    setEditId(null);
                  }}
                >
                  저장
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditId(account.id);
                    setNewAccountNumber(account.accountNumber);
                  }}
                >
                  수정
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteAccount(account.id)}
                >
                  삭제
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
