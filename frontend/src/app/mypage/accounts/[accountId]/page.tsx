"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccountContext } from "@/app/mypage/accounts/AccountContext";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import SideBar from "../../../components/SideBar";

export default function AccountDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = Number(params.accountId);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { accounts, transactions, setTransactions, addTransaction } =
    useAccountContext();

  const account = accounts.find((acc) => acc.id === accountId);
  const accountTransactions = transactions.filter(
    (t) => t.accountId === accountId
  );

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"ADD" | "REMOVE">("ADD");
  const [content, setContent] = useState("");

  const [showForm, setShowForm] = useState(false); // 폼 표시 여부

  if (!account) {
    return <div className="text-center py-20">계좌를 찾을 수 없습니다.</div>;
  }

  useEffect(() => {
    if (isNaN(accountId)) {
      console.warn("잘못된 accountId:", params.accountId);
      return;
    }
    const fetchAccountTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/transactions/account/search/${accountId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status == 200) {
          const result = await response.json();
          setTransactions(result);
        } else {
          console.log("거래 목록 조회 실패");
        }
      } catch (error) {
        console.error("거래 목록 조회 요청에 실패했습니다.");
      }
    };
    fetchAccountTransaction();
  }, [accountId]);

  const handleAddTransaction = () => {
    if (!amount || isNaN(Number(amount))) return;

    const fetchCreateTransaction = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/transactions/account",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accountId: accountId,
              type: type,
              amount: amount,
              content: content,
              date: new Date().toISOString().replace("Z", ""),
            }),
            credentials: "include",
          }
        );

        if (response.status == 201) {
          console.log("거래가 정상적으로 등록되었습니다.");
          addTransaction({
            id: Date.now(),
            accountId,
            amount: Number(amount),
            type,
            content,
            date: new Date().toISOString(),
          });

          setAmount("");
          setContent("");
          setType("ADD");
          setShowForm(false); // 등록 후 폼 닫기
        } else {
          console.log("거래 등록 실패");
        }
      } catch (error) {
        console.error("거래 등록 요청에 실패했습니다.");
      }
    };
    fetchCreateTransaction();
  };

  const handleDeleteAccount = () => {
    const fetchDeleteAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/accounts/${accountId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.status == 204) {
          router.back();
          alert("계좌 연결 해제에 성공 했습니다.");
        } else {
          const result = response.json();
          console.log(result);
          alert("계좌 연결 해제에 실패했습니다.");
        }
      } catch (error) {
        console.error("계좌 연결 해제 요청을 실패했습니다.");
      }
    };

    fetchDeleteAccount();
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <SideBar active="accounts" />
      <div className="mt-15 text-2xl font-bold">{account.name}</div>
      <div className="text-gray-600 font-medium">{account.accountNumber}</div>
      <div className="text-lg">잔액: {account.balance.toLocaleString()}원</div>

      {/*계좌 연결 해제*/}
      <Button
        className="bg-red-600 hover:bg-red-500"
        onClick={() => {
          setShowConfirm(true);
        }}
      >
        계좌 연결 해제
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
                  handleDeleteAccount();
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

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
            onValueChange={(val) => setType(val as "ADD" | "REMOVE")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ADD" id="ADD" />
              <Label htmlFor="ADD">입금</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="REMOVE" id="REMOVE" />
              <Label htmlFor="REMOVE">출금</Label>
            </div>
          </RadioGroup>
          <Input
            placeholder="메모"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="button" onClick={handleAddTransaction}>
            거래 저장
          </Button>
        </Card>
      )}

      {/* 거래 목록 */}
      <div>
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold mb-2">거래 내역</h2>
          {/* 거래 등록 폼 토글 버튼 */}
          <Button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "거래 등록 취소" : "거래 추가"}
          </Button>
        </div>
        {accountTransactions.length === 0 ? (
          <div className="text-gray-500">거래 내역이 없습니다.</div>
        ) : (
          <div className="space-y-2">
            {accountTransactions.map((tx) => (
              <Card key={tx.id} className="p-3 flex justify-between">
                <div>
                  <div className="font-medium">{tx.content || "메모 없음"}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    tx.type === "ADD" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.type === "ADD" ? "+" : "-"}
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
