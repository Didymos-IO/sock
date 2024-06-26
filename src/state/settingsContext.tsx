import React, { createContext, useMemo, useState } from "react";
import { SettingsContextType, SettingsProfile, Settings } from "@/types";
import { api } from "@/api";

type SettingsProviderProps = {
  children: React.ReactNode;
};

export const blankProfile: SettingsProfile = {
  saveFileVersion: "1.0.0",
  identity: {
    name: "",
    nameHomonyms: [],
    personality: "",
    attentionWords: [],
    chattiness: 7.6,
    memory: 750,
  },
  enforcement: {
    responseFilterList: [
      "openai",
      "gpt-3",
      "language model",
      "llm",
      "chat gpt",
    ],
    reattempts: 3,
    correctiveMessage:
      "Please remember you are not to behave like an AI model or LLM, and instead look at your system message that identifies you and behave from that.",
    giveupDefaultResponse:
      "Sorry, I got distracted and forgot what we were talking about. Could you rephrase that?",
  },
  openAiApi: {
    temperature: 1,
    presencePenalty: 1,
    frequencyPenalty: 1,
    maxTokens: 2048,
  },
  tts: {
    engine: "WebSpeech",
    optionsWebSpeech: {
      voice: 0,
      pitch: 1,
      rate: 1,
    },
    optionsCoquiAi: {
      model: "tts_models/en/vctk/vits",
      voice: "p225",
      rate: 1,
      emotion: "Neutral",
    },
  },
  twitch: {
    channel: "",
    triggers: [],
  },
  avatar: {
    bgColor: "00FF00",
    layers: [
      {
        id: 0,
        name: "",
        path: "",
        talking: "",
        thinking: "",
        blinking: "",
        altPose1: "",
        altPose2: "",
        default: "",
        angryDefault: "",
        angryBlinking: "",
        angryTalking: "",
        talkingClosedAlt: "",
        talkingBlink: "",
        talkingBlinkClosed: "",
        ttsDefault: "",
        ttsBlinking: "",
        ttsTalking: "",
      },
    ],
  },
};

const initialSettings: Settings = {
  profiles: [{ ...blankProfile }],
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = (props: SettingsProviderProps) => {
  const [activeTab, setActiveTab] = useState("identity");
  const [index, setIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const addProfile = () => {
    const newSettings: Settings = { ...settings };
    newSettings.profiles.push({ ...blankProfile });
    setSettings(newSettings);
    setIndex(newSettings.profiles.length - 1);
    setIsDirty(true);
  };

  const changeIndex = (index: number) => {
    setIndex(index);
  };

  const deleteCurrentProfile = () => {
    const newSettings: Settings = { ...settings };
    newSettings.profiles.splice(index, 1);
    setSettings(newSettings);
    setIndex(0);
    setIsDirty(true);
  };

  const getCurrentProfile = () => {
    const newSettings: Settings = { ...settings };
    return newSettings.profiles[index];
  };

  const loadSettings = async () => {
    const response = await api.loadConfig();
    setSettings(response);
    return response;
  };

  const saveSettings = async () => {
    await api.saveConfig(settings);
    setIsDirty(false);
  };

  const setField = (
    section: keyof SettingsProfile,
    field: string,
    value: any
  ) => {
    let profile: any = getCurrentProfile();
    if (!profile[section]) {
      profile[section] = JSON.parse(JSON.stringify(blankProfile[section]));
    }
    profile[section][field] = value;
    updateCurrentProfile(profile);
  };

  const setLayerField = (layer: number, field: string, value: any) => {
    let profile: any = getCurrentProfile();
    let layers = [...profile.avatar.layers];
    layers[layer][field] = value;
    profile.avatar.layers = layers;
    updateCurrentProfile(profile);
  };

  const setTriggerField = (trigger: number, field: string, value: any) => {
    let profile: any = getCurrentProfile();
    let triggers = [...profile.twitch.triggers];
    triggers[trigger][field] = value;
    profile.twitch.triggers = triggers;
    updateCurrentProfile(profile);
  };

  const setCoquiAiOptionField = (field: string, value: any) => {
    let profile: any = getCurrentProfile();
    profile.tts.optionsCoquiAi[field] = value;
    updateCurrentProfile(profile);
  };

  const setWsOptionField = (field: string, value: any) => {
    let profile: any = getCurrentProfile();
    profile.tts.optionsWebSpeech[field] = value;
    updateCurrentProfile(profile);
  };

  const updateCurrentProfile = (newProfile: any) => {
    const newSettings: any = { ...settings };
    newSettings.profiles[index] = newProfile;
    setSettings(newSettings);
    setIsDirty(true);
  };

  const context = useMemo(() => {
    return {
      activeTab,
      addProfile,
      changeIndex,
      deleteCurrentProfile,
      isDirty,
      index,
      loadSettings,
      saveSettings,
      settings,
      setActiveTab,
      setField,
      setIsDirty,
      setLayerField,
      setTriggerField,
      setCoquiAiOptionField,
      setWsOptionField,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, index, isDirty, settings]);

  const { children } = props;
  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};
