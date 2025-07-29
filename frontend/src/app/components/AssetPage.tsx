'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins, Section} from 'lucide-react';
import { useEffect, useState, ReactNode } from "react";
import * as React from "react"
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { apiFetch } from '../lib/backend/client';
import { Asset } from 'next/font/google';
import { assert, error, time } from 'console';
import { totalmem } from 'os';
import { title } from 'process';
import { Value } from '@radix-ui/react-select';
import * as Style from './ui/styles'

type Asset = {
  id: number;
  memberId: number;
  name: string;
  assetType: string;
  assetValue: number;
  createDate: string;
  modifyDate: string;
};

export function AssetPage() {
  const [activities, setActivities] = useState([
    { amount: 500000, type: "ADD", date: "2025-07-21", content: "삼성전자 주식 매수", assetType: "STOCK" },
  ]);

  const [depositAssets, setDepositAssets] = useState([
    { id: 1, title: "KB 적금", value: 10000 },
    { id: 2, title: "KB 예금", value: 30000 },
    { id: 3, title: "신한 적금", value: 170000 },
    { id: 4, title: "신한 예예금", value: 300000 },
  ]);
  const [estateAssets, setEstateAssets] = useState([
    { id: 5, title: "압구정 현대", value: 11500000000 },
    { id: 6, title: "한남더힐", value: 10000000000 },
    { id: 7, title: "롯데 시그니엘", value: 7000000000 },
  ]);
  const [stockAssets, setStockAssets] = useState([
    { id: 8, title: "삼성전자", value: 704000 },
    { id: 9, title: "SK하이닉스", value: 2620000 },
    { id: 10, title: "S-OIL", value: 622000 },
  ]);

  const [sumAll, setSumAll] = useState([
    { deposit: 0, estate: 0, stock: 0}
  ])

  useEffect(() => {
    const fetchAssetInfo = async () => {
      try {
        const memberRes = await apiFetch('/api/v1/members/me');
        const memberId = memberRes.id;

        if(!memberId) throw new Error("잘못된 사용자 정보입니다.");

        const allAssetRes = await apiFetch('/api/v1/assets');
        const myAssets: Asset[] = allAssetRes.data?.filter(
          (asset: Asset) => asset.memberId === memberId
        );

        console.log(myAssets);

        const deposits = myAssets
          .filter((asset) => asset.assetType === "DEPOSIT")
          .map((asset) => ({
            id: asset.id,
            title: asset.name,
            value: asset.assetValue,
          }))
          .sort((a, b) => b.value - a.value); // 내림차순 정렬

        const estates = myAssets
          .filter((asset) => asset.assetType === "REAL_ESTATE")
          .map((asset) => ({
            id: asset.id,
            title: asset.name,
            value: asset.assetValue,
          }))
          .sort((a, b) => b.value - a.value);

        const stocks = myAssets
          .filter((asset) => asset.assetType === "STOCK")
          .map((asset) => ({
            id: asset.id,
            title: asset.name,
            value: asset.assetValue,
          }))
          .sort((a, b) => b.value - a.value);

        const depositSum = deposits.reduce((acc, asset) => acc + asset.value, 0);
        const estateSum = estates.reduce((acc, asset) => acc + asset.value, 0);
        const stockSum = stocks.reduce((acc, asset) => acc + asset.value, 0);

        setSumAll(
          [
            {
              deposit: depositSum,
              estate: estateSum,
              stock: stockSum
            }
          ]
        );

        setDepositAssets(deposits);
        setEstateAssets(estates);
        setStockAssets(stocks);
      
        console.log("예금/적금 자산 정보", depositAssets);
        console.log("부동산 자산 정보", estateAssets);
        console.log("주식 자산 정보", stockAssets);

        console.log(sumAll);


      } catch (error) {
        console.log("유저 정보 조회 실패", error);
      }
    };
    fetchAssetInfo();
  }, []);

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

  return (
    <div className="min-h-screen grid grid-cols-[1fr_auto_1fr]">
      <div
        className="flex flex-col min-h-screen p-6 max-w-6xl ml-auto text-right space-y-6 border-r"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">메뉴</h1>
        </header>

        <section 
        onClick={() => navigate('/mypage')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <LayoutDashboard className="text-black-500"/>대시 보드
        </section>
        <section 
        onClick={() => navigate('/accounts')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <CreditCard className="text-black-500"/>계좌 목록
        </section>
        <section 
        onClick={() => navigate('/mypage/assets')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <HandCoins className="text-black-500"/>자산 목록
        </section>
        <section
          onClick={onLogout}
          className="flex items-center p-2 gap-4 text-red-500 hover:bg-red-50 rounded-md cursor-pointer">
          <ArrowRight className="text-red-500" />로그아웃
        </section>
      </div>
      <div
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 목록</h1>
        </header>
        <div className="min-h-screen grid grid-cols-[auto_auto_auto]">
          <div
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r"
          >
          <section className='border-b p-2'>
            <Style.CardAsset 
                icon={<Coins className="w-6 h-6 text-blue-500" />} 
                title="예금/적금" 
                value={sumAll[0].deposit}
              />
          </section>
          <section className='p-2 space-y-6'>
            {depositAssets.map(asset => (
              <Style.CardAsset
                key={asset.id}
                icon={<Coins className="w-6 h-6 text-blue-500"/>} 
                title={asset.title} 
                value={asset.value}
                onClick={() => navigate(`/mypage/assets/${asset.id}`)}
              />
            ))}
          </section>
          </div>
          <div
            className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
          >
            <section className='border-b p-2'>
              <Style.CardAsset
                  icon={<House className="w-6 h-6 text-orange-500" />} 
                  title="부동산" 
                  value={sumAll[0].estate}
                />
            </section>
            <section className='p-2 space-y-6'>
              {estateAssets.map(asset => (
                <Style.CardAsset
                  key={asset.id}
                  icon={<House className="w-6 h-6 text-orange-500"/>} 
                  title={asset.title} 
                  value={asset.value}
                  onClick={() => navigate(`/mypage/assets/${asset.id}`)}
                />
              ))}
            </section>
          </div>
          <div
            className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-l"
          >
            <section className='border-b p-2'>
              <Style.CardAsset
                  icon={<BarChart2 className="w-6 h-6 text-purple-500" />} 
                  title="주식" 
                  value={sumAll[0].stock}
                />
            </section>
    
            <section className='p-2 space-y-6'>
              {stockAssets.map(asset => (
                <Style.CardAsset
                  key={asset.id}
                  icon={<BarChart2 className="w-6 h-6 text-purple-500"/>} 
                  title={asset.title} 
                  value={asset.value}
                  onClick={() => navigate(`/mypage/assets/${asset.id}`)}
                />
              ))}
            </section>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}