"use client";

import Link from "next/link";
import { useAccountContext } from "@/app/mypage/accounts/AccountContext";
import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SideBar from "@/app/components/SideBar";

export default function AccountsPage() {
  const { accounts, setAccounts, addAccount, updateAccount, deleteAccount } =
    useAccountContext();

  // 메뉴 네비게이션

  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/accounts", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error("계좌 조회 실패");
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
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

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
    <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[1fr_auto_auto_auto_1fr] gap-x-4">
      <div></div>
      <SideBar active="accounts"/>
      <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
      <div className="max-w-2xl mx-auto py-10 px-4">
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

        <div className="w-[600px] space-y-4">
          {accounts
            .slice()
            .reverse()
            .map((account) => (
              <Card key={account.id} className="p-4">
                <Link href={`/mypage/accounts/${account.id}`}>
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
                        setNewAccountNumber(
                          e.target.value.replace(/[^0-9-]/g, "")
                        )
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
                      onClick={() => setShowConfirm(true)}
                    >
                      삭제
                    </Button>
                    {showConfirm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-[300px] text-center">
                          <h2 className="text-lg font-semibold mb-4">
                            정말 삭제하시겠습니까?
                          </h2>
                          <p className="text-sm text-gray-600 mb-6">
                            이 작업은 되돌릴 수 없습니다.
                          </p>
                          <div className="flex justify-between">
                            <button
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded"
                              onClick={() => setShowConfirm(false)}
                            >
                              취소
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                              onClick={() => {
                                setShowConfirm(false);
                                deleteAccount(account.id);
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>
      </motion.div>
    </div>
  );
}

//export default AccountsPage;
