import { useContext } from "react";

import { Icons } from "@/components";
import { Helpers } from "@/modules";
import { StageContext } from "@/state";

export const Status = () => {
  const {
    aiTime,
    isSpeaking,
    isThinking,
    isTranscribing,
    onlyRespondWhenSpokenTo,
    tokensUsed,
    transcribedText,
    transcriptionTime,
    ttsTime,
    wordCountBeforeResponse,
  } = useContext(StageContext)!;
  const wordCount = Helpers.getWordCount(transcribedText.toLowerCase());

  const calculateSessionCost = () => {
    return ((tokensUsed / 1000) * 0.002).toFixed(3);
  };

  function formatNumber(number: number, padding: number): string {
    const paddedNumber = String(number).padStart(padding, "0");
    return paddedNumber;
  }

  return (
    <div className="stat-holder d-inline-block align-top text-end fs-7">
      <div className="session-usage">
        <span>Tokens: {formatNumber(tokensUsed, 5)}</span>
        <span> • </span>
        <span>Session Cost ${calculateSessionCost()}</span>
      </div>
      <div className="performance">
        <span>Transcribe: {transcriptionTime}s</span>
        <span> • </span>
        <span>LLM: {aiTime}s</span>
        <span> • </span>
        <span>TTS: {ttsTime}s</span>
      </div>
      <div className="words-left">
        {onlyRespondWhenSpokenTo ? (
          <div>Only responds after name is spoken</div>
        ) : (
          <div>
            Talks after {wordCountBeforeResponse - wordCount} more words
          </div>
        )}
      </div>
      <div className="API Statuses">
        <small
          className={`d-inline-flex mt-1 px-1 py-1 mb-0 fw-semibold bg-gray-800 border ${
            isTranscribing
              ? "text-white border-white"
              : "text-primary-emphasis border-primary-subtle"
          } rounded-2 me-2`}
        >
          <Icons.Ear />
        </small>
        <small
          className={`d-inline-flex mt-1 px-1 py-1 mb-0 fw-semibold bg-gray-800 border ${
            isThinking
              ? "text-white border-white"
              : "text-primary-emphasis border-primary-subtle"
          } rounded-2 me-2`}
        >
          <Icons.CPU />
        </small>
        <small
          className={`d-inline-flex mt-1 px-1 py-1 mb-0 fw-semibold bg-gray-800 border ${
            isSpeaking
              ? "text-white border-white"
              : "text-primary-emphasis border-primary-subtle"
          } rounded-2`}
        >
          <Icons.ChatLeftQuote />
        </small>
      </div>
    </div>
  );
};
