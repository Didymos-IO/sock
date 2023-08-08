import { TwitchTrigger } from "@/types";

type ActionInfoProps = {
  action: TwitchTrigger["action"];
  type: TwitchTrigger["type"];
};

export const ActionInfo = (props: ActionInfoProps) => {
  const { action, type } = props;

  const getActionKey = () => {
    switch (action) {
      case "tts":
        return "Text to Speech";
      case "response":
        return "Get ChatGPT Response";
      default:
        return "";
    }
  };

  const getActionValue = () => {
    switch (action) {
      case "tts":
        return "The puppet will speak out loud the text the user typed into the command or reward.";
      case "response":
        return "The puppet will speak out loud a response from the ChatGPT model to what the user said to it.";
      default:
        return "";
    }
  };

  const getTypeKey = () => {
    switch (type) {
      case "attention":
        return "Attention";
      case "command":
        return "Command";
      case "reward":
        return "Reward";
      case "wordcount":
        return "Word Count";
      default:
        return "";
    }
  };

  const getTypeValue = () => {
    switch (type) {
      case "attention":
        return "The action triggers when a member of the appropriate role types the attention word in chat.";
      case "command":
        return "The action triggers when a member of the appropriate role types the command in chat.";
      case "reward":
        return "The action triggers when a member of the appropriate role redeems the reward. The reward must be one with a text input.";
      case "wordcount":
        return "The action triggers when enough words in chat are typed in aggregate by chat members of the appropriate role levels.";
      default:
        return "";
    }
  };

  if (action !== "tts" && action !== "response") {
    return null;
  }

  return (
    <>
      <div className="col-12">
        <div className="alert alert-warning" role="alert">
          <p className="fs-7 mb-0 text-tip-yellow">
            <b>{getTypeKey()}:</b>&nbsp;{getTypeValue()}
          </p>
          <br />
          <p className="fs-7 mb-0 text-tip-yellow">
            <b>{getActionKey()}:</b>&nbsp;{getActionValue()}
          </p>
        </div>
      </div>
    </>
  );
};
