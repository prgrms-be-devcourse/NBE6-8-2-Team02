'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { apiFetch } from "@/lib/backend/client";

interface NoticeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  noticeId?: number;
  initialData?: {
    title: string;
    content: string;
  };
}

export function NoticeForm({ 
  open, 
  onOpenChange, 
  onSuccess, 
  mode, 
  noticeId, 
  initialData 
}: NoticeFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else if (open && mode === 'create') {
      setTitle('');
      setContent('');
    }
  }, [open, mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'create') {
        await apiFetch('/api/v1/notices', {
          method: 'POST',
          body: JSON.stringify({ title, content }),
        });
      } else if (mode === 'edit' && noticeId) {
        await apiFetch(`/api/v1/notices/${noticeId}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content }),
        });
      }

      setTitle('');
      setContent('');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(`공지사항 ${mode === 'create' ? '생성' : '수정'} 실패:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'create' ? '공지사항 작성' : '공지사항 수정';
  };

  const getButtonText = () => {
    return isLoading 
      ? (mode === 'create' ? '작성 중...' : '수정 중...')
      : (mode === 'create' ? '작성' : '수정');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {getButtonText()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 