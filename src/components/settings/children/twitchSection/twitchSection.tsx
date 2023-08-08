import { ChangeEvent, useContext, useState } from "react";

import { Icons } from "@/components";
import { SettingsContext } from "@/state";
import { TwitchTrigger } from "@/types";

import { ActionInfo, TwitchTestLog } from "./children";

const blankTrigger: TwitchTrigger = {
  id: 0,
  description: "",
  type: "command",
  command: "",
  rewardId: "",
  isBoundToRole: true,
  role: "everyone",
  action: "tts",
  text: "",
  user: "",
  isActive: false,
  cooldown: 0,
};

export const TwitchSection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField, setTriggerField } = context;
  const { profiles } = settings;
  const twitch = profiles[index].twitch;
  const { triggers } = twitch;

  const getTriggerLabel = (trigger: TwitchTrigger) => {
    switch (trigger.type) {
      case "command":
        return "Command";
      case "reward":
        return "Reward ID";
      case "wordcount":
        return "Word Count";
      case "attention":
        return "Attention Word/Phrase";
    }
  };

  const getTriggerPlaceholder = (trigger: TwitchTrigger) => {
    switch (trigger.type) {
      case "command":
        return "e.g. !tts";
      case "reward":
        return "e.g. 12345678-1234-1234-1234-123456789012";
      case "wordcount":
        return "e.g. 5";
      case "attention":
        return "e.g. monkeys";
    }
  };

  const getTriggerTip = (trigger: TwitchTrigger) => {
    switch (trigger.type) {
      case "command":
        return "The command to trigger this.";
      case "reward":
        return "The ID of the channel point reward to trigger this.";
      case "wordcount":
        return "The number of words required to trigger this.";
      case "attention":
        return "The word or phrase to trigger this.";
    }
  };

  const handleAddTriggerClick = () => {
    let newTrigger = { ...blankTrigger };
    newTrigger.id = new Date().getTime();
    setField("twitch", "triggers", [...triggers, newTrigger]);
  };

  const handleChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setField("twitch", e.target.name, e.target.value);
  };

  const handleDeleteTrigger = (id: number | string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this trigger? This action cannot be undone.`
      )
    ) {
      const newTriggers = triggers.filter((l) => l.id !== id);
      setField("twitch", "triggers", newTriggers);
    }
  };

  const handleMoveTrigger = (triggerId: number, direction: "up" | "down") => {
    const newTriggers = [...triggers];
    const index = newTriggers.findIndex((item) => item.id === triggerId);
    if (index === -1) {
      return newTriggers; // No changes needed
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newTriggers.length) {
      return newTriggers; // No changes needed
    }
    const updatedArray = [...newTriggers];
    const itemToMove = updatedArray[index];
    updatedArray[index] = updatedArray[newIndex];
    updatedArray[newIndex] = itemToMove;
    setField("twitch", "triggers", updatedArray);
  };

  return (
    <fieldset>
      <legend>Twitch</legend>
      <div className="row">
        <div className="col-3 mb-3">
          <label className="form-label">Channel Name</label>
          <p className="tip">The channel name (id) of the stream to join.</p>
          <input
            type="text"
            className="form-control"
            name="channel"
            placeholder="e.g. ironmouse"
            onChange={handleChangeField}
            value={twitch.channel}
          />
        </div>
        <div className="col-9 mb-3">
          <TwitchTestLog />
        </div>
        <div className="col-12 mb-3">
          <button
            type="button"
            className="btn btn-primary bg-gradient"
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
                <div className="col-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-primary bg-gradient me-2"
                    onClick={() => handleMoveTrigger(trigger.id, "up")}
                    disabled={triggerIndex === 0 || triggers.length === 1}
                  >
                    <Icons.ArrowBarUp />
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary bg-gradient me-2"
                    onClick={() => handleMoveTrigger(trigger.id, "down")}
                    disabled={
                      triggerIndex === triggers.length - 1 ||
                      triggers.length === 1
                    }
                  >
                    <Icons.ArrowBarDown />
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <label className="form-label">ID</label>
                  <p className="tip">The ID of this trigger.</p>
                  <div className="pt-2">{trigger.id}</div>
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Description</label>
                  <p className="tip">A description / label for this trigger.</p>
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
                <div className="col-2 mb-3">
                  <label className="form-label">Is Active?</label>
                  <p className="tip">Whether or not this trigger is active.</p>
                  <div className="pt-2">
                    <span>Inactive</span>
                    <div className="form-check form-switch d-inline-block mx-2 align-middle">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`twitch-trigger-${trigger.id}-is-active`}
                        checked={trigger.isActive}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setTriggerField(
                            triggerIndex,
                            "isActive",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                    <span>Active</span>
                  </div>
                </div>
                <div className="col-2 mb-3">
                  <label className="form-label">Cooldown</label>
                  <p className="tip">Cooldown before allowed again.</p>
                  <input
                    type="number"
                    className="form-control d-inline-block w-50 me-3 text-end"
                    placeholder="e.g. 30"
                    value={trigger.cooldown}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setTriggerField(
                        triggerIndex,
                        "cooldown",
                        parseInt(e.target.value)
                      );
                    }}
                  />
                  Secs
                </div>
                <div className="col-1 mb-3 text-end">
                  <button
                    type="button"
                    className="btn btn-danger bg-delete bg-gradient"
                    onClick={() => {
                      handleDeleteTrigger(trigger.id);
                    }}
                  >
                    <Icons.Trash />
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <label className="form-label">Type</label>
                  <p className="tip">The type of trigger.</p>
                  <select
                    className="form-select"
                    value={trigger.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setTriggerField(triggerIndex, "type", e.target.value);
                    }}
                  >
                    <option value="command">Command</option>
                    <option value="reward">Reward</option>
                    <option value="wordcount" disabled>
                      Word Count
                    </option>
                    <option value="attention" disabled>
                      Attention
                    </option>
                  </select>
                </div>
                <div className="col-2 mb-3">
                  <label className="form-label">Who Can Use This?</label>
                  <p className="tip">Is it a specific user or a role?</p>
                  <div className="pt-2">
                    <span>User</span>
                    <div className="form-check form-switch d-inline-block mx-2 align-middle">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`twitch-trigger-${trigger.id}-is-bound-to-role`}
                        checked={trigger.isBoundToRole}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setTriggerField(
                            triggerIndex,
                            "isBoundToRole",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                    <span>Role</span>
                  </div>
                </div>
                {!trigger.isBoundToRole && (
                  <div className="col-2 mb-3">
                    <label className="form-label">User</label>
                    <p className="tip">The user who can use this trigger.</p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. username"
                      value={trigger.user}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTriggerField(triggerIndex, "user", e.target.value);
                      }}
                    />
                  </div>
                )}
                {trigger.isBoundToRole && (
                  <div className="col-2 mb-3">
                    <label className="form-label">Role</label>
                    <p className="tip">Minimum role to use this trigger.</p>
                    <select
                      className="form-select"
                      value={trigger.role}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setTriggerField(triggerIndex, "role", e.target.value);
                      }}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="subscriber">Subscriber</option>
                      <option value="vip">VIP</option>
                      <option value="moderator">Moderator</option>
                      <option value="broadcaster">Broadcaster</option>
                    </select>
                  </div>
                )}
                <div className="col-3 mb-3">
                  <label className="form-label">
                    {getTriggerLabel(trigger)}
                  </label>
                  <p className="tip">{getTriggerTip(trigger)}</p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={getTriggerPlaceholder(trigger)}
                    value={trigger.command}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setTriggerField(triggerIndex, "command", e.target.value);
                    }}
                  />
                </div>
                <div className="col-3 mb-3">
                  <label className="form-label">Action</label>
                  <p className="tip">The action to take when triggered.</p>
                  <select
                    className="form-select"
                    value={trigger.action}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setTriggerField(triggerIndex, "action", e.target.value);
                    }}
                  >
                    <option value="tts">Text to Speech</option>
                    <option value="response">Get ChatGPT Response</option>
                    <option value="say">Speak Phrase</option>
                  </select>
                </div>
                <ActionInfo action={trigger.action} type={trigger.type} />
                {trigger.action === "say" && (
                  <div className="col-12 mb-3">
                    <label className="form-label">Speak Phrase</label>
                    <p className="tip">
                      The phrase the puppet will speak out loud when triggered.
                    </p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hello World!"
                      value={trigger.text}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTriggerField(triggerIndex, "text", e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};
