'use client';

import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins, Section, SquarePlusIcon, Target} from 'lucide-react';
import { useEffect, useState, ReactNode } from "react";
import { CreateAssetModal } from "./CreateAssetModal";
import * as React from "react"
import { apiFetch } from '../lib/backend/client';
import { Asset } from 'next/font/google';
import * as Style from './ui/styles'
import { SideBar } from "./SideBar";
import { authAPI } from "@/lib/auth";

type Asset = {
  id: number;
  memberId: number;
  name: string;
  assetType: string;
  assetValue: number;createDate: string;
  modifyDate: string;
};

export function AssetPage() {
  const [activities, setActivities] = useState([
    { amount: 500000, type: "ADD", date: "2025-07-21", content: "삼성전자 주식 매수", assetType: "STOCK" },
  ]);

  const [depositAssets, setDepositAssets] = useState([
    { id: 1, title: "KB 적금", value: 10000 },
  ]);
  const [estateAssets, setEstateAssets] = useState([
    { id: 5, title: "압구정 현대", value: 11500000000 },
  ]);
  const [stockAssets, setStockAssets] = useState([
    { id: 8, title: "삼성전자", value: 704000 },
  ]);

  const [sumAll, setSumAll] = useState([
    { deposit: 0, estate: 0, stock: 0}
  ])

  const [modalOpen, setModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const handleCreate = () => {
    setModalOpen(true);
  };

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
  }, [reloadTrigger]);

  const { navigate } = useRouter();

  return (
    <>
    <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[1fr_auto_1fr]">
      <SideBar navigate={navigate} active="assets" />
      <div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto border-r">
        <div className='flex flex-row mr-auto gap-2'>
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">자산 목록</h1>
          </header>
        <button
          onClick={handleCreate}
          className="text-green-600 hover:text-red-800 transition-colors duration-200"
          aria-label="생성"
          type="button"
        >
        <SquarePlusIcon></SquarePlusIcon>
        </button>
        </div>
        <div className="min-h-screen grid grid-cols-[auto_auto_auto]">
          <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 border-r pr-4">
          <section className='flex flex-col gap-2 mt-4'>
            <Style.CardAssetCreate
                icon={<Coins className="w-6 h-6 text-blue-500" />} 
                title="예금/적금" 
                value={sumAll[0].deposit}
              />
            <section className="border-b">
            </section>
          </section>
          <section className='space-y-6'>
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
          <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 px-4">
            <section className='flex flex-col gap-2 mt-4'>
              <Style.CardAssetCreate
                  icon={<House className="w-6 h-6 text-orange-500" />} 
                  title="부동산" 
                  value={sumAll[0].estate}
                />
                <section className="border-b">
                </section>
            </section>
            <section className='space-y-6'>
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
          <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 pl-4 border-l">
            <section className='flex flex-col gap-2 mt-4'>
              <Style.CardAssetCreate
                  icon={<BarChart2 className="w-6 h-6 text-purple-500" />} 
                  title="주식" 
                  value={sumAll[0].stock}
                />
                <section className="border-b">
                </section>
            </section>
            <section className='space-y-6'>
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
    <CreateAssetModal 
    open={modalOpen} 
    onOpenChange={setModalOpen}
    onSuccess={() => setReloadTrigger(prev => prev + 1)}
    />
    </>
  );
}