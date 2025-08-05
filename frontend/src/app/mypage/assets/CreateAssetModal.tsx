import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { apiFetch } from "@/lib/backend/client";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAssetModal({ open, onOpenChange, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [assetType, setAssetType] = useState("DEPOSIT");

  const handleCreate = async () => {
    try {
      const ResponseRes = await apiFetch('/api/v1/assets/member', {
        method: "POST",
        body: JSON.stringify({
          name: name,
          assetType: assetType,
          assetValue: value
        }),
    });
      const assetId = ResponseRes.data?.id;
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 23);
      await apiFetch('/api/v1/transactions/asset', {
        method: "POST",
        body: JSON.stringify({
          assetId: assetId,
          type: "ADD",
          amount: value,
          content: "자산 등록",
          date: formattedDate
        }),
    });
      onOpenChange(false);        // 모달 닫기
      onSuccess?.();  
    } catch(error) {
      console.log("에러 발생.")
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>자산 추가</DialogTitle>
        </DialogHeader>
        <div>
          {/* 자산 생성 폼 넣기 */}
          <input
            type="text"
            placeholder="이름"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="가치"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <div className="mb-2">
          <label className="block mb-1 font-bold">자산 유형</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="assetType"
                value="DEPOSIT"
                className="accent-blue-600"
                onChange={() => setAssetType("DEPOSIT")}
              />
              예금/적금
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="assetType"
                value="REAL_ESTATE"
                className="accent-blue-600"
                onChange={() => setAssetType("REAL_ESTATE")}
              />
              부동산
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="assetType"
                value="STOCK"
                className="accent-blue-600"
                onChange={() => setAssetType("STOCK")}
              />
              주식
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