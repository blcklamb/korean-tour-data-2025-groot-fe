"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function KakaoInitializer() {
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    const handleKakaoInit = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          if (!process.env.NEXT_PUBLIC_KAKAO_SDK_KEY) return;
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_SDK_KEY);
        }
      } else {
        console.error("Kakao SDK not loaded");
      }
    };

    if (kakaoLoaded) {
      handleKakaoInit();
    }
  }, [kakaoLoaded]);

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.8/kakao.min.js"
      integrity="sha384-WUSirVbD0ASvo37f3qQZuDap8wy76aJjmGyXKOYgPL/NdAs8HhgmPlk9dz2XQsNv"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        window.Kakao?.init(process.env.NEXT_PUBLIC_KAKAO_SDK_KEY as string);
        console.log(window.Kakao?.isInitialized());
        setKakaoLoaded(true);
      }}
    />
  );
}
