import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

export function useParams() {
  // Next.js 13+ App Router 방식
  const searchParams = useSearchParams();
  
  // URL에서 id 파라미터 추출
  const getParams = () => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    
    // /mypage/notices/:id 패턴에서 id 추출
    const noticesIndex = segments.findIndex(segment => segment === 'notices');
    if (noticesIndex !== -1 && segments[noticesIndex + 1]) {
      return { id: segments[noticesIndex + 1] };
    }
    
    return null;
  };

  return getParams();
} 