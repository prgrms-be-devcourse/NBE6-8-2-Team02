"use client";

import { useParams } from "next/navigation";
import { useAccountContext } from "@/context/AccountContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AccountDetailPage() {
  const { id } = useParams();
  const accountId = Number(id);
  const { accounts, transactions, addTransaction } = useAccountContext();

  const account = accounts.find((acc) => acc.id === accountId);
  const accountTransactions = transactions.filter(
    (t) => t.accountId === accountId
  );

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"deposit" | "withdraw">("deposit");
  const [note, setNote] = useState("");

  const [showForm, setShowForm] = useState(false); // 폼 표시 여부

  if (!account) {
    return <div className="text-center py-20">계좌를 찾을 수 없습니다.</div>;
  }

  const handleAddTransaction = () => {
    if (!amount || isNaN(Number(amount))) return;

    addTransaction({
      id: Date.now(),
      accountId,
      amount: Number(amount),
      type,
      note,
      date: new Date().toISOString(),
    });

    setAmount("");
    setNote("");
    setType("deposit");
    setShowForm(false); // 등록 후 폼 닫기
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="text-2xl font-bold">{account.name}</div>
      <div className="text-gray-600 font-medium">{account.accountNumber}</div>
      <div className="text-lg">잔액: {account.balance.toLocaleString()}원</div>

      {/* 거래 등록 폼 토글 버튼 */}
      <Button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "거래 등록 취소" : "거래 추가"}
      </Button>

      {/* 거래 등록 폼 */}
      {showForm && (
        <Card className="p-4 space-y-4">
          <div className="font-semibold">거래 등록</div>
          <Input
            type="number"
            placeholder="금액"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <RadioGroup
            value={type}
            onValueChange={(val) => setType(val as "deposit" | "withdraw")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deposit" id="deposit" />
              <Label htmlFor="deposit">입금</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="withdraw" id="withdraw" />
              <Label htmlFor="withdraw">출금</Label>
            </div>
          </RadioGroup>
          <Input
            placeholder="메모"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button type="button" onClick={handleAddTransaction}>
            거래 저장
          </Button>
        </Card>
      )}

      {/* 거래 목록 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">거래 내역</h2>
        {accountTransactions.length === 0 ? (
          <div className="text-gray-500">거래 내역이 없습니다.</div>
        ) : (
          <div className="space-y-2">
            {accountTransactions.map((tx) => (
              <Card key={tx.id} className="p-3 flex justify-between">
                <div>
                  <div className="font-medium">{tx.note || "메모 없음"}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    tx.type === "deposit" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.type === "deposit" ? "+" : "-"}
                  {tx.amount.toLocaleString()}원
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
