import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 전화번호에서 하이픈 제거 (숫자만 추출)
export function formatPhoneNumberForInput(phoneNumber: string): string {
  return phoneNumber.replace(/[^0-9]/g, "");
}

// 전화번호에 하이픈 추가 (표시용)
export function formatPhoneNumberForDisplay(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");

  if (cleaned.length === 11) {
    // 01012345678 -> 010-1234-5678
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    // 0101234567 -> 010-123-4567
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return phoneNumber; // 형식이 맞지 않으면 원본 반환
}

// 전화번호 유효성 검사 (숫자만)
export function validatePhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");
  return cleaned.length === 11 && cleaned.startsWith("010");
}
