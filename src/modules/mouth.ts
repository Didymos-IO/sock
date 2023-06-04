import { api, TTSCoquiOptions, TTSCoquiResponse } from "@/api";
import { TtsSettings } from "@/types";

import { convertMsToSeconds } from "./";

export type TTSWebSpeechOptions = {
  voice?: number;
  pitch?: number;
  rate?: number;
};

const audioContext = new AudioContext();
let audioSource = audioContext.createBufferSource();
const synthesis: SpeechSynthesis = window.speechSynthesis;

/**
 * Cancel any current speech and disconnect the audio source.
 */
const shutUp = () => {
  if (audioContext.state === "running") {
    audioSource.stop();
    audioSource.disconnect();
  }
  synthesis.cancel();
};

/**
 * Generate speech using the provided text, depending on the `tts` settings. Promise returns once speech ends.
 */
const speak = (
  text: string,
  settings: TtsSettings,
  onStartSpeaking?: () => void
): Promise<string> => {
  if (settings.engine === "Coqui-AI") {
    const { optionsCoquiAi } = settings;
    const coquiOptions: TTSCoquiOptions = {
      model: optionsCoquiAi.model,
      speaker: optionsCoquiAi.voice,
      speed: optionsCoquiAi.rate,
      emotion: optionsCoquiAi.emotion,
    };

    return speakViaCoqui(text, coquiOptions, onStartSpeaking);
  } else {
    const { optionsWebSpeech } = settings;
    if (onStartSpeaking) {
      onStartSpeaking();
    }
    return speakViaWebSpeech(text, optionsWebSpeech);
  }
};

/**
 * Generate speech using a local instance of the Coqui TTS model. Promise returns once speech ends.
 */
const speakViaCoqui = async (
  text: string,
  options?: TTSCoquiOptions,
  onStartSpeaking?: () => void
): Promise<string> => {
  const start = Date.now();
  let end: number = 0;
  return api
    .ttsCoqui(text, options)
    .then(async (response: TTSCoquiResponse) => {
      const wav = await _decodeBase64Wav(response.audioUrl);
      end = Date.now();
      if (onStartSpeaking) {
        onStartSpeaking();
      }
      await _playAudioBuffer(wav);
      const time = convertMsToSeconds(end - start);
      return time;
    });
};

/**
 * Generate speech using the Web Speech API. Promise returns once speech ends.
 */
const speakViaWebSpeech = (
  text: string,
  options?: TTSWebSpeechOptions
): Promise<string> => {
  return new Promise<string>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      synthesis.getVoices()[
        typeof options?.voice !== "undefined" ? options.voice : 0
      ];
    if (options?.pitch) {
      utterance.pitch = options.pitch;
    }
    if (options?.rate) {
      utterance.rate = options.rate;
    }
    utterance.onend = () => {
      resolve("00.00");
    };
    synthesis.speak(utterance);
  });
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ PRIVATE ---------------------------------- */
/* ------------------------------------------------------------------------- */

/**
 * Convert a base64-encoded WAV file to an AudioBuffer.
 */
const _decodeBase64Wav = (base64Audio: string): Promise<AudioBuffer> => {
  const binaryString = window.atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return audioContext.decodeAudioData(bytes.buffer);
};

/**
 * Play an AudioBuffer.
 * @param wav
 * @returns
 */
const _playAudioBuffer = (buffer: AudioBuffer): Promise<void> => {
  return new Promise<void>((resolve) => {
    audioSource.disconnect();
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = buffer;
    audioSource.connect(audioContext.destination);
    audioSource.addEventListener("ended", () => {
      resolve();
    });
    audioSource.start();
  });
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ EXPORT ----------------------------------- */
/* ------------------------------------------------------------------------- */

export const Mouth = {
  shutUp,
  speak,
  speakViaCoqui,
  speakViaWebSpeech,
};
