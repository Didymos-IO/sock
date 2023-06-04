import { api } from "@/api";
import { IdentitySettings } from "@/types";

import { convertMsToSeconds } from ".";

export type TranscriptionResponse = {
  transcription: string;
  time: string;
};

const cleanUpTextHeard = (text: string, identity: IdentitySettings): string => {
  let cleaned = text
    .split(". .")
    .join(".")
    .split("! .")
    .join("!")
    .split("? .")
    .join("."); // Frequently gives '. . . .' from multiple quiet transcriptions.
  cleaned = cleaned.split("...").join(""); // Inserts '...' when transcription happens mid-sentence.
  cleaned = cleaned.split("Thank you. Thank you.").join(""); // Commonly mishears mechanical keyboard typing as "Thank you"
  cleaned = cleaned
    .split("you you")
    .join("")
    .split("You you")
    .join("")
    .split("You You")
    .join(""); // Also sometimes hears "you you" repeatedly (uncertain what background sounds causes this)
  cleaned = cleaned.split("Thanks for watching! Thanks for watching!").join("");
  cleaned = cleaned.split("Thanks for watching! Thank you.").join("");
  cleaned = cleaned.split("  you .").join("");
  cleaned = cleaned.split("  ").join(" ");
  cleaned = fixNameHomonyms(cleaned, identity);
  cleaned = _removeLeadingSpacesAndPunctuationAndTrailingSpaces(cleaned);
  return cleaned;
};

const fixNameHomonyms = (text: string, identity: IdentitySettings): string => {
  let fixed = text;
  for (const homonym of identity.nameHomonyms) {
    let trimmed = homonym.trim();
    fixed = fixed.split(trimmed).join(identity.name);
    fixed = fixed
      .split(trimmed.charAt(0).toUpperCase() + trimmed.slice(1))
      .join(identity.name);
  }
  return fixed;
};

/**
 * Given an audio blob, connect to the transcription API and return the transcription.
 */
const transcribeAudioBlob = async (
  blob: Blob
): Promise<TranscriptionResponse> => {
  const start = Date.now();
  const transcription = await api.transcribe(blob);
  const end = Date.now();
  const time = convertMsToSeconds(end - start);
  return {
    transcription,
    time,
  };
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ PRIVATE ---------------------------------- */
/* ------------------------------------------------------------------------- */

const _removeLeadingSpacesAndPunctuationAndTrailingSpaces = (
  text: string
): string => {
  let cleanedText = text.replace(/^[^\w]+/, "");
  cleanedText = cleanedText.trim();
  return cleanedText;
};

/* ------------------------------------------------------------------------- */
/* ------------------------------ EXPORT ----------------------------------- */
/* ------------------------------------------------------------------------- */

export const Ears = {
  cleanUpTextHeard,
  fixNameHomonyms,
  transcribeAudioBlob,
};
