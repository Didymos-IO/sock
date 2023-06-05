export type TranscribeApiEndpointOptions = {
  language?: string;
  modelSize?: string;
};

export const transcribe = async (
  blob: Blob,
  options?: TranscribeApiEndpointOptions
): Promise<string> => {
  const language = options?.language || "english";
  const modelSize = options?.modelSize || "base";
  const formData = new FormData();
  formData.append("language", language);
  formData.append("model_size", modelSize); // options are "tiny", "base", "medium" (no english models for "large", "large-v1")
  formData.append("audio_data", blob, `tr_${new Date().getTime()}`); // "temp_recording");

  try {
    const response = await fetch("http://127.0.0.1:8000/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.text();
    return data as string;
  } catch (error) {
    // sometimes the transcription fails on the server, so we'll just return an empty string to avoid breaking the app
    return "";
  }
};
