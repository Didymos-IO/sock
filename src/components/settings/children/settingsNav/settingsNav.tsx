import { ChangeEvent, useContext, useState } from "react";

import { Icons } from "@/components";
import { SettingsContext } from "@/state";

export const SettingsNav = () => {
  const context = useContext(SettingsContext)!;
  const {
    activeTab,
    addProfile,
    changeIndex,
    deleteCurrentProfile,
    index,
    settings,
    saveSettings,
    setActiveTab,
  } = context;
  const { profiles } = settings;
  const [buttonText, setButtonText] = useState("Save");

  const handleTabClick = (e: any) => {
    e.preventDefault();
    const tab = e.target.getAttribute("href")?.replace("#", "");
    setActiveTab(tab);
  };

  const handleClickSave = () => {
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

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      deleteCurrentProfile();
    }
  };

  const handleIndexChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    changeIndex(value);
  };

  return (
    <div className="row">
      <div className="col-4">
        <ul className="nav settings-nav">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "identity" ? "active" : ""}`}
              href="#identity"
              onClick={handleTabClick}
            >
              Identity
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "avatar" ? "active" : ""}`}
              href="#avatar"
              onClick={handleTabClick}
            >
              Avatar
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "voice" ? "active" : ""}`}
              href="#voice"
              onClick={handleTabClick}
            >
              Voice
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "gpt" ? "active" : ""}`}
              href="#gpt"
              onClick={handleTabClick}
            >
              GPT
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "twitch" ? "active" : ""}`}
              href="#twitch"
              onClick={handleTabClick}
            >
              Twitch
            </a>
          </li>
        </ul>
      </div>
      <div className="col-8 text-end">
        <span className="me-3 d-inline-block align-middle">Profile:</span>
        <select
          className="form-select profile-select d-inline-block w-auto align-top me-2"
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
                profile.identity.name !== "" ? profile.identity.name : "Unnamed"
              }`}</option>
            );
          })}
        </select>
        <button
          className="btn btn-primary bg-gradient px-4 me-3"
          onClick={handleClickSave}
        >
          {buttonText}
        </button>
        <div className="d-inline-block align-middle bar-barrier me-3"></div>

        <button
          type="button"
          className="btn btn-primary bg-gradient me-2"
          onClick={addProfile}
          title="Add a new profile"
        >
          <span
            style={{
              marginTop: "-7px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <Icons.PlusCircle />
          </span>
        </button>
        <button
          type="button"
          className="btn btn-danger bg-delete bg-gradient"
          disabled={profiles.length === 1}
          onClick={handleDeleteProfile}
          title="Delete current profile"
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
          </span>
        </button>
      </div>
    </div>
  );
};
