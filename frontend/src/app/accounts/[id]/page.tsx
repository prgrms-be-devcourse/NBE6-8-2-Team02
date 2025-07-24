"use client";

import { useParams } from "next/navigation";
import { useAccountContext } from "@/context/AccountContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountDetailPage() {
  const { id } = useParams();
  console.log("AccountDetailPage id:", id);
  const { accounts } = useAccountContext();

  const account = accounts.find((acc) => acc.id === Number(id));

  if (!account) {
    return <div className="text-center py-20">계좌를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="text-2xl font-bold">{account.name}</div>
      <div className="text-gray-600 font-medium">{account.accountNumber}</div>
      <div className="text-lg">잔액: {account.balance.toLocaleString()}원</div>

      <div>
        <Link href={`/accounts/${account.id}/transactions/new`}>
          <Button>거래 등록</Button>
        </Link>
      </div>
    </div>
  );
}
