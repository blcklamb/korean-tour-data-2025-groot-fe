"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// Query Client 기본 설정
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR과 클라이언트 간 hydration 문제 방지
        staleTime: 60 * 1000, // 1분
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // 특정 에러에 대해서는 재시도하지 않음
          const apiError = error as { status?: number };
          if (apiError?.status === 404 || apiError?.status === 401) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // 전역 에러 처리 로직
          console.error("Mutation error:", error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: 항상 새로운 query client 생성
    return makeQueryClient();
  } else {
    // Browser: query client가 없으면 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  // useState를 사용하여 클라이언트에서만 query client 생성
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
