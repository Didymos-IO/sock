export const convertMsToSeconds = (ms: number): string => {
  const cs = Math.floor(ms / 10);
  let seconds = (cs / 100).toFixed(2);
  if (Number(seconds) < 10) {
    seconds = `0${seconds}`;
  }
  return seconds;
};

export const getWordCount = (text: string): number => {
  const lowerCaseConversation = text.toLowerCase();
  const punctuationRegex = /[.,;:?!]/g;
  const conversationWithoutPunctuation = lowerCaseConversation.replace(
    punctuationRegex,
    " "
  );
  const words = conversationWithoutPunctuation.split(" ");
  return words.length;
};

export const getLocation = (): string => {
  return window.location.hash.replace("#", "");
};

export const setLocation = (hash: string): void => {
  window.location.hash = hash;
};

export const Helpers = {
  convertMsToSeconds,
  getLocation,
  getWordCount,
  setLocation,
};
