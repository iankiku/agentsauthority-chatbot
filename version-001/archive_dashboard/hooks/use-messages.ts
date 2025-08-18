import { useEffect, useRef } from 'react';

export function useMessages({ status }: { status: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'ready' && endRef.current) {
      endRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [status]);

  return { containerRef, endRef };
}