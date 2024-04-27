/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect } from "react";
import { ReactMic } from "react-mic";

import {
  ChatMessage,
  ChatResponse,
  Brain,
  Ears,
  Mouth,
  Personality,
} from "@/modules";
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
  const { disconnect, setTriggers, triggerLog, twitchLog, joinChannel } =
    twitchContext;
  const profiles = settings.profiles;
  const triggers = profiles[index].twitch.triggers;
  const { enforcement, identity, openAiApi, tts } = profiles[index];
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
    setTriggers(triggers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggers]);

  useEffect(() => {
    // get the latest trigger log
    if (triggerLog.length > 0) {
      const latest = triggerLog[triggerLog.length - 1];
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
            thinkUpResponse(
              `${message.userName} says, '${message.message}'`,
              context.isChatReadOutloud
            );
            break;
          case "say":
            const sayMessage = {
              content: trigger.text,
              role: "assistant",
            };
            context.setChatHistory([...context.chatHistory, sayMessage]);
            talk(sayMessage);
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
    thinkUpResponse(
      Ears.cleanUpTextHeard(text, identity),
      context.isChatReadOutloud
    ); // nosonar
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
    if (context.isSpeechSynthesisActive) {
      context.setIsThinking(true);
      const time = await Mouth.speak(message.content, tts, () => {
        context.setIsThinking(false);
        context.setIsSpeaking(true);
        const wordsBeforeNext = Personality.wordsBeforeSpeakingNext(
          identity.chattiness
        );
        context.setWordCountBeforeResponse(wordsBeforeNext);
      });
      context.setTtsTime(time);
      context.setIsSpeaking(false);
      context.setIsTTSSpeaking(false);
    } else {
      const wordCount = message.content.split(" ").length;
      const durationInMs = (wordCount / 2.5) * 1000; // average of 2.5 words per second
      context.setIsSpeaking(true);
      setTimeout(() => {
        context.setIsSpeaking(false);
      }, durationInMs);
    }
  };

  const thinkUpResponse = async (
    text: string,
    shouldSpeakTextFirst?: boolean
  ) => {
    context.setTranscribedText("");
    const userMessage = { role: "user", content: text };
    context.setChatHistory([...context.chatHistory, userMessage]);
    let responseFromBrain: ChatResponse;
    if (shouldSpeakTextFirst) {
      const talking = Mouth.speak(
        text,
        {
          engine: "WebSpeech",
          optionsCoquiAi: {
            emotion: "Dull",
            model: "tts_models/en/vctk/vits",
            rate: 1,
            voice: "p233",
          },
          optionsWebSpeech: {
            pitch: 1,
            rate: 1,
            voice: 0,
          },
        },
        () => {},
        () => {
          context.setIsThinking(true);
        }
      );
      const thinking = Brain.thinkUpResponse(
        text,
        context.chatHistory,
        identity,
        enforcement,
        openAiApi,
        true
      );
      const waiting = [await talking, await thinking];
      responseFromBrain =
        typeof waiting[0] !== "string"
          ? (waiting[0] as ChatResponse)
          : (waiting[1] as ChatResponse);
    } else {
      context.setIsThinking(true);
      responseFromBrain = await Brain.thinkUpResponse(
        text,
        context.chatHistory,
        identity,
        enforcement,
        openAiApi,
        true
      );
    }
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
      <div className="mb-2">
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
          </div>
          <Log />
        </div>
      </div>
      <Status />
      <div
        className={`transcription-wrapper ${context.isActive ? "active" : ""}`}
      >
        <TranscriptionOrChatBox onSubmit={handleChatBoxSubmit} />
      </div>
    </div>
  );
};
