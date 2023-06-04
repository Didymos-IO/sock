import { api } from "@/api";
import { IdentitySettings, OpenAiApiSettings } from "@/types";

import { convertMsToSeconds } from "./";

export type ChatMessage = {
  role: string;
  content: string;
};

export type ChatResponse = {
  message: ChatMessage;
  tokensUsed: number;
  time: string;
};

/**
 * Given a user message and a chat history, connect to the LLM API, send the message, and return the generated response.
 */
const thinkUpResponse = async (
  newMessage: string,
  chatHistory: ChatMessage[],
  identity: IdentitySettings,
  openAiApi: OpenAiApiSettings,
  logToConsole?: boolean
): Promise<ChatResponse> => {
  const { memory, personality } = identity;
  const newUserMessage = { role: "user", content: newMessage };
  if (logToConsole) {
    console.log("New user message:", newUserMessage);
  }
  let messagesToSend: ChatMessage[] = [
    { role: "system", content: personality },
    { role: "user", content: `$Behave as if ${personality}` },
  ];
  const messagesFromMemory = _getMessagesThatFitInMemory(
    [...chatHistory, newUserMessage],
    memory
  );
  messagesToSend = messagesToSend.concat(messagesFromMemory);
  const start = Date.now();
  const response = await api.chat(
    messagesToSend,
    openAiApi,
    _calculateMaxTokens(messagesToSend, personality, openAiApi.maxTokens)
  );
  if (logToConsole) {
    console.log("AI response message:", response);
  }
  const end = Date.now();
  const time = convertMsToSeconds(end - start);
  const tokensUsed = response.usage.total_tokens;
  const aiMessage = response.message as ChatMessage;
  return {
    message: aiMessage,
    tokensUsed,
    time,
  };
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ PRIVATE ---------------------------------- */
/* ------------------------------------------------------------------------- */

const _calculateMaxTokens = (
  messages: ChatMessage[],
  personality: string,
  maxTokens: number
) => {
  let tokens = _estimateTokensForString(personality) * 2;
  for (const message of messages) {
    tokens += _estimateTokensForString(message.content);
  }
  const remains = 4096 - tokens;
  return Math.min(remains, maxTokens);
};

const _estimateTokensForString = (text: string): number => {
  const words = text.split(" ").length;
  return Math.ceil(words / 0.75);
};

const _getMessagesThatFitInMemory = (
  messages: ChatMessage[],
  memory: number
) => {
  let totalWords = 0;
  let result: ChatMessage[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const words = message.content.split(" ").length;
    if (totalWords + words <= memory) {
      totalWords += words;
      result.unshift(message);
    } else {
      break;
    }
  }

  return result;
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ EXPORT ----------------------------------- */
/* ------------------------------------------------------------------------- */

export const Brain = {
  thinkUpResponse,
};
