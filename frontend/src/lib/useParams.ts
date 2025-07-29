import { useRouter } from "../app/components/Router";
import { routes } from "../app/config/routes";

export function useParams(): Record<string, string> {
  const { currentPath } = useRouter();

  // 경로와 currentPath가 맞으면 파라미터 반환, 아니면 null
  function matchPathWithParams(pathPattern: string, actualPath: string) {
    const patternParts = pathPattern.split("/").filter(Boolean);
    const pathParts = actualPath.split("/").filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(":")) {
        const key = patternPart.slice(1);
        params[key] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return params;
  }

  for (const route of routes) {
    const params = matchPathWithParams(route.path, currentPath);
    if (params) return params;
  }

  return {};
}
