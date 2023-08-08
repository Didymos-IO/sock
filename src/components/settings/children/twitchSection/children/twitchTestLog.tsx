import { useContext, useEffect, useRef } from "react";

import { SettingsContext, TwitchContext } from "@/state";

export const TwitchTestLog = () => {
  const logRef = useRef(null);
  const { index, settings } = useContext(SettingsContext)!;
  const { twitch } = settings.profiles[index];
  const {
    channel,
    isTwitchConnected,
    triggerLog,
    twitchLog,
    disconnect,
    joinChannel,
    setTriggers,
  } = useContext(TwitchContext)!;

  useEffect(() => {
    setTriggers(twitch.triggers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitch.triggers]);

  useEffect(() => {
    if (logRef?.current) {
      (logRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [twitchLog]);

  // convert timestamp to HH:MM:SS
  const formatTimestamp = (timestamp: string) => {
    let period = "AM";
    const date = new Date(parseInt(timestamp));
    let hours = date.getHours();
    if (hours > 12) {
      hours -= 12;
      period = "PM";
    }
    const minutes = "0" + date.getMinutes();
    return `[${hours}:${minutes.slice(-2)} ${period}]`;
  };

  const handleToggleConnectionClick = () => {
    if (isTwitchConnected) {
      disconnect();
    } else {
      joinChannel(twitch.channel);
    }
  };

  return (
    <>
      <label className="form-label mb-3">
        Test Chat Log{" "}
        <button
          type="button"
          className="btn btn-primary bg-gradient ms-2"
          onClick={handleToggleConnectionClick}
          disabled={!isTwitchConnected && !twitch.channel}
        >
          {isTwitchConnected ? "Disconnect" : "Connect to Channel"}
        </button>
      </label>
      <div className="tt-log bd-gray-700 p-3 custom-shadow-inset-sm rounded">
        <div className="tt-log-content">
          <ul className="list-unstyled mb-0">
            {twitchLog.map((message) => (
              <li key={message.id} className="text-gray-400">
                {formatTimestamp(message.timestamp)}{" "}
                <b className="text-warning">{message.userName}:</b>{" "}
                <span className="text-info">
                  {message.command ? "!" + message.command + " " : ""}
                </span>
                {message.message}
              </li>
            ))}
          </ul>
          <div className="tt-log-anchor" ref={logRef}></div>
        </div>
      </div>
    </>
  );
};
