import { ChangeEvent, KeyboardEvent, useContext, useState } from "react";

import { Icons } from "@/components";
import { StageContext } from "@/state";

export type TranscriptionOrChatBoxProps = {
  onSubmit: (text: string) => void;
};

export const TranscriptionOrChatBox = (props: TranscriptionOrChatBoxProps) => {
  const { onSubmit } = props;
  const { haveRequestedStop, transcribedText } = useContext(StageContext)!;
  const mode = haveRequestedStop ? "chat" : "transcription";
  const [chatText, setChatText] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatText(event.target.value);
  };

  const handleClick = () => {
    onSubmit(chatText);
    setChatText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(chatText);
      setChatText("");
    }
  };

  return mode === "transcription" ? (
    <div className="transcription-box alert alert-primary p-2 fs-7 mb-0">
      <p className="mb-0">
        <b>Transcription: </b>
        {transcribedText}
      </p>
    </div>
  ) : (
    <div className="chat-box rounded p-2 bg-dark custom-shadow-inset-sm position-relative">
      <input
        type="text"
        className="form-control border-0 ps-0 py-0"
        placeholder="Send a message..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={chatText}
      />
      <button
        type="button"
        className="send-button btn btn-warning text-black bg-gradient custom-shadow-sm"
        onClick={handleClick}
      >
        <Icons.Send isActive={true} />
      </button>
    </div>
  );
};
