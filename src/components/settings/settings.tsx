import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";

import { Icons } from "@/components";
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
  const {
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
        <div className="row mb-3">
          <div className="col-3">
            <div className="d-inline-block pt-2 me-3">Profile:</div>
            <select
              className="form-select d-inline-block w-75"
              value={index}
              onChange={handleIndexChange}
            >
              {profiles.map((profile, profileIndex) => {
                const key = profileIndex;
                return (
                  <option
                    key={`option-${key}`}
                    value={profileIndex}
                  >{`[${profileIndex}] ${
                    profile.identity.name !== ""
                      ? profile.identity.name
                      : "Unnamed"
                  }`}</option>
                );
              })}
            </select>
          </div>
          <div className="col-9 text-end">
            <button
              type="button"
              className="btn btn-primary bg-gradient me-2"
              onClick={addProfile}
            >
              <span
                style={{
                  marginTop: "-7px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <Icons.PlusCircle />
              </span>{" "}
              Add New Profile
            </button>
            <button
              type="button"
              className="btn btn-danger bg-delete bg-gradient"
              disabled={profiles.length === 1}
              onClick={handleDeleteProfile}
            >
              {" "}
              <span
                style={{
                  marginTop: "-7px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <Icons.Trash />
              </span>{" "}
              Delete Profile
            </button>
          </div>
        </div>
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
