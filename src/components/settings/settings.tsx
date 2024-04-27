import { FormEvent, useContext, useEffect, useState } from "react";

import { SettingsContext } from "@/state";

import {
  AvatarSection,
  EnforcementSection,
  IdentitySection,
  OpenAiSection,
  SettingsNav,
  TtsSection,
  TwitchSection,
} from "./children";

type SettingsProps = {
  onChangeTab: (tab: string) => void;
};

export const Settings = (props: SettingsProps) => {
  const { onChangeTab } = props;
  const context = useContext(SettingsContext)!;
  const { activeTab, isDirty, loadSettings, saveSettings } = context;
  const [buttonText, setButtonText] = useState("Save");

  useEffect(() => {
    loadSettings()
      .then()
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChangeTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (isDirty) {
      window.onbeforeunload = function () {
        return true;
      };
    } else {
      onbeforeunload = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveSettings()
      .then()
      .catch((error) => {
        console.log(error);
      });
    setButtonText("Saved!");
    window.setTimeout(() => {
      setButtonText("Save");
    }, 1000);
  };

  return (
    <div className="container-xxl py-4 bd-gray-800 settings-container">
      <form onSubmit={onFormSubmit} className="clearfix">
        <SettingsNav />
        <hr />
        {activeTab === "identity" && <IdentitySection />}
        {activeTab === "enforcement" && <EnforcementSection />}
        {activeTab === "gpt" && <OpenAiSection />}
        {activeTab === "voice" && <TtsSection />}
        {activeTab === "twitch" && <TwitchSection />}
        {activeTab === "avatar" && <AvatarSection />}
        <hr />
        <button
          type="submit"
          className="btn btn-primary float-end px-4 bg-gradient"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
