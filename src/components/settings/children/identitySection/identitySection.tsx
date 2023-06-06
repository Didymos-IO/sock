import { ChangeEvent, useContext } from "react";

import { SettingsContext } from "@/state";

export const IdentitySection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField } = context;
  const { profiles } = settings;
  const { identity } = profiles[index];

  const estimateTokens = (text: string) => {
    const words = text.split(" ").length;
    return Math.ceil(words / 0.75) * 2;
  };

  const getArrayField = (fieldName: string) => {
    const field = (identity as any)[fieldName];
    return field ? field.join(",") : "";
  };

  const handleChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setField("identity", e.target.name, e.target.value);
  };

  const handleChangeFieldAsNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setField("identity", e.target.name, Number(e.target.value));
  };

  const handleChangeArrayField = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(",");
    setField("identity", e.target.name, value);
  };

  return (
    <fieldset>
      <legend>Identity</legend>
      <div className="row">
        <div className="col-3 mb-3">
          <label className="form-label">Name</label>
          <p className="tip">
            Triggers puppet when using &quot;Speak When Spoken To&quot;
          </p>
          <input
            name="name"
            type="text"
            className="form-control"
            placeholder="e.g. Jim"
            value={identity.name}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-9">
          <label className="form-label">Name Homonyms</label>
          <p className="tip">
            Comma separated list of soundalike words that the transcription
            might confuse the name for.
          </p>
          <input
            name="nameHomonyms"
            type="text"
            className="form-control"
            placeholder="eg. gym, gin"
            value={getArrayField("nameHomonyms")}
            onChange={handleChangeArrayField}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">
            Personality
            <span className="ms-2 fs-8">
              (Estimated Token Usage: {estimateTokens(identity.personality)})
            </span>
            <p className="tip">
              A description of the puppet&apos;s personality, starting with
              &quot;You are&quot; that describes who they are and how they think
              or act. More details are helpful, but the longer it is, the more
              tokens it takes up. It takes twice as much as usual, as the OpenAI
              API&apos;s gpt-3 model doesn&apos;t strongly consider the system
              parameter so it also needs to be included in the prompt.
            </p>
          </label>
          <textarea
            name="personality"
            className="form-control"
            rows={3}
            placeholder="e.g. You are Jim, the host of a podcast about cats. You love fuzzy animals and are generally happy and go-lucky."
            onChange={handleChangeField}
            value={identity.personality}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Attention Words</label>
          <p className="tip">
            Comma separated list of single words, that when one is spoken causes
            the puppet to respond immediately instead of waiting for the
            requisite number of words to first be spoken.
          </p>
          <input
            type="text"
            name="attentionWords"
            className="form-control"
            placeholder="e.g. cats, coffee"
            value={getArrayField("attentionWords")}
            onChange={handleChangeArrayField}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">
            Chattiness: {identity.chattiness} (~
            {Math.floor((10.1 - identity.chattiness) * 100)} words heard before
            speaking back)
          </label>
          <p className="tip">
            The higher this is, the less words you speak before puppet speaks.
          </p>
          <input
            type="range"
            className="form-range"
            name="chattiness"
            min="0.1"
            max="10"
            step="0.1"
            value={identity.chattiness}
            onChange={handleChangeFieldAsNumber}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">
            Memory: {identity.memory} words / ~
            {Math.ceil(identity.memory / 0.75)} tokens
          </label>
          <p className="tip">
            The amount of prior conversation the puppet remembers. If too high,
            the puppet has less tokens to speak back with.
          </p>
          <input
            type="range"
            className="form-range"
            name="memory"
            min="100"
            max="2050"
            step="10"
            value={identity.memory}
            onChange={handleChangeFieldAsNumber}
          />
        </div>
      </div>
    </fieldset>
  );
};
