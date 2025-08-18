// apps/dashboard/components/v2/chat/ai-input.tsx
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';

export function AiInput({ input, setInput, sendMessage, status }: { input: string, setInput: (input: string) => void, sendMessage: (message: any) => void, status: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'ready') {
      sendMessage({ role: 'user', content: input });
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <Textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your brand visibility..."
      />
      <Button type="submit" disabled={status !== 'ready'}>
        Send
      </Button>
    </form>
  );
}
