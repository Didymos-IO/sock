import { chat } from "./chat";
import { countToken } from "./countToken";
import { getSpeakers } from "./getSpeakers";
import { loadConfig } from "./loadConfig";
import { saveConfig } from "./saveConfig";
import { transcribe } from "./transcribe";
import { ttsCoqui } from "./tts";

export type { OpenAiChatCompletionMessage } from "./chat";
export type { TTSCoquiOptions, TTSCoquiRequest, TTSCoquiResponse } from "./tts";

export const api = {
  chat,
  countToken,
  getSpeakers,
  loadConfig,
  saveConfig,
  transcribe,
  ttsCoqui,
};
