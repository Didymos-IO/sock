import React, { createContext, useMemo, useState } from "react";
import { ChatMessage } from "@/modules";
import { StageContextType } from "@/types";

type StageProviderProps = {
  children: React.ReactNode;
};

export const StageContext = createContext<StageContextType | undefined>(
  undefined
);

export const StageProvider = (props: StageProviderProps) => {
  const { children } = props;

  const [aiTime, setAiTime] = useState("00.00");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [haveRequestedStop, setHaveRequestedStop] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechSynthesisActive, setIsSpeechSynthesisActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTTSSpeaking, setIsTTSSpeaking] = useState(false);
  const [isTwitchActive, setIsTwitchActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isChatReadOutloud, setIsChatReadOutloud] = useState(false);
  const [location, setLocation] = useState("");
  const [newestBlob, setNewestBlob] = useState<Blob>();
  const [onlyRespondWhenSpokenTo, setOnlyRespondWhenSpokenTo] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [transcribeTimeout, setTranscribeTimeout] = useState(2);
  const [transcriptionTime, setTranscriptionTime] = useState("00.00");
  const [ttsTime, setTtsTime] = useState("00.00");
  const [wordCountBeforeResponse, setWordCountBeforeResponse] = useState(0);

  const context = useMemo(() => {
    return {
      aiTime,
      setAiTime,
      chatHistory,
      setChatHistory,
      haveRequestedStop,
      setHaveRequestedStop,
      isActive,
      setIsActive,
      isChatReadOutloud,
      setIsChatReadOutloud,
      isRecording,
      setIsRecording,
      isSpeaking,
      setIsSpeaking,
      isSpeechSynthesisActive,
      setIsSpeechSynthesisActive,
      isThinking,
      setIsThinking,
      isTranscribing,
      setIsTranscribing,
      isTTSSpeaking,
      setIsTTSSpeaking,
      isTwitchActive,
      setIsTwitchActive,
      location,
      setLocation,
      newestBlob,
      setNewestBlob,
      onlyRespondWhenSpokenTo,
      setOnlyRespondWhenSpokenTo,
      tokensUsed,
      setTokensUsed,
      transcribedText,
      setTranscribedText,
      transcribeTimeout,
      setTranscribeTimeout,
      transcriptionTime,
      setTranscriptionTime,
      ttsTime,
      setTtsTime,
      wordCountBeforeResponse,
      setWordCountBeforeResponse,
    };
  }, [
    aiTime,
    chatHistory,
    haveRequestedStop,
    isActive,
    isChatReadOutloud,
    isRecording,
    isSpeaking,
    isSpeechSynthesisActive,
    isThinking,
    isTranscribing,
    isTTSSpeaking,
    isTwitchActive,
    location,
    newestBlob,
    onlyRespondWhenSpokenTo,
    tokensUsed,
    transcribedText,
    transcribeTimeout,
    transcriptionTime,
    ttsTime,
    wordCountBeforeResponse,
  ]);

  return (
    <StageContext.Provider value={context}>{children}</StageContext.Provider>
  );
};
