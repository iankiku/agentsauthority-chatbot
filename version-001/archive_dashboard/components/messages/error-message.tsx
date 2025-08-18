'use client';

import { Button } from '@workspace/ui/components/button';

interface ErrorMessageProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-red-500">{error.message}</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}
