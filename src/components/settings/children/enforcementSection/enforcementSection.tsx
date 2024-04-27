import { ChangeEvent, useContext } from "react";

import { blankProfile, SettingsContext } from "@/state";

export const EnforcementSection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField } = context;
  const { profiles } = settings;
  const enforcement =
    profiles[index].enforcement ??
    JSON.parse(JSON.stringify(blankProfile.enforcement));

  const getArrayField = (fieldName: string) => {
    const field = (enforcement as any)[fieldName];
    return field ? field.join(",") : "";
  };

  const handleChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setField("enforcement", e.target.name, e.target.value);
  };

  const handleChangeFieldAsNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setField("enforcement", e.target.name, Number(e.target.value));
  };

  const handleChangeArrayField = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(",");
    setField("enforcement", e.target.name, value);
  };

  return (
    <fieldset>
      <legend>Enforcement</legend>
      <div className="row">
        <div className="col-8 mb-3">
          <label className="form-label">Response Filter List</label>
          <p className="tip">
            Comma separated list of words or phrases that, if returned from the
            LLM, will trigger an attempt to re-prompt the LLM for a different
            response.
          </p>
          <input
            name="responseFilterList"
            type="text"
            className="form-control"
            placeholder="e.g. OpenAI, LLM, language model"
            value={getArrayField("responseFilterList")}
            onChange={handleChangeArrayField}
          />
        </div>
        <div className="col-4 mb-3">
          <label className="form-label">Reattempts</label>
          <p className="tip">
            Number of reattempts to get unfiltered response before giving up.
          </p>
          <input
            name="reattempts"
            type="number"
            className="form-control"
            placeholder="e.g. 1"
            value={enforcement.reattempts}
            onChange={handleChangeFieldAsNumber}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Corrective Message for LLM</label>
          <p className="tip">
            An optional corrective statement to give the LLM to get it to think
            clearly before a reattempt
          </p>
          <input
            name="correctiveMessage"
            type="text"
            className="form-control"
            placeholder="e.g. You are not to behave like an AI model or LLM, and instead look at your system message that identifies you and behave from that."
            value={enforcement.correctiveMessage}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Give-Up Default Response</label>
          <p className="tip">
            A response to come from the puppet if the reattempts are exhausted.
          </p>
          <input
            name="giveupDefaultResponse"
            type="text"
            className="form-control"
            placeholder="e.g. Sorry, I got distracted and forgot what we were talking about. Could you rephrase that?"
            value={enforcement.giveupDefaultResponse}
            onChange={handleChangeField}
          />
        </div>
      </div>
    </fieldset>
  );
};
