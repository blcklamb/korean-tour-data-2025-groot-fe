import "./globals.css";

import BottomFixedNavigator from "@/components/ui/bottom-fixed-navigator";
import KakaoInitializer from "@/lib/kakao-initilaizer";
import { QueryProvider } from "@/lib/query-client";

export const metadata = {
  title: "Groot | 관광데이터 활용 공모전 2025",
  description: "지속 가능한 생태관광 인증 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 카카오 SDK */}
        <KakaoInitializer />
      </head>
      <body>
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4">
              <div className="max-w-lg mx-auto">{children}</div>
              <div className="h-20" />
            </main>
            <BottomFixedNavigator />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
