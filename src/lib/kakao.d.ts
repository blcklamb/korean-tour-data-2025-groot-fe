// 카카오 JavaScript SDK 타입 정의
declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (options: { redirectUri?: string }) => void;
        login: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (err: unknown) => void;
        }) => void;
        logout: (callback?: () => void) => void;
        getAccessToken: () => string | null;
        setAccessToken: (token: string, persist?: boolean) => void;
      };
      API: {
        request: (options: {
          url: string;
          success: (data: unknown) => void;
          fail: (error: unknown) => void;
        }) => void;
      };
    };
  }
}

export {};
