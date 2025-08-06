'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/backend/client";
import { CreateTransactionModal } from "@/app/mypage/assets/CreateTransactionModal";
import { SquarePlusIcon } from 'lucide-react';
import * as Style from "@/app/components/ui/styles"
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

export default function AssetDetailPage() {
    const router = useRouter();

    const [reloadFlag, setReloadFlag] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const handleCreate = () => {
        setModalOpen(true);
    };

    const params = useParams();

    const id = Number(params.assetId);
    const [asset, setAsset] = useState<Asset>({
        id: 0,
        memberId: 0,
        name: "기본 자산",
        assetType: "DEPOSIT",
        assetValue: 0,
        createDate: new Date().toISOString(),
        modifyDate: new Date().toISOString(),
    });

    const handleDeleteTransaction = async (id: number) => {
        try {
            const deleteRes = await apiFetch(`/api/v1/transactions/asset/${id}`, {
                method: "DELETE",
            });

            const type = deleteRes.data?.type;
            const amount = deleteRes.data?.amount;

            const assetId = deleteRes.data?.assetId;
            const assetRes = await apiFetch(`/api/v1/assets/${assetId}`);

            let newValue = assetRes.data?.assetValue;

            if (type === "ADD") {
                newValue -= amount;
            }
            else {
                newValue += amount;
            }

            await apiFetch(`/api/v1/assets/${assetId}`, {
                method: "PUT",
                body: JSON.stringify({
                    id: assetId,
                    name: assetRes.data?.name,
                    assetType: assetRes.data?.assetType,
                    assetValue: newValue

                }),
            });

            setReloadFlag(prev => !prev);
        } catch (error) {
            console.log("삭제 에러")
        }
    }

    const handleDeleteAsset = async (id: number) => {
        try {
            await apiFetch(`/api/v1/assets/${id}`, {
                method: "DELETE",
            });
            router.push('/mypage/assets');
        } catch (error) {
            console.log("삭제 에러");
        }
    }

    interface activity {
        id: number;
        amount: number;
        type: string;
        date: string;
        content: string;
        assetType: string;
        onDelete?: () => void;
    }

    const [activities, setActivities] = useState<activity[]>([]);
    useEffect(() => {
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
                    onDelete: handleDeleteTransaction
                }))
                    .sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setActivities(assetTransaction);
                setAsset(assetInfo);

            } catch (error) {
                console.log("에러 발생");
            }
        };
        fetchAssetDetail();
    }, [reloadFlag]);

    return (
        <>
            <SideBar active="mypage" />
            <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
                <div></div>
                <div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6">
                    <header className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">자산 정보</h1>
                    </header>
                    <section>
                        <Style.CardAssetDetail
                            id={asset.id}
                            icon={Style.formatIcon(asset.assetType)}
                            title={asset.name}
                            value={asset.assetValue}
                            onDelete={handleDeleteAsset}
                        />
                    </section>
                    <div className='flex flex-row mr-auto gap-2'>
                        <header className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight">거래 내역</h1>
                        </header>
                        <div className="flex ml-auto">
                            <button
                                onClick={handleCreate}
                                className="text-green-600 hover:text-red-800 transition-colors duration-200"
                                aria-label="생성성"
                                type="button"
                            >
                                <SquarePlusIcon></SquarePlusIcon>
                            </button>
                        </div>
                    </div>
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
            <CreateTransactionModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSuccess={() => setReloadFlag(prev => !prev)}
                assetId={id}
            />
        </>
    );
}