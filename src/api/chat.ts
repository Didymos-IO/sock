import { OpenAiApiSettings } from "@/types";

export type OpenAiChatCompletionMessage = {
  role: string;
  content: string;
  name?: string;
};

export const chat = async (
  messages: OpenAiChatCompletionMessage[],
  options: OpenAiApiSettings,
  maxTokens: number
): Promise<any> => {
  let request = {
    messages: messages,
    temperature: options?.temperature ? options.temperature : 1,
    presence_penalty: options?.presencePenalty ? options.presencePenalty : 0,
    frequency_penalty: options?.frequencyPenalty ? options.frequencyPenalty : 0,
    max_tokens: maxTokens,
  };

  console.log("request", request);

  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return {
    message: data.choices[0].message,
    usage: data.usage,
  };
};
