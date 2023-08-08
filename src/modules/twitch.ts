import ComfyJS from "comfy.js";
import {
  TriggerCheckResponse,
  TwitchChatMessage,
  TwitchTrigger,
  TwitchTriggerEvent,
  TwitchUserRoles,
} from "@/types";

const bind = (onMessage: (message: TwitchChatMessage) => void) => {
  ComfyJS.onChat = (user, message, flags, self, extra) => {
    const newMessage = {
      id: extra.id,
      command: "",
      message,
      rewardId: extra?.customRewardId || "",
      timestamp: extra.timestamp,
      userName: user,
      userId: extra.userId,
      userRoles: {
        broadcaster: flags.broadcaster,
        mod: flags.mod,
        subscriber: flags.subscriber,
        vip: flags.vip,
      },
    };
    console.log(newMessage);
    onMessage(newMessage);
  };
  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    onMessage({
      id: extra.id,
      command,
      message,
      rewardId: "",
      timestamp: extra.timestamp,
      userName: user,
      userId: extra.userId,
      userRoles: {
        broadcaster: flags.broadcaster,
        mod: flags.mod,
        subscriber: flags.subscriber,
        vip: flags.vip,
      },
    });
  };
};

const checkForCommandTrigger = (
  message: TwitchChatMessage,
  trigger: TwitchTrigger,
  triggerLog: TwitchTriggerEvent[]
): TriggerCheckResponse => {
  let hasPassedChecks = false;
  if (
    "!" + message.command === trigger.command &&
    _hasCooldownExpired(trigger, message, triggerLog)
  ) {
    if (
      (trigger.isBoundToRole && hasRole(message.userRoles, trigger.role)) ||
      (!trigger.isBoundToRole && message.userName === trigger.user)
    ) {
      hasPassedChecks = true;
    }
  }
  return hasPassedChecks
    ? {
        isTriggered: true,
        triggerLogItem: _createTriggerLogItem(message, trigger),
        messageLogItem: _createMessageLogNotification(message, trigger),
      }
    : {
        isTriggered: false,
      };
};

const checkForRewardTrigger = (
  message: TwitchChatMessage,
  trigger: TwitchTrigger,
  triggerLog: TwitchTriggerEvent[]
): TriggerCheckResponse => {
  let hasPassedChecks = false;
  if (message.rewardId) {
    if (
      trigger.command === message.rewardId &&
      _hasCooldownExpired(trigger, message, triggerLog)
    ) {
      if (
        (trigger.isBoundToRole && hasRole(message.userRoles, trigger.role)) ||
        (!trigger.isBoundToRole && message.userName === trigger.user)
      ) {
        hasPassedChecks = true;
      }
    }
  }
  return hasPassedChecks
    ? {
        isTriggered: true,
        triggerLogItem: _createTriggerLogItem(message, trigger),
        messageLogItem: _createMessageLogNotification(message, trigger),
      }
    : { isTriggered: false };
};

const hasRole = (
  userRoles: TwitchUserRoles,
  role: "broadcaster" | "mod" | "vip" | "subscriber" | "everyone"
) => {
  if (role === "everyone") {
    return true;
  }
  if (role === "subscriber") {
    return (
      userRoles.subscriber ||
      userRoles.vip ||
      userRoles.mod ||
      userRoles.broadcaster
    );
  }
  if (role === "vip") {
    return userRoles.vip || userRoles.mod || userRoles.broadcaster;
  }
  if (role === "mod") {
    return userRoles.mod || userRoles.broadcaster;
  }
  if (role === "broadcaster") {
    return userRoles.broadcaster;
  }
};

const join = (channel: string) => {
  ComfyJS.Init(channel);
};

const leave = () => {
  ComfyJS.Disconnect();
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ PRIVATE ---------------------------------- */
/* ------------------------------------------------------------------------- */

const _createMessageLogNotification = (
  message: TwitchChatMessage,
  trigger: TwitchTrigger
): TwitchChatMessage => {
  const messageLogItem: TwitchChatMessage = {
    id: message.timestamp + "-" + message.id,
    command: "",
    message: `>>>> A "${trigger.description}" trigger has fired.`,
    rewardId: "",
    timestamp: Date.now().toString(),
    userName: "Twitch",
    userId: "twitch000000",
    userRoles: {
      broadcaster: false,
      mod: false,
      subscriber: false,
      vip: false,
    },
  };
  return messageLogItem;
};

const _createTriggerLogItem = (
  message: TwitchChatMessage,
  trigger: TwitchTrigger
): TwitchTriggerEvent => {
  const triggerLogItem: TwitchTriggerEvent = {
    id: message.timestamp + "-" + message.id,
    messageId: message.id,
    triggerId: trigger.id,
    timestamp: message.timestamp,
  };
  return triggerLogItem;
};

const _hasCooldownExpired = (
  trigger: TwitchTrigger,
  message: TwitchChatMessage,
  triggerLog: TwitchTriggerEvent[]
): boolean => {
  const cooldown = trigger.cooldown * 1000;
  // if the most recent item in the trigger log of the same trigger id has happened within the cooldown period, return false
  const mostRecentTriggerLogItem = triggerLog.find(
    (item) => item.triggerId === trigger.id
  );
  if (mostRecentTriggerLogItem) {
    const mostRecentTriggerLogItemTimestamp = new Date(
      mostRecentTriggerLogItem.timestamp
    ).getTime();
    const now = new Date(message.timestamp).getTime();
    if (now - mostRecentTriggerLogItemTimestamp < cooldown) {
      return false;
    }
  }
  return true;
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ EXPORT ----------------------------------- */
/* ------------------------------------------------------------------------- */

export const Twitch = {
  bind,
  checkForCommandTrigger,
  checkForRewardTrigger,
  hasRole,
  join,
  leave,
};
