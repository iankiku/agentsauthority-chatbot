'use client';
   
   import { memo } from 'react';
   import type { UIMessage } from '@ai-sdk/react';
   import { Message } from './message';
   import { ThinkingMessage } from './thinking-message';
   
   interface MessagesProps {
     messages: UIMessage[];
     status: string;
   }
   
   function PureMessages({ messages, status }: MessagesProps) {
     return (
       <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative">
         {messages.map((message, index) => (
           <Message
             key={message.id}
             message={message}
             isLoading={status === 'streaming' && messages.length - 1 === index}
             isReadonly={false}
             requiresScrollPadding={false}
           />
         ))}
         
         {status === 'submitted' && <ThinkingMessage />}
       </div>
     );
   }
   
   export const Messages = memo(PureMessages);
   