export interface ChatMessage {
     id: string;
     role: 'user' | 'assistant';
     content: string;
     toolInvocations?: ToolInvocation[];
     createdAt: Date;
   }
   
   export interface ToolInvocation {
     id: string;
     type: string;
     args: Record<string, any>;
     result?: any;
   }