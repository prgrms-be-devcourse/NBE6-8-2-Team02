import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { apiFetch } from "@/lib/backend/client";
import { useEffect, useState } from "react";

interface Props {
    assetId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface AssetInfo {
    assetName: string;
    assetType: string;
    assetValue: number;
}

export function CreateTransactionModal({ open, onOpenChange, onSuccess, assetId }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [assetType, setAssetType] = useState("");
  const [assetInfo, setAssetInfo] = useState<AssetInfo>({
    assetName: '',
    assetType: '',
    assetValue: 0,
  });

  useEffect (() => {
    const fetchAssetInfo = async () => {
        const assetRes = await apiFetch(`/api/v1/assets/${assetId}`);
        const assetName = assetRes.data?.name;
        const assetType = assetRes.data?.assetType;
        const assetValue = assetRes.data?.assetValue;

        const asset: AssetInfo = {
            assetName: assetName,
            assetType: assetType,
            assetValue: assetValue,
          };

        setAssetInfo(asset);
    }
    fetchAssetInfo();
  }, []);

  const handleCreate = async () => {
    try {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 23);
      await apiFetch('/api/v1/transactions/asset', {
        method: "POST",
        body: JSON.stringify({
          assetId: assetId,
          type: assetType,
          amount: value,
          content: name,
          date: formattedDate
        }),
    });

    let newValue = assetInfo.assetValue;
    if(assetType === "ADD"){
        newValue += value;
    }
    else{
        newValue -= value;
    }

    await apiFetch(`/api/v1/assets/${assetId}`, {
        method: "PUT",
        body: JSON.stringify({
          id: assetId,
          name: assetInfo.assetName,
          assetType: assetInfo.assetType,
          assetValue: newValue,
          
        }),
    });

      onOpenChange(false); 
      onSuccess?.();  
    } catch(error) {
      console.log("에러 발생.")
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>거래 추가</DialogTitle>
        </DialogHeader>
        <div>
          <input
            type="text"
            placeholder="이름"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="거래량"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <div className="mb-2">
          <label className="block mb-1 font-bold">거래 유형</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="ADD"
                value="ADD"
                className="accent-blue-600"
                onChange={() => setAssetType("ADD")}
              />
              수익
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="REMOVE"
                value="REMOVE"
                className="accent-blue-600"
                onChange={() => setAssetType("REMOVE")}
              />
              지출
            </label>
          </div>
        </div>
          <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleCreate}
          >
            추가
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}