import { Settings, SettingsProfile } from "@/types";

export const loadConfig = async (): Promise<Settings> => {
  const response = await fetch("http://127.0.0.1:8000/load_config", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  return { profiles: data.config.profiles as SettingsProfile[] };
};
