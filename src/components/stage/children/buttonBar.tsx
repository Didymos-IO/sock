import { useContext } from "react";

import { Icons } from "@/components";
import { StageContext } from "@/state";

type ButtonBarProps = {
  onActivateClick: () => void;
  onToggleSpeechSynthesisClick: () => void;
  onToggleTranscriptionClick: () => void;
};

export const ButtonBar = (props: ButtonBarProps) => {
  const {
    onActivateClick,
    onToggleSpeechSynthesisClick,
    onToggleTranscriptionClick,
  } = props;
  const {
    isActive,
    isSpeechSynthesisActive,
    haveRequestedStop,
    onlyRespondWhenSpokenTo,
    setOnlyRespondWhenSpokenTo,
  } = useContext(StageContext)!;
  const isTranscriptionActive = !haveRequestedStop;

  const handleToggleSpeakWhenSpokenToClick = () => {
    setOnlyRespondWhenSpokenTo(!onlyRespondWhenSpokenTo);
  };

  return (
    <div className="d-inline-block me-2">
      <div className="mb-2">
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
      <div>
        <button
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
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
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
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
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
          title="Log speech to chat"
          disabled={true}
        >
          <Icons.Terminal />
        </button>
        {/*
        <button
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
          title="Do not speak to host"
        >
          <Icons.ChatLeftQuote />
        </button>*/}
        <button
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm me-2 px-2"
          title="Do not speak to chat"
          disabled={true}
        >
          <Icons.ChatLeftText />
        </button>
        <button
          className="btn btn-primary d-inline-block bg-gradient custom-shadow-sm px-2"
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
