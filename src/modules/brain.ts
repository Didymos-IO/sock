import { api } from "@/api";
import {
  EnforcementSettings,
  IdentitySettings,
  OpenAiApiSettings,
} from "@/types";

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
  enforcement: EnforcementSettings,
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
  console.log("messagesToSend:", messagesToSend);
  const start = Date.now();
  const response = await _attemptToGetUnfilteredResponse(
    messagesToSend,
    enforcement,
    openAiApi,
    personality,
    logToConsole
  );
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

const _attemptToGetUnfilteredResponse = async (
  messages: ChatMessage[],
  enforcement: EnforcementSettings,
  openAiApi: OpenAiApiSettings,
  personality: string,
  logToConsole?: boolean
) => {
  let reattempts = enforcement.reattempts + 1; // we want it to attempt it at least once.
  let tokensUsed = 0;
  while (reattempts > 0) {
    let response = await api.chat(
      messages,
      openAiApi,
      _calculateMaxTokens(messages, personality, openAiApi.maxTokens)
    );
    tokensUsed += response.usage.total_tokens;
    if (logToConsole) {
      console.log("AI response message:", response);
    }
    if (_checkIfResponseTriggersFilters(response.message, enforcement)) {
      if (logToConsole) {
        console.log(
          "Response triggered filters, must reattempt if able to do so."
        );
      }
      reattempts--;
      if (enforcement.correctiveMessage && reattempts > 0) {
        const messagesWithInstruction = messages.concat([
          { role: "user", content: enforcement.correctiveMessage },
        ]);
        if (logToConsole) {
          console.log("Sending corrective message.");
        }
        const responseToInstruction = await api.chat(
          messagesWithInstruction,
          openAiApi,
          _calculateMaxTokens(
            messagesWithInstruction,
            personality,
            openAiApi.maxTokens
          )
        );
        tokensUsed += responseToInstruction.usage.total_tokens;
      }
    } else {
      response.usage.total_tokens = tokensUsed;
      return response;
    }
  }
  if (logToConsole) {
    console.log("Giving up on reattempts. Returning default response.");
  }
  const response = {
    message: { role: "system", content: enforcement.giveupDefaultResponse },
    usage: {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: tokensUsed,
    },
  };
  if (logToConsole) {
    console.log("Default response message:", response);
  }
  return response;
};

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

const _checkIfResponseTriggersFilters = (
  message: ChatMessage,
  enforcement: EnforcementSettings
) => {
  const filters = enforcement.responseFilterList;
  const content = message.content.toLowerCase();
  for (const filter of filters) {
    if (content.includes(filter.toLowerCase().trim())) {
      return true;
    }
  }
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
