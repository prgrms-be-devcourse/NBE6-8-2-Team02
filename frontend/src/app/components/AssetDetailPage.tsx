'use client';
import { useRouter } from "./Router";
import { useParams } from "@/lib/useParams";
import { useEffect } from "react";
import { apiFetch } from "../lib/backend/client";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins, Section} from 'lucide-react';

export function AssetDetailPage() {
    const { navigate } = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect (() => {
        const fetchAssetDetail = async () => {
            try {
              const assetRes = await apiFetch(`/api/v1/assets/${id}`);
              const assetInfo = assetRes.data;
              
              console.log(assetInfo);
      
            } catch (error) {
                console.log("에러 발생");
            }
        };
        fetchAssetDetail();
    }, []);
    


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
            </div>
            <div>

            </div>
            <div>
                
            </div>
        </div>
    );
}