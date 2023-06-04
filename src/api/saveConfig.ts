import type { Settings } from "@/types";

export const saveConfig = async (config: Settings): Promise<any> => {
  const configAsString = JSON.stringify(config);
  const response = await fetch("http://127.0.0.1:8000/save_config", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      config: configAsString,
    }),
  });
  const data = await response.json();
  return data;
};
