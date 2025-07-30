'use client';

import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins, LogOut, Target } from 'lucide-react';
import { useEffect, useState, ReactNode } from "react";
import * as React from "react"
import { apiFetch } from '../lib/backend/client';
import { authAPI } from '@/lib/auth';
import { Asset } from 'next/font/google';
import * as Style from './ui/styles';
import { a } from "framer-motion/client";

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

export function MyPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [linearChartData, setLinearChartData] = useState([
    { month: 1, total: 100000 }
  ]);

  const [activities, setActivities] = useState([
    { amount: 500000, type: "ADD", date: "2025-07-21", content: "삼성전자 주식 매수", assetType: "STOCK" },
  ]);

  const [barChartDataRaw, setBarChartData] = useState([
    { type: "account", count: 0, value: 0 },
    { type: "deposit", count: 0, value: 0 },
    { type: "real_estate", count: 0, value: 0 },
    { type: "stock", count: 0, value: 0 },
  ]);

  const total = barChartDataRaw.reduce((sum, item) => sum + item.value, 0);

  const barChartData = barChartDataRaw.map((item) => ({
    ...item,
    value: parseFloat(((item.value / total) * 100).toFixed(2)), // 비율 값
  }));

  const { navigate } = useRouter();

  const onLogout = async () => {
    try {
      // @ts-ignore
      await authAPI.logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    const isAuth = authAPI.isAuthenticated();
    if (!isAuth) {
      navigate("/");
      return;
    }

    fetchUserInfo();
  }, []);
  const fetchUserInfo = async () => {
    try {
      // 계좌, 자산 처리.

      const [allAccountRes, allAssetRes] = await Promise.all([
        apiFetch('/api/v1/accounts'),
        apiFetch('/api/v1/assets/member'),
      ]);

      const myAccounts: Account[] = allAccountRes.data;
      const myAssets: Asset[] = allAssetRes.data;
      
      // 자산, 계좌 id 추출 
      const myAssetIds = myAssets.map((asset) => asset.id);
      const myAccountIds = myAccounts.map((account) => account.id);

      const [accountBulkRes, assetBulkRes] = await Promise.all([
        apiFetch(`/api/v1/transactions/account/search/bulk?ids=${myAccountIds.join(',')}`),
        apiFetch(`/api/v1/transactions/asset/search/bulk?ids=${myAssetIds.join(',')}`),
      ]);

      // 자산들의 거래 목록 일괄 조회
      const assetBulkData = assetBulkRes.data as Record<string, Transaction[]>;

      const allAssetTransactions = Object.entries(assetBulkData).flatMap(([id, transactions]) => {
        const assetId = parseInt(id, 10);
        const asset = myAssets.find((a) => a.id === assetId);
      
        return transactions.map((tx: any) => ({
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
          content: tx.content,
          assetType: asset?.assetType ?? "unknown",
        }));
      });

      // 계좌들의 거래 목록 일괄 조회
      const accountBulkData = accountBulkRes.data as Record<string, Transaction[]>;

      const allAccountTransactions = Object.entries(accountBulkData).flatMap(([id, transactions]) => {
        const accountId = parseInt(id, 10);
        const account = myAccounts.find((a) => a.id === accountId);
      
        return transactions.map((tx: any) => ({
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
          content: tx.content,
          assetType: "ACCOUNT",
        }));
      });

      const mergedTransactions = [...allAssetTransactions, ...allAccountTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

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
          }
          else {
            expenseSum += tx.amount;
          }
        }
      })

      const newBarChartData = [...barChartDataRaw];
      myAssets.forEach(asset => {
        const type = asset.assetType.toLowerCase(); // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find(item => item.type === type);
        if (target) {
          target.value += asset.assetValue;
          target.count++;
          totalAssetSum += asset.assetValue;
        }
      });
      myAccounts.forEach(account => {
        const type = "account" // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find(item => item.type === type);
        if (target) {
          target.value += account.balance;
          totalAssetSum += account.balance;
          target.count++;
        }
      });

      setBarChartData(newBarChartData);
      setActivities(mergedTransactions);
      setCurrentRevenue(revenueSum);
      setCurrentExpense(expenseSum);
      setTotalAsset(totalAssetSum);

      //스냅샷 등록
      await apiFetch(`/api/v1/snapshot/save?totalAsset=${totalAssetSum}`,
        {
          method: "POST",
        }
      );

      //스냅샷 가져오기
      const mySnapShotRes = await apiFetch(`/api/v1/snapshot`);
      const mySnapShot = mySnapShotRes.data?.map((item: { month: number; totalAsset: number }) => ({
        month: item.month,
        total: item.totalAsset,
      }));
      setLinearChartData(mySnapShot);

    } catch (error) {
      console.log("유저 정보 조회 실패", error);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-[1fr_auto_auto_auto_1fr] gap-x-4">
      <div>
      </div>
      <div
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">메뉴</h1>
        </header>

        <section
          onClick={() => navigate('/mypage')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <LayoutDashboard className="text-black-500" />대시 보드
        </section>
        <section
          onClick={() => navigate('/goals')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <Target className="text-black-500" />나의 목표
        </section>
        <section
          onClick={() => navigate('/accounts')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <CreditCard className="text-black-500" />계좌 목록
        </section>
        
        <section
          onClick={() => navigate('/mypage/assets')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <HandCoins className="text-black-500" />자산 목록
        </section>
        <section
          onClick={onLogout}
          className="flex items-center p-2 gap-4 text-red-500 hover:bg-red-50 rounded-md cursor-pointer">
          <ArrowRight className="text-red-500" />로그아웃
        </section>
      </div>
      <div
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
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
            value={Style.formatValue(barChartDataRaw.find((d) => d.type === "account")?.value ?? 0)}
            description={Style.formatCount(barChartDataRaw.find((d) => d.type === "account")?.count ?? 0)}
          />
          <Style.Card icon={<Coins className="w-6 h-6 text-blue-500" />} title="예금/적금" value={Style.formatValue(barChartDataRaw.find((d) => d.type === "deposit")?.value ?? 0)} description={Style.formatCount(barChartDataRaw.find((d) => d.type === "deposit")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
          <Style.Card icon={<House className="w-6 h-6 text-orange-500" />} title="부동산" value={Style.formatValue(barChartDataRaw.find((d) => d.type === "real_estate")?.value ?? 0)} description={Style.formatCount(barChartDataRaw.find((d) => d.type === "real_estate")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
          <Style.Card icon={<BarChart2 className="w-6 h-6 text-purple-500" />} title="주식" value={Style.formatValue(barChartDataRaw.find((d) => d.type === "stock")?.value ?? 0)} description={Style.formatCount(barChartDataRaw.find((d) => d.type === "stock")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
        </section>

        <section>
          <Style.ChartBarHorizontal barChartData={barChartData} />
        </section>
      </div>
      <div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-l">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">최근 거래</h1>
        </header>

        <section>
          {activities.length === 0 ? (
          <div className="text-muted-foreground text-sm">*거래내역이 없습니다*</div>
          ) : (
          <Style.ActivityList activities={activities}/>)} 
        </section>
      </div>
      <div>
      </div>
    </div>
  );
}


