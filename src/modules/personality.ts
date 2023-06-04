import { IdentitySettings } from "@/types";

/**
 * Determine whether or not the bot should speak based on the conversation and the provided options.
 */
const shouldSpeak = (
  conversation: string,
  identity: IdentitySettings,
  wordsBeforeResponse?: number,
  onlyRespondWhenSpokenTo?: boolean
) => {
  const lowerCaseConversation = conversation.toLowerCase();
  if (wasAttentionAcquired(lowerCaseConversation, identity)) {
    return true;
  }
  if (onlyRespondWhenSpokenTo) {
    return false;
  }

  const punctuationRegex = /[.,;:?!]/g;
  const conversationWithoutPunctuation = lowerCaseConversation.replace(
    punctuationRegex,
    " "
  );
  const wordCount = conversationWithoutPunctuation.split(" ").length;
  if (wordsBeforeResponse && wordsBeforeResponse <= wordCount) {
    return true;
  }
};

/**
 * Determines if the bot's attention was required by the conversation based on how many words have been spoken.
 */
const wasAttentionAcquired = (
  conversation: string,
  identity: IdentitySettings
) => {
  const lowerCaseConversation = conversation.toLowerCase();
  const punctuationRegex = /[.,;:?!]/g;
  const conversationWithoutPunctuation = lowerCaseConversation.replace(
    punctuationRegex,
    " "
  );
  const words = conversationWithoutPunctuation.split(" ");
  const attention = identity.attentionWords.map((word) =>
    word.toLowerCase().trim()
  );
  for (const word of words) {
    if (attention.includes(word)) {
      return true;
    }
  }

  return false;
};

/**
 * Determines how many words the bot should listen to before speaking next, with a random offset. The `chattiness` rating can be between 0 and 2.
 */
const wordsBeforeSpeakingNext = (chattiness: number) => {
  const wordsToListen = (10.1 - chattiness) * 100;
  const baseOffset = Math.round(wordsToListen * 0.2);
  const randomOffset = Math.floor(Math.random() * baseOffset);
  return Math.round(wordsToListen + randomOffset);
};

export const Personality = {
  shouldSpeak,
  wasAttentionAcquired,
  wordsBeforeSpeakingNext,
};
