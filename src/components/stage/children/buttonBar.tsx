import { useContext } from "react";

import { Icons } from "@/components";
import { StageContext } from "@/state";

type ButtonBarProps = {
  onActivateClick: () => void;
  onToggleSpeechSynthesisClick: () => void;
  onToggleTranscriptionClick: () => void;
  onToggleTwitchClick: () => void;
};

export const ButtonBar = (props: ButtonBarProps) => {
  const {
    onActivateClick,
    onToggleSpeechSynthesisClick,
    onToggleTranscriptionClick,
    onToggleTwitchClick,
  } = props;
  const {
    isActive,
    isChatReadOutloud,
    isSpeechSynthesisActive,
    isTwitchActive,
    haveRequestedStop,
    onlyRespondWhenSpokenTo,
    setIsChatReadOutloud,
    setOnlyRespondWhenSpokenTo,
  } = useContext(StageContext)!;
  const isTranscriptionActive = !haveRequestedStop;

  const handleToggleSpeakWhenSpokenToClick = () => {
    setOnlyRespondWhenSpokenTo(!onlyRespondWhenSpokenTo);
  };

  return (
    <div className="">
      <div id="power-button" className="mb-2 d-inline-block me-2">
        <button
          className={`activate-button btn ${
            isActive ? "btn-secondary" : "btn-primary"
          } btn-lg bg-gradient custom-shadow-sm`}
          type="button"
          onClick={onActivateClick}
        >
          <Icons.Power />
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
      <div className="d-inline-block">
        <button
          className={`btn btn-primary btn-lg d-inline-block bg-gradient custom-shadow-sm me-2 px-2 ${
            isTranscriptionActive ? "" : "text-dark"
          }`}
          title={
            isTranscriptionActive
              ? "Turn off transcription"
              : "Turn on transcription"
          }
          onClick={onToggleTranscriptionClick}
          disabled={!isActive}
        >
          <Icons.Ear isActive={isTranscriptionActive} />
        </button>
        <button
          className={`btn btn-primary btn-lg d-inline-block bg-gradient custom-shadow-sm me-2 px-2 ${
            isSpeechSynthesisActive ? "" : "text-dark"
          }`}
          onClick={onToggleSpeechSynthesisClick}
          title={
            isSpeechSynthesisActive
              ? "Turn off speech synthesis"
              : "Turn on speech synthesis"
          }
          disabled={!isActive}
        >
          <Icons.Speaker isActive={isSpeechSynthesisActive} />
        </button>
        <button
          className={`btn btn-primary btn-lg d-inline-block bg-gradient custom-shadow-sm me-2 px-2 ${
            isChatReadOutloud ? "" : "text-dark"
          }`}
          title={isChatReadOutloud ? "Don't read outloud" : "Read chat outloud"}
          disabled={!isActive}
          onClick={() => setIsChatReadOutloud(!isChatReadOutloud)}
        >
          <Icons.Robot />
        </button>
        {/*
        <button
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
          title="Do not speak to host"
        >
          <Icons.ChatLeftQuote />
        </button>*/}
        <button
          className={`btn btn-primary btn-lg d-inline-block bg-gradient custom-shadow-sm me-2 px-2 ${
            isTwitchActive ? "" : "text-dark"
          }`}
          title={
            isTwitchActive ? "Disconnect from Twitch" : "Connect to Twitch"
          }
          disabled={!isActive}
          onClick={onToggleTwitchClick}
        >
          <Icons.Twitch />
        </button>
        <button
          className={`btn btn-primary btn-lg d-inline-block bg-gradient custom-shadow-sm px-2 ${
            onlyRespondWhenSpokenTo ? "" : "text-dark"
          }`}
          title={
            onlyRespondWhenSpokenTo
              ? "Speak when a number of words are spoken."
              : "Only respond when name is spoken"
          }
          disabled={!isActive}
          onClick={handleToggleSpeakWhenSpokenToClick}
        >
          <Icons.ChatDots isActive={onlyRespondWhenSpokenTo} />
        </button>
      </div>
    </div>
  );
};
