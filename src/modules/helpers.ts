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

export const getLocation = (): [string, string] => {
  return [window.location.search.replace("?loc=", ""), window.location.hash];
};

export const setLocation = (query: string, hash: string): void => {
  let newQuery = `?loc=${query}`;
  if (hash) {
    newQuery += `#${hash}`;
  }
  window.history.pushState({}, "", newQuery);
};

export const Helpers = {
  convertMsToSeconds,
  getLocation,
  getWordCount,
  setLocation,
};
