import { useContext, useEffect, useRef } from "react";

import { SettingsContext, StageContext } from "@/state";

export const Log = () => {
  const { chatHistory } = useContext(StageContext)!;
  const { index, settings } = useContext(SettingsContext)!;
  const { profiles } = settings;
  const { name } = profiles[index].identity;
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef?.current) {
      (chatRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory]);

  return (
    <div className="log rounded bd-gray-700 p-3 custom-shadow-inset-sm">
      <div className="log-content">
        <ul className="list-unstyled fs-7">
          {chatHistory.map((message, index) => {
            const key = message.role + index;
            return (
              <li
                key={key}
                className={`log-message row mb-2 ${
                  message.role === "user" ? "text-white" : "text-warning"
                }`}
              >
                <span className="log-message-role col-2 d-inline-block text-end px-0">
                  {message.role === "user" ? "You:" : `${name}: `}
                </span>
                <span className="log-message-content col-10">
                  {message.content}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="log-anchor" ref={chatRef}></div>
      </div>
    </div>
  );
};
