import React, { createContext, useMemo, useState } from "react";
import { SettingsContextType, Settings } from "@/types";
import { api } from "@/api";

type SettingsProviderProps = {
  children: React.ReactNode;
};

const blankProfile = {
  saveFileVersion: "1.0.0",
  identity: {
    name: "",
    nameHomonyms: [],
    personality: "",
    attentionWords: [],
    chattiness: 7.6,
    memory: 750,
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

  const setField = (section: string, field: string, value: any) => {
    let profile: any = getCurrentProfile();
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
      addProfile,
      changeIndex,
      deleteCurrentProfile,
      isDirty,
      index,
      loadSettings,
      saveSettings,
      settings,
      setField,
      setIsDirty,
      setLayerField,
      setCoquiAiOptionField,
      setWsOptionField,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isDirty, settings]);

  const { children } = props;
  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};
