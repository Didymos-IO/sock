export type OpenAiChatCompletionMessage = {
  role: string;
  content: string;
};

export const countToken = async (
  messages: OpenAiChatCompletionMessage[]
): Promise<any> => {
  const response = await fetch("http://127.0.0.1:8000/count-tokens", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
    }),
  });
  return response.json();
};
