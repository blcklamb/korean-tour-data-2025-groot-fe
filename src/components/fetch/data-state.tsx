import { ReactNode } from "react";
import { Button } from "../ui/button";

interface ErrorFallbackProps {
  error?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
  message?: string;
}

export const ErrorFallback = ({
  error,
  onRetry,
  children,
  message = "데이터를 불러오는 중 오류가 발생했습니다.",
}: ErrorFallbackProps) => {
  if (!error) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50">
      <p className="text-red-600 mb-2">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  isLoading?: boolean;
  children?: ReactNode;
  message?: string;
}

export const LoadingState = ({
  isLoading,
  children,
  message = "데이터를 불러오는 중...",
}: LoadingStateProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
