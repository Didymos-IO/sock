export type TTSCoquiOptions = {
  language?: string;
  model?: string;
  speaker?: string;
  speed?: number;
  emotion?: string;
};

export type TTSCoquiRequest = TTSCoquiOptions & {
  text: string;
};

export type TTSCoquiResponse = {
  audioUrl: string;
};

export const ttsCoqui = async (
  text: string,
  options?: TTSCoquiOptions
): Promise<TTSCoquiResponse> => {
  const request_json: TTSCoquiRequest = { text, ...options };

  const response = await fetch("http://127.0.0.1:8000/tts_coqui", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request_json),
  });
  const data = await response.json();
  return data;
};
