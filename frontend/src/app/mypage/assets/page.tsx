"use client";

import { useRouter } from "next/navigation";
import { BarChart2, Coins, House, SquarePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateAssetModal } from "@/app/mypage/assets/CreateAssetModal";
import * as React from "react";
import { apiFetch } from "@/lib/backend/client";
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

export default function AssetPage() {
  const [activities, setActivities] = useState([
    {
      amount: 500000,
      type: "ADD",
      date: "2025-07-21",
      content: "삼성전자 주식 매수",
      assetType: "STOCK",
    },
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

  const [sumAll, setSumAll] = useState([{ deposit: 0, estate: 0, stock: 0 }]);

  const [modalOpen, setModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const handleCreate = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchAssetInfo = async () => {
      try {
        const allAssetRes = await apiFetch('/api/v1/assets/member');
        const myAssets: Asset[] = allAssetRes.data;

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

        const depositSum = deposits.reduce(
          (acc, asset) => acc + asset.value,
          0
        );
        const estateSum = estates.reduce((acc, asset) => acc + asset.value, 0);
        const stockSum = stocks.reduce((acc, asset) => acc + asset.value, 0);

        setSumAll([
          {
            deposit: depositSum,
            estate: estateSum,
            stock: stockSum,
          },
        ]);

        setDepositAssets(deposits);
        setEstateAssets(estates);
        setStockAssets(stocks);
      } catch (error) {
        console.log("유저 정보 조회 실패", error);
      }
    };
    fetchAssetInfo();
  }, [reloadTrigger]);

  const router = useRouter();

  return (
    <>
      <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
        <div></div>
        <SideBar active="assets" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
        >
        <div className="flex flex-col min-h-screen p-6 mx-auto">
          <div className="flex flex-row mr-auto gap-2">
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
            <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 pr-4">
              <section className="flex flex-col gap-2 mt-4">
                <Style.CardAssetCreate
                  icon={<Coins className="w-6 h-6 text-blue-500" />}
                  title="예금/적금"
                  value={sumAll[0].deposit}
                />
                <section className="border-b"></section>
              </section>
              <section className="space-y-6">
                {depositAssets.map((asset) => (
                  <Style.CardAsset
                    key={asset.id}
                    icon={<Coins className="w-6 h-6 text-blue-500" />}
                    title={asset.title}
                    value={asset.value}
                    onClick={() => router.push(`/mypage/assets/${asset.id}`)}
                  />
                ))}
              </section>
            </div>
            <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 px-4">
              <section className="flex flex-col gap-2 mt-4">
                <Style.CardAssetCreate
                  icon={<House className="w-6 h-6 text-orange-500" />}
                  title="부동산"
                  value={sumAll[0].estate}
                />
                <section className="border-b"></section>
              </section>
              <section className="space-y-6">
                {estateAssets.map((asset) => (
                  <Style.CardAsset
                    key={asset.id}
                    icon={<House className="w-6 h-6 text-orange-500" />}
                    title={asset.title}
                    value={asset.value}
                    onClick={() => router.push(`/mypage/assets/${asset.id}`)}
                  />
                ))}
              </section>
            </div>
            <div className="flex flex-col min-h-screen max-w-6xl mx-auto space-y-6 pl-4">
              <section className="flex flex-col gap-2 mt-4">
                <Style.CardAssetCreate
                  icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
                  title="주식"
                  value={sumAll[0].stock}
                />
                <section className="border-b"></section>
              </section>
              <section className="space-y-6">
                {stockAssets.map((asset) => (
                  <Style.CardAsset
                    key={asset.id}
                    icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
                    title={asset.title}
                    value={asset.value}
                    onClick={() => router.push(`/mypage/assets/${asset.id}`)}
                  />
                ))}
              </section>
            </div>
          </div>
        </div>
        <div></div>
        </motion.div>
      </div>
      <CreateAssetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setReloadTrigger((prev) => prev + 1)}
      />
    </>
  );
}
