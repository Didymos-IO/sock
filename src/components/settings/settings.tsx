import { FormEvent, useContext, useEffect, useState } from "react";

import { SettingsContext } from "@/state";

import {
  AvatarSection,
  IdentitySection,
  OpenAiSection,
  TtsSection,
} from "./children";

type SettingsProps = {};

export const Settings = (props: SettingsProps) => {
  const context = useContext(SettingsContext)!;
  const { isDirty, loadSettings, saveSettings } = context;
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
      <form onSubmit={onFormSubmit}>
        <button
          type="submit"
          className="btn btn-primary mb-3 w-100 bg-gradient"
        >
          {buttonText}
        </button>
        <IdentitySection />
        <hr />
        <OpenAiSection />
        <hr />
        <TtsSection />
        <hr />
        <AvatarSection />
        <button
          type="submit"
          className="btn btn-primary mb-3 w-100 bg-gradient"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
