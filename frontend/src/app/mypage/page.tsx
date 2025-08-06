"use client";

import { useRouter } from "next/navigation";
import { BarChart2, Coins, House } from "lucide-react";
import { useEffect, useState } from "react";
import * as React from "react";
import { apiFetch } from "@/lib/backend/client";
import { authAPI } from "@/lib/auth";
import { Asset } from "next/font/google";
import * as Style from "@/app/components/ui/styles";
import { motion } from "framer-motion";
import SideBar from "@/app/components/SideBar";

type Asset = {
  id: number;
  memberId: number;
  name: string;
  assetType: string;
  assetValue: number;
  createDate: string;
  modifyDate: string;
};

type Transaction = {
  id: number;
  assetId: number;
  type: string;
  amount: number;
  content: string;
  date: string;
  createDate: string;
  modifyDate: string;
};

type Account = {
  id: number;
  memberId: number;
  name: string;
  accountNumber: string;
  balance: number;
  createDate: string;
  modifyDate: string;
};

interface activity {
  amount: number;
  type: string;
  date: string;
  content: string;
  assetType: string;
}

interface linear {
  month: number;
  total: number;
}

interface total {
  type: string;
  value: number;
}

export default function MyPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [linearChartData, setLinearChartData] = useState<linear[]>([]);
  const [activities, setActivities] = useState<activity[]>([]);

  const [barChartDataRaw, setBarChartDataRaw] = useState([
    { type: "account", count: 0, value: 0 },
    { type: "deposit", count: 0, value: 0 },
    { type: "real_estate", count: 0, value: 0 },
    { type: "stock", count: 0, value: 0 },
  ]);
  const [barChartData, setBarChartData] = useState<total[]>([]);

  /*
  const total = barChartDataRaw.reduce((sum, item) => sum + item.value, 0);
  const barChartData = barChartDataRaw.map((item) => ({
    ...item,
    value: parseFloat(((item.value / total) * 100).toFixed(2)), // 비율 값
  }));
  */

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      console.log("MyPage: Starting auth check...");
      const authStatus = authAPI.checkAuthStatus();

      console.log("MyPage auth check result:", authStatus);
      console.log("MyPage: isAuthenticated =", authStatus.isAuthenticated);
      console.log("MyPage: userRole =", authStatus.userRole);

      if (!authStatus.isAuthenticated) {
        window.location.replace("/");
        return;
      }

      // 관리자가 아닌 경우에만 mypage 접근 허용
      if (authStatus.userRole === "ADMIN") {
        window.location.replace("/admin");
        return;
      }

      console.log("MyPage: User authenticated, proceeding to fetch user info");
      await fetchUserInfo();
    };

    // 즉시 인증 확인
    checkAuthAndFetch();
  }, []);
  const fetchUserInfo = async () => {
    try {
      // 계좌, 자산 처리.

      const [allAccountRes, allAssetRes] = await Promise.all([
        apiFetch("/api/v1/accounts"),
        apiFetch("/api/v1/assets/member"),
      ]);

      const myAccounts: Account[] = allAccountRes || [];
      const myAssets: Asset[] = allAssetRes.data || [];

      // 자산, 계좌 id 추출
      const myAssetIds = myAssets.map((asset) => asset.id);
      const myAccountIds = myAccounts.map((account) => account.id);

      // ID가 있는 경우에만 bulk 요청
      let accountBulkRes = { data: {} };
      let assetBulkRes = { data: {} };

      if (myAccountIds.length > 0) {
        try {
          accountBulkRes = await apiFetch(
            `/api/v1/transactions/account/search/bulk?ids=${myAccountIds.join(
              ","
            )}`
          );
        } catch (error) {
          console.error("계좌 거래 내역 조회 실패:", error);
          accountBulkRes = { data: {} };
        }
      }

      if (myAssetIds.length > 0) {
        try {
          assetBulkRes = await apiFetch(
            `/api/v1/transactions/asset/search/bulk?ids=${myAssetIds.join(",")}`
          );
        } catch (error) {
          console.error("자산 거래 내역 조회 실패:", error);
          assetBulkRes = { data: {} };
        }
      }

      // 자산들의 거래 목록 일괄 조회
      const assetBulkData =
        (assetBulkRes.data as Record<string, Transaction[]>) || {};

      const allAssetTransactions = Object.entries(assetBulkData).flatMap(
        ([id, transactions]) => {
          const assetId = parseInt(id, 10);
          const asset = myAssets.find((a) => a.id === assetId);

          return transactions.map((tx: any) => ({
            amount: tx.amount,
            type: tx.type,
            date: tx.date,
            content: tx.content,
            assetType: asset?.assetType ?? "unknown",
          }));
        }
      );

      // 계좌들의 거래 목록 일괄 조회
      const accountBulkData =
        (accountBulkRes.data as Record<string, Transaction[]>) || {};

      const allAccountTransactions = Object.entries(accountBulkData).flatMap(
        ([id, transactions]) => {
          const accountId = parseInt(id, 10);
          const account = myAccounts.find((a) => a.id === accountId);

          return transactions.map((tx: any) => ({
            amount: tx.amount,
            type: tx.type,
            date: tx.date,
            content: tx.content,
            assetType: "ACCOUNT",
          }));
        }
      );

      const mergedTransactions = [
        ...allAssetTransactions,
        ...allAccountTransactions,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      let revenueSum = 0;
      let expenseSum = 0;
      let totalAssetSum = 0;

      mergedTransactions.forEach((tx) => {
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth() + 1;

        if (txYear === currentYear && txMonth === currentMonth) {
          if (tx.type === "ADD") {
            revenueSum += tx.amount;
          } else {
            expenseSum += tx.amount;
          }
        }
      });

      const newBarChartData = barChartDataRaw.map((item) => ({ ...item }));
      myAssets.forEach((asset) => {
        const type = asset.assetType.toLowerCase(); // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find((item) => item.type === type);
        if (target) {
          target.value += asset.assetValue;
          target.count++;
          totalAssetSum += asset.assetValue;
        }
      });
      myAccounts.forEach((account) => {
        const type = "account"; // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find((item) => item.type === type);
        if (target) {
          target.value += account.balance;
          target.count++;
          totalAssetSum += account.balance;
        }
      });

      const total = newBarChartData.reduce((sum, item) => sum + item.value, 0);
      const percentageData: total[] = newBarChartData.map((item) => ({
        ...item,
        value: parseFloat(((item.value / total) * 100).toFixed(2)), // 비율 값
      }));

      setBarChartData(percentageData);
      setBarChartDataRaw(newBarChartData);
      setActivities(mergedTransactions);
      setCurrentRevenue(revenueSum);
      setCurrentExpense(expenseSum);
      setTotalAsset(totalAssetSum);

      //스냅샷 등록
      try {
        console.log("스냅샷 저장 시도:", totalAssetSum);
        await apiFetch(`/api/v1/snapshot/save?totalAsset=${totalAssetSum}`, {
          method: "POST",
        });
        console.log("스냅샷 저장 성공");
      } catch (error) {
        console.error("스냅샷 저장 실패:", error);
        // 스냅샷 저장 실패는 치명적이지 않으므로 계속 진행
      }

      //스냅샷 가져오기
      try {
        console.log("스냅샷 조회 시도");
        const mySnapShotRes = await apiFetch(`/api/v1/snapshot`);
        console.log("스냅샷 조회 응답:", mySnapShotRes);
        const mySnapShot =
          mySnapShotRes.data?.map(
            (item: { month: number; totalAsset: number }) => ({
              month: item.month,
              total: item.totalAsset,
            })
          ) || [];
        setLinearChartData(mySnapShot);
        console.log("스냅샷 조회 성공:", mySnapShot);
      } catch (error) {
        console.error("스냅샷 조회 실패:", error);
        setLinearChartData([]);
      }
    } catch (error) {
      console.log("유저 정보 조회 실패", error);
      // 에러 발생 시 기본값 설정
      setBarChartData([]);
      setBarChartDataRaw([]);
      setActivities([]);
      setCurrentRevenue(0);
      setCurrentExpense(0);
      setTotalAsset(0);
      setLinearChartData([]);
    }
  };

  return (
    <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[auto_auto_auto]">
      <SideBar active="mypage" />
      <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col p-6 min-h-screen max-w-6xl mx-auto space-y-6"
      >
      <div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 가치</h1>
        </header>

        <section>
          <Style.CardMain
            value={totalAsset}
            revenue={currentRevenue}
            expense={currentExpense}
          />
        </section>

        <section>
          <Style.ChartLineInteractive data={linearChartData} />
        </section>

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 현황</h1>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Style.Card
            icon={<Coins className="w-6 h-6 text-green-500" />}
            title="입출금 계좌"
            value={Style.formatValue(
              barChartDataRaw.find((d) => d.type === "account")?.value ?? 0
            )}
            description={Style.formatCount(
              barChartDataRaw.find((d) => d.type === "account")?.count ?? 0
            )}
          />
          <Style.Card
            icon={<Coins className="w-6 h-6 text-blue-500" />}
            title="예금/적금"
            value={Style.formatValue(
              barChartDataRaw.find((d) => d.type === "deposit")?.value ?? 0
            )}
            description={Style.formatCount(
              barChartDataRaw.find((d) => d.type === "deposit")?.count ?? 0
            )}
          />
          <Style.Card
            icon={<House className="w-6 h-6 text-orange-500" />}
            title="부동산"
            value={Style.formatValue(
              barChartDataRaw.find((d) => d.type === "real_estate")?.value ?? 0
            )}
            description={Style.formatCount(
              barChartDataRaw.find((d) => d.type === "real_estate")?.count ?? 0
            )}
          />
          <Style.Card
            icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
            title="주식"
            value={Style.formatValue(
              barChartDataRaw.find((d) => d.type === "stock")?.value ?? 0
            )}
            description={Style.formatCount(
              barChartDataRaw.find((d) => d.type === "stock")?.count ?? 0
            )}
          />
        </section>

        <section>
          <Style.ChartBarHorizontal barChartData={barChartData} />
        </section>
      </div>
      </motion.div>
      <div className="flex flex-col min-h-screen p-12 max-w-6xl mx-auto space-y-6 border-l">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">최근 거래</h1>
        </header>

        <section>
          {activities.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              *거래내역이 없습니다*
            </div>
          ) : (
            <Style.ActivityList activities={activities} />
          )}
        </section>
      </div>
    </div>
  );
}
