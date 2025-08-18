import { auth, type UserType } from '@/app/(auth)/auth';
import type { VisibilityType } from '@/components/visibility-selector';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import type { ChatModel } from '@/lib/ai/models';
import { systemPrompt, type RequestHints } from '@/lib/ai/prompts';
import { myProvider } from '@/lib/ai/providers';
import { actionImplementationAgent } from '@/lib/ai/tools/action-implementation-agent';
import { brandMonitorAgent } from '@/lib/ai/tools/brand-monitor-agent';
import { brandMonitorTool } from '@/lib/ai/tools/brand-monitor-tool';
import { competitiveIntelligenceTool } from '@/lib/ai/tools/competitive-intelligence-tool';
import { createDocument } from '@/lib/ai/tools/create-document';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { visibilityAcrossModelsTool } from '@/lib/ai/tools/visibility-across-models-tool';
import { visibilityExplorerAgent } from '@/lib/ai/tools/visibility-explorer-agent';
import { ArtifactProcessor } from '@/lib/artifacts/artifact-processor';
import { isProductionEnvironment } from '@/lib/constants';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage } from '@/lib/types';
import { convertToUIMessages, generateUUID } from '@/lib/utils';
import { geolocation } from '@vercel/functions';
import {
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
import { after } from 'next/server';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { generateTitleFromUserMessage } from '../../actions';
import { postRequestBodySchema, type PostRequestBody } from './schema';

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel['id'];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError('rate_limit:chat').toResponse();
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError('forbidden:chat').toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        console.log('Chat API - Starting stream execution');
        console.log('Chat API - selectedChatModel:', selectedChatModel);
        console.log('Chat API - uiMessages:', uiMessages);
        console.log(
          'Chat API - uiMessages[0].parts:',
          JSON.stringify(uiMessages[0]?.parts, null, 2),
        );

        console.log('Chat API - About to call convertToModelMessages');

        // Custom conversion function to handle UI messages properly
        const modelMessages = uiMessages
          .filter((msg) => msg.parts && msg.parts.length > 0) // Only include messages with content
          .map((msg) => ({
            role: msg.role,
            content: msg.parts
              .filter((part) => part.type === 'text')
              .map((part) => (part as any).text)
              .join(' ')
              .trim(),
          }))
          .filter((msg) => msg.content.length > 0); // Only include messages with non-empty content

        console.log('Chat API - modelMessages:', modelMessages);
        console.log(
          'Chat API - modelMessages[0].content:',
          JSON.stringify(modelMessages[0]?.content, null, 2),
        );

        console.log('Chat API - About to call myProvider.languageModel');
        const model = myProvider.languageModel(selectedChatModel);
        console.log('Chat API - model:', model);

        // Initialize artifact processor
        const artifactProcessor = new ArtifactProcessor();

        console.log('Chat API - About to call streamText');
        const result = streamText({
          model: model,
          system: systemPrompt({ selectedChatModel, requestHints }),
          messages: modelMessages,
          stopWhen: stepCountIs(5),
          // For Mastra agents, tools are built-in, so we don't need external tools
          experimental_activeTools:
            selectedChatModel === 'weather-agent'
              ? []
              : selectedChatModel === 'chat-model-reasoning'
                ? []
                : [
                    'getWeather',
                    'createDocument',
                    'updateDocument',
                    'requestSuggestions',
                    'brandMonitorAgent',
                    'brandMonitor',
                    'competitiveIntelligence',
                    'visibilityExplorerAgent',
                    'actionImplementationAgent',
                    'visibilityAcrossModels',
                  ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          // Only provide tools for non-Mastra models
          tools:
            selectedChatModel === 'weather-agent'
              ? {}
              : {
                  getWeather,
                  createDocument: createDocument({ session, dataStream }),
                  updateDocument: updateDocument({ session, dataStream }),
                  requestSuggestions: requestSuggestions({
                    session,
                    dataStream,
                  }),
                  brandMonitorAgent,
                  brandMonitor: brandMonitorTool,
                  competitiveIntelligence: competitiveIntelligenceTool,
                  visibilityExplorerAgent,
                  actionImplementationAgent,
                  visibilityAcrossModels: visibilityAcrossModelsTool,
                },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
          onToolCall: async ({ toolCall }) => {
            console.log(`Executing tool: ${toolCall.toolName}`, toolCall.args);
          },
                      onToolResult: async ({ toolCall, result }) => {
              // Process tool result into artifact
              if (
                toolCall.toolName === 'visibilityAcrossModels' ||
                toolCall.toolName === 'brandMonitor' ||
                toolCall.toolName === 'competitiveIntelligence'
              ) {
                await artifactProcessor.processToolResult(
                  toolCall.toolName,
                  result,
                  {
                    userId: session.user.id,
                    conversationId: id,
                    timestamp: new Date().toISOString(),
                  },
                );
              }
            },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          }),
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream()),
        ),
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    // Handle other errors
    console.error('Chat API error:', error);
    return new ChatSDKError('bad_request:api').toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
