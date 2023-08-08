import React, { createContext, useMemo, useState } from "react";
// import { StageContextType } from "@/types";
import { Twitch } from "@/modules";
import {
  TriggerCheckResponse,
  TwitchContextType,
  TwitchChatMessage,
  TwitchTriggerEvent,
  TwitchTrigger,
} from "@/types";

type TwitchProviderProps = {
  children: React.ReactNode;
};

export const TwitchContext = createContext<TwitchContextType | undefined>(
  undefined
);

export const TwitchProvider = (props: TwitchProviderProps) => {
  const { children } = props;

  const [channel, setChannel] = useState("");
  const [isTwitchBound, setIsTwitchBound] = useState(false);
  const [isTwitchConnected, setIsTwitchConnected] = useState(false);
  const [triggers, setTriggers] = useState<TwitchTrigger[]>([]);
  const [triggerLog, setTriggerLog] = useState<TwitchTriggerEvent[]>([]);
  const [twitchLog, setTwitchLog] = useState<TwitchChatMessage[]>([]);

  const bindTwitch = () => {
    if (!isTwitchBound) {
      Twitch.bind((message: TwitchChatMessage) => {
        // If existing twitchLog doesn't contain message, add message to log
        if (!twitchLog.find((m) => m.id === message.id)) {
          setTwitchLog((prev) => [...prev, message]);
          const triggerResponse = checkForTrigger(message);
          if (triggerResponse.isTriggered) {
            console.log("Was triggered.");
            setTriggerLog((prev) => [...prev, triggerResponse.triggerLogItem!]);
            setTwitchLog((prev) => [...prev, triggerResponse.messageLogItem!]);
          }
        }
      });
      setIsTwitchBound(true);
    }
  };

  const checkForTrigger = (message: TwitchChatMessage) => {
    let wasTriggered = false;
    let response: TriggerCheckResponse = {
      isTriggered: false,
    };
    console.log("triggers", triggers);
    triggers.forEach((trigger) => {
      if (wasTriggered) return;
      if (!trigger.isActive || message.userName === "Twitch") return;
      switch (trigger.type) {
        case "reward":
          const rewardResponse = Twitch.checkForRewardTrigger(
            message,
            trigger,
            triggerLog
          );
          if (rewardResponse.isTriggered) {
            response = rewardResponse;
          }
          wasTriggered = response.isTriggered;
          break;
        case "command":
          console.log("got here", message, trigger);
          const commandResponse = Twitch.checkForCommandTrigger(
            message,
            trigger,
            triggerLog
          );
          if (commandResponse.isTriggered) {
            response = commandResponse;
          }
          wasTriggered = response.isTriggered;
          console.log("was triggered?", wasTriggered);
          break;
      }
    });
    return response;
  };

  const disconnect = () => {
    Twitch.leave();
    setChannel("");
    setIsTwitchConnected(false);
    console.log("Disconnected.");
    const timestamp = Date.now();
    const disconnectLogEntry: TwitchChatMessage = {
      id: "disconnected-" + timestamp,
      command: "",
      message: "Disconnected from Twitch channel.",
      rewardId: "",
      timestamp: timestamp.toString(),
      userName: "Twitch",
      userId: "twitch000000",
      userRoles: {
        broadcaster: false,
        mod: false,
        subscriber: false,
        vip: false,
      },
    };
    setTwitchLog((prev) => [...prev, disconnectLogEntry]);
  };

  const joinChannel = (channel: string) => {
    bindTwitch();
    Twitch.join(channel);
    setChannel(channel);
    setIsTwitchConnected(true);
    const timestamp = Date.now();
    const connectionLogEntry: TwitchChatMessage = {
      id: "connection-" + timestamp,
      command: "",
      message: "Connected to channel " + channel,
      rewardId: "",
      timestamp: timestamp.toString(),
      userName: "Twitch",
      userId: "twitch000000",
      userRoles: {
        broadcaster: false,
        mod: false,
        subscriber: false,
        vip: false,
      },
    };
    setTwitchLog((prev) => [...prev, connectionLogEntry]);
  };

  const context = useMemo(() => {
    return {
      channel,
      isTwitchConnected,
      triggerLog,
      triggers,
      twitchLog,
      disconnect,
      joinChannel,
      setTriggers,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, isTwitchConnected, triggerLog, triggers, twitchLog]);

  return (
    <TwitchContext.Provider value={context}>{children}</TwitchContext.Provider>
  );
};
