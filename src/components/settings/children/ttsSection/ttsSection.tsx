import { ChangeEvent, useContext, useEffect, useState } from "react";

import { api } from "@/api";
import { Mouth } from "@/modules";
import { SettingsContext } from "@/state";

export const TtsSection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField, setCoquiAiOptionField, setWsOptionField } =
    context;
  const { profiles } = settings;
  const { tts } = profiles[index];
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [testPhrase, setTestPhrase] = useState<string>(
    "Hello, my name is Sock."
  );
  const wsVoices = window.speechSynthesis.getVoices();

  useEffect(() => {
    api
      .getSpeakers("tts_models/en/vctk/vits")
      .then((response) => {
        setSpeakers(response.speakers);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .getSpeakers(tts.optionsCoquiAi.model)
      .then((response) => {
        setSpeakers(response.speakers);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [tts.optionsCoquiAi.model]);

  const handleChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setField("tts", e.target.name, e.target.value);
  };
  const handleCoquiAiChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "range" ? Number(e.target.value) : e.target.value;
    setCoquiAiOptionField(e.target.name, value);
  };

  const handleClickTestVoice = () => {
    Mouth.speak(testPhrase, tts)
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const handleWsChangeField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setWsOptionField(e.target.name, value);
  };

  return (
    <fieldset>
      <legend>TTS</legend>
      <div className="row">
        <div className="col-3 mb-3">
          <label className="form-label">Engine</label>
          <p className="tip">The engine the puppet generates speech with.</p>
          <select
            name="engine"
            className="form-select"
            value={tts.engine}
            onChange={handleChangeField}
          >
            <option value="WebSpeech">WebSpeech</option>
            <option value="Coqui-AI">Coqui-AI</option>
          </select>
        </div>
        <div className="col-9 mb-3">
          <label className="form-label">Test Voice</label>
          <p className="tip">
            Click the button to test the puppet&apos;s voice.
          </p>
          <input
            type="text"
            className="form-control d-inline-block align-top me-3"
            style={{ width: "75%" }}
            value={testPhrase}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTestPhrase(e.target.value)
            }
          />
          <button
            className="btn btn-primary bg-gradient align-top me-3"
            onClick={handleClickTestVoice}
          >
            Test Voice
          </button>
        </div>
        {tts.engine === "WebSpeech" && (
          <>
            <div className="col-4 mb-3">
              <label className="form-label">Voice</label>
              <p className="tip">The voice the puppet uses.</p>
              <select
                className="form-select"
                name="voice"
                value={tts.optionsWebSpeech.voice}
                onChange={handleWsChangeField}
              >
                {wsVoices.map((voice, index) => {
                  return (
                    <option key={voice.voiceURI} value={index}>
                      {voice.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-4 mb-3">
              <label className="form-label">
                Pitch: {tts.optionsWebSpeech.pitch}
              </label>
              <p className="tip">The pitch of the puppet&apos;s voice.</p>
              <input
                type="range"
                className="form-range"
                name="pitch"
                min="0"
                max="2"
                step="0.1"
                value={tts.optionsWebSpeech.pitch}
                onChange={handleWsChangeField}
              />
            </div>
            <div className="col-4 mb-3">
              <label className="form-label">
                Rate: {tts.optionsWebSpeech.rate}
              </label>
              <p className="tip">The speed the puppet talks.</p>
              <input
                type="range"
                className="form-range"
                name="rate"
                min="0.1"
                max="10"
                step="0.1"
                value={tts.optionsWebSpeech.rate}
                onChange={handleWsChangeField}
              />
            </div>
          </>
        )}
        {tts.engine === "Coqui-AI" && (
          <>
            <div className="col-3 mb-3">
              <label className="form-label">Model</label>
              <p className="tip">The model the puppet uses.</p>
              <select className="form-select" disabled>
                <option>tts_models/en/vctk/vits</option>
              </select>
            </div>
            <div className="col-3 mb-3">
              <label className="form-label">Voice</label>
              <p className="tip">The voice the puppet uses.</p>
              <select
                className="form-select"
                name="voice"
                value={tts.optionsCoquiAi.voice}
                onChange={handleCoquiAiChangeField}
              >
                {speakers.map((speaker) => {
                  return (
                    <option key={speaker} value={speaker}>
                      {speaker}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-3 mb-3">
              <label className="form-label">
                Rate: {tts.optionsCoquiAi.rate}
              </label>
              <p className="tip">The speed the puppet talks.</p>
              <input
                type="range"
                className="form-range"
                name="rate"
                min="0.1"
                max="10"
                step="0.1"
                value={tts.optionsCoquiAi.rate}
                onChange={handleCoquiAiChangeField}
              />
            </div>
            <div className="col-3 mb-3">
              <label className="form-label">Emotion</label>
              <p className="tip">
                The emotional inflection for the puppet&apos;s voice.
              </p>
              <select
                className="form-select"
                name="emotion"
                value={tts.optionsCoquiAi.emotion}
                onChange={handleCoquiAiChangeField}
              >
                <option value="Neutral">Neutral</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Dull">Dull</option>
              </select>
            </div>
          </>
        )}

        <div className="col-12">
          <div className="alert alert-warning" role="alert">
            <p className="fs-7 mb-0 text-tip-yellow">
              WebSpeech uses the{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#speech_synthesis"
                target="_blank"
              >
                Web Speech API
              </a>{" "}
              to generate speech. It has a faster response time than Coqui-AI,
              but the quality is not as good.{" "}
              <a href="https://github.com/coqui-ai/TTS" target="_blank">
                Coqui-AI&apos;s TTS
              </a>{" "}
              has much more human-like voices (quality varies per voice) but can
              take a couple of seconds depending on your machine to generate
              speech.
            </p>
          </div>
        </div>
      </div>
    </fieldset>
  );
};
