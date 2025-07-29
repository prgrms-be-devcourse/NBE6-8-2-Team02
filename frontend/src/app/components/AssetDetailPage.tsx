'use client';

import { motion } from 'framer-motion';
import { useRouter } from "./Router";
import { useParams } from "@/lib/useParams";
import { useEffect, useState, ReactNode } from "react";
import { apiFetch } from "../lib/backend/client";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins, Section} from 'lucide-react';
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

export function AssetDetailPage() {
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

    const [reloadFlag, setReloadFlag] = useState(false);
    const handleDelete = async (id:number) => {
        try {
            await apiFetch(`/api/v1/transactions/asset/${id}`, {
                method: "DELETE",
            });
            setReloadFlag(prev => !prev);
            console.log("삭제 완료!" + id)
        } catch (error) {
            console.log("삭제 에러")
        }
    }

    const params = useParams();

    const id = params.id;
    const [asset, setAsset] = useState<Asset>({
        id: 0,
        memberId: 0,
        name: "기본 자산",
        assetType: "DEPOSIT",
        assetValue: 0,
        createDate: new Date().toISOString(),
        modifyDate: new Date().toISOString(),
      });
      const [activities, setActivities] = useState([
        { id: 0, amount: 500000, type: "ADD", date: "2025-07-21", content: "삼성전자 주식 매수", assetType: "STOCK", onDelete: handleDelete },
      ]);

    useEffect (() => {
        const fetchAssetDetail = async () => {
            try {
                const assetRes = await apiFetch(`/api/v1/assets/${id}`);
                const assetInfo: Asset = assetRes.data;
                const assetType = assetInfo.assetType;

                const assetTransactionRes = await apiFetch(`/api/v1/transactions/asset/search/${id}`);
                const assetTransaction = assetTransactionRes.data?.map((item: { id: number; amount: number; type: string; date: string; content: string; assetType: string }) => ({
                    id: item.id,
                    amount: item.amount,
                    type: item.type,
                    date: item.date,
                    content: item.content,
                    assetType: assetType,
                    onDelete: handleDelete
                  }));

                setActivities(assetTransaction);
                setAsset(assetInfo);
      
            } catch (error) {
                console.log("에러 발생");
            }
        };
        fetchAssetDetail();
    }, [reloadFlag]);
    
    return (
        <div className="min-h-screen grid grid-cols-[1fr_auto_1fr]">
            <div className="flex flex-col min-h-screen p-6 max-w-6xl ml-auto text-right space-y-6 border-r">
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
            <div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">자산 정보</h1>
                </header>
                <section>
                    <Style.CardAssetDetail
                        icon={Style.formatIcon(asset.assetType)}
                        title={asset.name}
                        value={asset.assetValue} 
                    />
                </section>
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">거래 내역</h1>
                </header>
                <section>
                    {activities.length === 0 ? (
                    <div className="text-muted-foreground text-sm">*거래내역이 없습니다*</div>
                    ) : (
                    <Style.ActivityListEditable 
                        activities={activities}>
                        </Style.ActivityListEditable>
                    )}
                </section>
            </div>
            <div>

            </div>
        </div>
    );
}