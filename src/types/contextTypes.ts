import { ChatMessage } from "@/modules";

export type SettingsContextType = {
  activeTab: string;
  addProfile: () => void;
  changeIndex: (index: number) => void;
  deleteCurrentProfile: () => void;
  index: number;
  isDirty: boolean;
  loadSettings: () => Promise<Settings>;
  saveSettings: () => Promise<void>;
  settings: Settings;
  setActiveTab: (tab: string) => void;
  setField: (section: string, field: string, value: any) => void;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerField: (layer: number, field: string, value: any) => void;
  setTriggerField: (index: number, field: string, value: any) => void;
  setCoquiAiOptionField: (field: string, value: any) => void;
  setWsOptionField: (field: string, value: any) => void;
};

export type StageContextType = {
  aiTime: string;
  setAiTime: React.Dispatch<React.SetStateAction<string>>;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  haveRequestedStop: boolean;
  setHaveRequestedStop: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeaking: boolean;
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeechSynthesisActive: boolean;
  setIsSpeechSynthesisActive: React.Dispatch<React.SetStateAction<boolean>>;
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
  isTranscribing: boolean;
  setIsTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
  isTTSSpeaking: boolean;
  setIsTTSSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  isTwitchActive: boolean;
  setIsTwitchActive: React.Dispatch<React.SetStateAction<boolean>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  newestBlob: Blob | undefined;
  setNewestBlob: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  onlyRespondWhenSpokenTo: boolean;
  setOnlyRespondWhenSpokenTo: React.Dispatch<React.SetStateAction<boolean>>;
  tokensUsed: number;
  setTokensUsed: React.Dispatch<React.SetStateAction<number>>;
  transcribedText: string;
  setTranscribedText: React.Dispatch<React.SetStateAction<string>>;
  transcribeTimeout: number;
  setTranscribeTimeout: React.Dispatch<React.SetStateAction<number>>;
  transcriptionTime: string;
  setTranscriptionTime: React.Dispatch<React.SetStateAction<string>>;
  ttsTime: string;
  setTtsTime: React.Dispatch<React.SetStateAction<string>>;
  wordCountBeforeResponse: number;
  setWordCountBeforeResponse: React.Dispatch<React.SetStateAction<number>>;
};

export type TwitchContextType = {
  channel: string;
  isTwitchConnected: boolean;
  triggerLog: TwitchTriggerEvent[];
  triggers: TwitchTrigger[];
  twitchLog: TwitchChatMessage[];
  disconnect: () => void;
  joinChannel: (channel: string) => void;
  setTriggers: React.Dispatch<React.SetStateAction<TwitchTrigger[]>>;
  setTwitchLog: React.Dispatch<React.SetStateAction<TwitchChatMessage[]>>;
};

export type Settings = {
  profiles: SettingsProfile[];
};

export type SettingsProfile = {
  saveFileVersion: string;
  identity: IdentitySettings;
  openAiApi: OpenAiApiSettings;
  tts: TtsSettings;
  twitch: TwitchSettings;
  avatar: AvatarSettings;
};

export type IdentitySettings = {
  name: string;
  nameHomonyms: string[];
  personality: string;
  attentionWords: string[];
  chattiness: number;
  memory: number;
};

export type OpenAiApiSettings = {
  temperature: number;
  presencePenalty: number;
  frequencyPenalty: number;
  maxTokens: number;
};

export type TtsSettings = {
  engine: string;
  optionsWebSpeech: WebSpeechSettings;
  optionsCoquiAi: CoquiAiSettings;
};

export type CoquiAiSettings = {
  model: string;
  voice: string;
  rate: number;
  emotion: string;
};

export type WebSpeechSettings = {
  voice: number;
  pitch: number;
  rate: number;
};

export type AvatarSettings = {
  bgColor: string;
  layers: AvatarLayerSettings[];
};

export type AvatarLayerSettings = {
  id: number | string;
  name: string;
  path: string;
  talking: string;
  thinking: string;
  blinking: string;
  altPose1: string;
  altPose2: string;
  default: string;
  angryDefault: string;
  angryBlinking: string;
  angryTalking: string;
  talkingClosedAlt: string;
  talkingBlink: string;
  talkingBlinkClosed: string;
  ttsDefault: string;
  ttsBlinking: string;
  ttsTalking: string;
};

export type TwitchSettings = {
  channel: string;
  triggers: TwitchTrigger[];
};

export type TwitchTrigger = {
  id: number;
  description: string;
  type: "command" | "reward" | "wordcount" | "attention";
  command: string;
  rewardId: string;
  isBoundToRole: boolean;
  role: "broadcaster" | "mod" | "vip" | "everyone" | "subscriber";
  user: string;
  action: "tts" | "response" | "say";
  text: string;
  isActive: boolean;
  cooldown: number;
};

export type TwitchChatMessage = {
  id: string;
  command: string;
  message: string;
  rewardId: string;
  timestamp: string;
  userName: string;
  userId: string;
  userRoles: TwitchUserRoles;
};

export type TwitchTriggerEvent = {
  id: string;
  messageId: string;
  triggerId: number;
  timestamp: string;
};

export type TwitchUserRoles = {
  broadcaster: boolean;
  mod: boolean;
  subscriber: boolean;
  vip: boolean;
};

export type TriggerCheckResponse = {
  isTriggered: boolean;
  triggerLogItem?: TwitchTriggerEvent;
  messageLogItem?: TwitchChatMessage;
};
