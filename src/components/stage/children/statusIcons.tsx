type StatusIconsProps = {
  isRecording?: boolean;
  isSpeaking?: boolean;
  isThinking?: boolean;
};

export const StatusIcons = (props: StatusIconsProps) => {
  const { isRecording, isSpeaking, isThinking } = props;

  return (
    <div className="status-icons-wrapper">
      <div className={`status-icon s-i-1 ${isThinking ? "active" : ""}`}></div>
      <div className={`status-icon s-i-2 ${isRecording ? "active" : ""}`}></div>
      <div className={`status-icon s-i-3 ${isSpeaking ? "active" : ""}`}></div>
      <div className="status-icon-tip"></div>
    </div>
  );
};
