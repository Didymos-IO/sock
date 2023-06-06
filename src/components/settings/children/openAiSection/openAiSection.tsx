import { ChangeEvent, useContext, useState } from "react";

import { AccordionItem } from "@/components";
import { SettingsContext } from "@/state";

export const OpenAiSection = () => {
  const context = useContext(SettingsContext)!;
  const { index, settings, setField } = context;
  const { profiles } = settings;
  const { openAiApi } = profiles[index];
  const [accordion, setAccordion] = useState(0);

  const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setField("openAiApi", e.target.name, Number(e.target.value));
  };

  const onToggleAccordion = (index: number) => {
    setAccordion(accordion === index ? 0 : index);
  };

  return (
    <fieldset>
      <legend>OpenAI API</legend>
      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label">
            Temperature: {openAiApi.temperature}
          </label>
          <p className="tip">
            The higher this is, the more random the puppet&apos;s responses will
            be.
          </p>
          <input
            type="range"
            className="form-range"
            name="temperature"
            min="0"
            max="2"
            step="0.1"
            value={openAiApi.temperature}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">
            Presence Penalty: {openAiApi.presencePenalty}
          </label>
          <p className="tip">
            The puppet will talk about new topics more if higher. (Best at 0 to
            1)
          </p>
          <input
            type="range"
            className="form-range"
            name="presencePenalty"
            min="-2"
            max="2"
            step="0.1"
            value={openAiApi.presencePenalty}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">
            Frequency Penalty: {openAiApi.frequencyPenalty}
          </label>
          <p className="tip">
            The puppet will repeat itself less if higher. (Best at 0 to 1)
          </p>
          <input
            type="range"
            className="form-range"
            name="frequencyPenalty"
            min="-2"
            max="2"
            step="0.1"
            value={openAiApi.frequencyPenalty}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">
            Max Tokens Per Response: {openAiApi.maxTokens}
          </label>
          <p className="tip">
            The maximum amount of tokens the puppet can use for generating its
            response.
          </p>
          <input
            type="range"
            className="form-range"
            name="maxTokens"
            min="1"
            max="3072"
            step="1"
            value={openAiApi.maxTokens}
            onChange={handleChangeField}
          />
        </div>
        <div className="col-12 mb-3">
          <div className="accordion border-warning">
            <AccordionItem
              title="How Do I Set the OpenAI API Key?"
              isOpen={accordion === 1}
              onToggle={() => {
                onToggleAccordion(1);
              }}
            >
              {" "}
              <p className="fs-7">
                Sock uses the{" "}
                <a
                  href="https://platform.openai.com/docs/guides/gpt/chat-completions-api"
                  target="_blank"
                >
                  OpenAI API Chat Completions API
                </a>{" "}
                to generate responses. You must{" "}
                <a href="https://platform.openai.com/signup">sign up</a> to get
                an{" "}
                <a
                  href="https://platform.openai.com/docs/api-reference/authentication"
                  target="_blank"
                >
                  OpenAI API key
                </a>{" "}
                For security reasons, you cannot set the API key here in the
                Settings page. Instead, you must go to the{" "}
                <span className="text-white">/backend/</span> directory of your
                code repo and add a .env file with the following contents:
                <br />
                <br />
                <span className="text-white">
                  OPENAI_API_KEY=YOUR_API_KEY_HERE
                </span>
                <br />
                <br />
                If you have already started the server, you must restart it for
                the key to take effect.
              </p>
            </AccordionItem>
            <AccordionItem
              title="Memory, Responses, and Tokens"
              isOpen={accordion === 2}
              onToggle={() => {
                onToggleAccordion(2);
              }}
            >
              <>
                <p className="fs-7">
                  The OpenAI API models in use by Sock have a token limit of
                  4096 tokens per API call. This limit is a combination of both
                  the tokens used for the prompt request as well as the
                  response. A token is roughly equivalent to 3/4 of a word. The
                  tokens used up by the request include those for assigning the
                  puppet&apos;s personality and those included in the prompt
                  itself. If the Max Tokens Per Response is set higher than the
                  amount of tokens remaining for a request after that, the API
                  will not return a response. To avoid this, Sock will estimate
                  the number of tokens used by the prompt request and lower the
                  max_tokens value of that request to ensure a response. To help
                  you estimate how many tokens fit certain maximum response
                  sizes, consider the following:
                </p>
                <ul className="fs-7">
                  <li>1 Token ~= 3/4 words</li>
                  <li>100 Tokens ~= 75 words</li>
                  <li>1 - 2 sentences ~= 30 tokens</li>
                  <li>1 paragraph ~= 100 tokens</li>
                  <li>1,500 words ~= 2048 tokens</li>
                  <li>
                    The text of the Declaration of Independence is 1695 tokens.
                  </li>
                </ul>
              </>
            </AccordionItem>
          </div>
        </div>
      </div>
    </fieldset>
  );
};
