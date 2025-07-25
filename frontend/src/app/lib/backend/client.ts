const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiFetch = (url: string, options?: RequestInit) => {
  options = options || {};
  options.credentials = "include";

  if (options.body) {
    const headers = new Headers(options?.headers || {});

    // body가 FormData 인지 체크
    const isFormData = options.body instanceof FormData;

    if (!headers.has("Content-Type") && !isFormData) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    options.headers = headers;
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then((res) => {
    if (!res.ok) {
      return res.json().then((errorData) => {
        throw errorData;
      });
    }
    return res.json();
  });
};