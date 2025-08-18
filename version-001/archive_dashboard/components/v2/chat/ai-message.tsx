// apps/dashboard/components/v2/chat/ai-message.tsx
import React from 'react';

export function PreviewMessage({ message }: { message: any }) {
  return (
    <div className="p-4 border-b">
      <strong>{message.role}:</strong> {message.content}
    </div>
  );
}
