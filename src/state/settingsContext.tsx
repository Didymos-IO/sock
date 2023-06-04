import React, { createContext, useMemo, useState } from "react";
import { SettingsContextType, Settings } from "@/types";
import { api } from "@/api";

type SettingsProviderProps = {
  children: React.ReactNode;
};

const initialSettings: Settings = {
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

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = (props: SettingsProviderProps) => {
  const [isDirty, setIsDirty] = useState(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

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
    const newSettings: any = { ...settings };
    newSettings[section][field] = value;
    setSettings(newSettings);
    setIsDirty(true);
  };

  const setLayerField = (layer: number, field: string, value: any) => {
    const newSettings: any = { ...settings };
    let layers = [...newSettings.avatar.layers];
    layers[layer][field] = value;
    newSettings.avatar.layers = layers;
    setSettings(newSettings);
    setIsDirty(true);
  };

  const setCoquiAiOptionField = (field: string, value: any) => {
    const newSettings: any = { ...settings };
    newSettings.tts.optionsCoquiAi[field] = value;
    setSettings(newSettings);
    setIsDirty(true);
  };

  const setWsOptionField = (field: string, value: any) => {
    const newSettings: any = { ...settings };
    newSettings.tts.optionsWebSpeech[field] = value;
    setSettings(newSettings);
    setIsDirty(true);
  };

  const context = useMemo(() => {
    return {
      isDirty,
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
  }, [isDirty, settings]);

  const { children } = props;
  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};
