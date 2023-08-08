/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect } from "react";
import { ReactMic } from "react-mic";

import { ChatMessage, Brain, Ears, Mouth, Personality } from "@/modules";
import { SettingsContext, StageContext, TwitchContext } from "@/state";

import {
  Avatar,
  ButtonBar,
  Log,
  Status,
  TranscriptionOrChatBox,
} from "./children";

export const Stage = () => {
  const context = useContext(StageContext)!;
  const settingsContext = useContext(SettingsContext)!;
  const twitchContext = useContext(TwitchContext)!;
  const { index, loadSettings, settings } = settingsContext;
  const {
    channel,
    disconnect,
    isTwitchConnected,
    setTriggers,
    triggerLog,
    twitchLog,
    joinChannel,
  } = twitchContext;
  const profiles = settings.profiles;
  const { identity, openAiApi, tts } = profiles[index];
  let recordingTimer: any;

  useEffect(() => {
    loadSettings()
      .then(() => {
        const wordsBeforeNext = Personality.wordsBeforeSpeakingNext(
          identity.chattiness
        );
        context.setWordCountBeforeResponse(wordsBeforeNext);
        testTwitch();
      })
      .catch((error) => {
        console.log(error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /** PITA workaround to the fact that the onStop handler for ReactMic does
     * not update its reference, so can't directly call React functions in it
     * that aren't stale.
     **/
    if (context.newestBlob) {
      handleBlobUpdate(context.newestBlob); // nosonar
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.newestBlob]);

  useEffect(() => {
    setTriggers(settings.profiles[index].twitch.triggers);
  }, [settings.profiles[index].twitch.triggers]);

  useEffect(() => {
    // get the latest trigger log
    if (triggerLog.length > 0) {
      const latest = triggerLog[triggerLog.length - 1];
      const triggers = settings.profiles[index].twitch.triggers;
      // get the matching twitchLog entry based on the id that matches the trigger log's messageId
      const message = twitchLog.find((log) => log.id === latest.messageId);
      const trigger = triggers.find(
        (trigger) => trigger.id === latest.triggerId
      );
      if (message && trigger) {
        switch (trigger.action) {
          case "tts":
            const ttsMessage = {
              content: message.message,
              role: "assistant",
            };
            context.setIsTTSSpeaking(true);
            context.setChatHistory([...context.chatHistory, ttsMessage]);
            talk(ttsMessage);
            break;
          case "response":
            thinkUpResponse(`${message.userName} says, '${message.message}'`);
            break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerLog]);

  const handleActivateClick = () => {
    if (!context.isActive) {
      context.setIsSpeechSynthesisActive(true);
    } else {
      clearTimeout(recordingTimer);
      context.setIsRecording(false);
      context.setHaveRequestedStop(true);
      context.setIsSpeechSynthesisActive(false);
    }
    context.setIsActive(!context.isActive);
  };

  const handleBlobUpdate = async (blob: Blob) => {
    await transcribeRecording(blob).then(async (text) => {
      if (
        Personality.shouldSpeak(
          text,
          identity,
          context.wordCountBeforeResponse,
          context.onlyRespondWhenSpokenTo
        ) &&
        !context.isThinking
      ) {
        await thinkUpResponse(text);
      }
    });
  };

  const handleChatBoxSubmit = (text: string) => {
    thinkUpResponse(Ears.cleanUpTextHeard(text, identity)); // nosonar
  };

  const handleMicData = (recordedBlob: any) => {
    // Not used at the moment.
  };

  /**
   *  This function is called periodically to trigger
   *  blob acquisition and transcription.
   * */
  const handleMicStop = (recordedBlob: any) => {
    context.setNewestBlob(recordedBlob.blob as Blob);
  };

  const handleRecordClick = () => {
    if (!context.haveRequestedStop) {
      clearTimeout(recordingTimer);
      context.setIsRecording(false);
      context.setHaveRequestedStop(true);
      context.setTranscribedText("");
    } else {
      context.setIsRecording(true);
      context.setHaveRequestedStop(false);
      startRecordingTimer();
    }
  };

  const handleToggleSpeechSynthesisClick = () => {
    if (context.isSpeechSynthesisActive) {
      Mouth.shutUp();
    }
    context.setIsSpeechSynthesisActive(!context.isSpeechSynthesisActive);
  };

  const handleToggleTwitchClick = () => {
    const twitchSettings = settings.profiles[index].twitch;
    if (twitchSettings.channel) {
      if (!context.isTwitchActive) {
        console.log(twitchSettings.triggers);
        joinChannel(twitchSettings.channel);
      } else {
        disconnect();
      }
      context.setIsTwitchActive(!context.isTwitchActive);
    } else {
      window.alert(
        "You need to set up a Twitch channel in settings before you can activate Twitch mode."
      );
    }
  };

  const startRecordingTimer = () => {
    recordingTimer = setTimeout(() => {
      context.setIsRecording(false);
    }, context.transcribeTimeout * 1000);
  };

  const talk = async (message: ChatMessage) => {
    const time = await Mouth.speak(message.content, tts, () => {
      context.setIsSpeaking(true);
      const wordsBeforeNext = Personality.wordsBeforeSpeakingNext(
        identity.chattiness
      );
      context.setWordCountBeforeResponse(wordsBeforeNext);
    });
    context.setTtsTime(time);
    context.setIsSpeaking(false);
    context.setIsTTSSpeaking(false);
  };

  const thinkUpResponse = async (text: string) => {
    context.setIsThinking(true);
    context.setTranscribedText("");
    const userMessage = { role: "user", content: text };
    context.setChatHistory([...context.chatHistory, userMessage]);
    const responseFromBrain = await Brain.thinkUpResponse(
      text,
      context.chatHistory,
      identity,
      openAiApi,
      true
    );
    const { message, time, tokensUsed: newTokensUsed } = responseFromBrain;
    context.setAiTime(time);
    context.setTokensUsed(context.tokensUsed + newTokensUsed);
    context.setChatHistory([...context.chatHistory, userMessage, message]);
    context.setIsThinking(false);
    await talk(message);
  };

  const transcribeRecording = async (blob: Blob): Promise<string> => {
    if (!context.haveRequestedStop) {
      context.setIsRecording(true);
    }
    context.setIsTranscribing(true);
    const transcriptionResponse = await Ears.transcribeAudioBlob(blob);
    const { time, transcription } = transcriptionResponse;
    context.setTranscriptionTime(time);
    context.setTranscribedText(
      Ears.cleanUpTextHeard(context.transcribedText + transcription, identity)
    );
    context.setIsTranscribing(false);
    if (!context.haveRequestedStop) {
      startRecordingTimer();
    }
    return Ears.cleanUpTextHeard(
      context.transcribedText + transcription,
      identity
    );
  };

  const testTwitch = () => {
    // joinChannel("timor_jack");
  };

  return (
    <div className="container-xxl py-4 bd-gray-800 avatar-container">
      <div className="mic-wrapper">
        <ReactMic
          record={context.isRecording}
          className="sound-wave"
          onStop={(rb: any) => {
            handleMicStop(rb);
          }}
          onData={handleMicData}
          strokeColor="#0d6efd"
          backgroundColor="#f6f6ef"
        />
      </div>
      <div className="mb-3">
        <div className="puppet-wrapper d-inline-block align-top me-3">
          <Avatar />
        </div>
        <div className="controls-wrapper d-inline-block">
          <div className="mb-3">
            <ButtonBar
              onActivateClick={handleActivateClick}
              onToggleSpeechSynthesisClick={handleToggleSpeechSynthesisClick}
              onToggleTranscriptionClick={handleRecordClick}
              onToggleTwitchClick={handleToggleTwitchClick}
            />
            <Status />
          </div>
          <Log />
        </div>
      </div>
      <div
        className={`transcription-wrapper ${context.isActive ? "active" : ""}`}
      >
        <TranscriptionOrChatBox onSubmit={handleChatBoxSubmit} />
      </div>
    </div>
  );
};
