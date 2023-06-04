import axios from "axios";

export type TranscribeApiEndpointOptions = {
  language?: string;
  modelSize?: string;
};

export const transcribe = async (
  blob: Blob,
  options?: TranscribeApiEndpointOptions
): Promise<string> => {
  const headers = {
    "content-type": "multipart/form-data",
  };
  const language = options?.language || "english";
  const modelSize = options?.modelSize || "base";
  const formData = new FormData();
  formData.append("language", language);
  formData.append("model_size", modelSize); // options are "tiny", "base", "medium" (no english models for "large", "large-v1")
  formData.append("audio_data", blob, `tr_${new Date().getTime()}`); // "temp_recording");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/transcribe",
      formData,
      { headers }
    );
    return response.data as string;
  } catch (error) {
    // sometimes the transcription fails on the server, so we'll just return an empty string to avoid breaking the app
    return "";
  }
};
