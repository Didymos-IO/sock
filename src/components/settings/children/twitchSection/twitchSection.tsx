import { ChangeEvent, useContext, useState } from "react";

import { Icons } from "@/components";
import { SettingsContext } from "@/state";
import { TwitchTrigger } from "@/types";

const blankTrigger: TwitchTrigger = {
  id: 0,
  description: "",
  type: "command",
  command: "",
  rewardId: "",
  role: "everyone",
  action: "tts",
  text: "",
  isActive: false,
};

export const TwitchSection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField, setTriggerField } = context;
  const { profiles } = settings;
  const twitch = profiles[index].twitch;
  const { triggers } = twitch;

  const handleAddTriggerClick = () => {
    let newTrigger = { ...blankTrigger };
    newTrigger.id = new Date().getTime();
    setField("twitch", "triggers", [...triggers, newTrigger]);
  };

  return (
    <fieldset>
      <legend>Twitch</legend>
      <div className="row">
        <div className="col-3 mb-3">
          <label className="form-label">Channel Name</label>
          <p className="tip">The channel name/id of the stream to join.</p>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. ironmouse"
          />
        </div>
        <div className="col-9 mb-3"></div>
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddTriggerClick}
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
            Add New Trigger
          </button>
        </div>
        {triggers.map((trigger, triggerIndex) => {
          return (
            <div className="col-12 mb-3" key={trigger.id}>
              <div className="row border rounded pt-2 mx-0 layer-row border-warning-subtle position-relative">
                <div className="col-6 mb-3">
                  <label className="form-label">Description</label>
                  <p className="tip">
                    A description of what this trigger does.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mod triggers TTS"
                    value={trigger.description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setTriggerField(
                        triggerIndex,
                        "description",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-6 mb-3 text-end">
                  <button
                    type="button"
                    className="btn btn-danger bg-delete bg-gradient"
                    onClick={() => {}}
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};
