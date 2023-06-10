import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";

import { Icons } from "@/components";
import { SettingsContext } from "@/state";

import {
  AvatarSection,
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
  const {
    activeTab,
    addProfile,
    changeIndex,
    deleteCurrentProfile,
    index,
    isDirty,
    loadSettings,
    settings,
    saveSettings,
  } = context;
  const { profiles } = settings;
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

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      deleteCurrentProfile();
    }
  };

  const handleIndexChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    changeIndex(value);
  };

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
      <form onSubmit={onFormSubmit}>
        <SettingsNav />
        <hr />
        {activeTab === "identity" && <IdentitySection />}
        {activeTab === "gpt" && <OpenAiSection />}
        {activeTab === "voice" && <TtsSection />}
        {activeTab === "twitch" && <TwitchSection />}
        {activeTab === "avatar" && <AvatarSection />}
        <hr />
        <button
          type="submit"
          className="btn btn-primary mb-3 float-end px-4 bg-gradient"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
