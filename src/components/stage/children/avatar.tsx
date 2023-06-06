/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from "react";

import { SettingsContext, StageContext } from "@/state";

import { AvatarLayerSettings } from "@/types";

type AvatarProps = {
  overrideTalking?: boolean;
};

export const Avatar = (props: AvatarProps) => {
  const { overrideTalking } = props;
  const { isSpeaking, isThinking } = useContext(StageContext)!;
  const [areEyesOpen, setAreEyesOpen] = useState(true);
  const [eyeDirection, setEyeDirection] = useState("center");
  const [isMouthOpen, setIsMouthOpen] = useState(false);
  const [timeForEyeChange, setTimeForEyeChange] = useState(Date.now() + 5000);
  const [timeToBlink, setTimeToBlink] = useState(200);
  const [timeToOpenMouth, setTimeToOpenMouth] = useState(0);
  const [tick, setTick] = useState(0);
  const { index, settings } = useContext(SettingsContext)!;
  const { profiles } = settings;
  const { avatar } = profiles[index];
  const { layers } = avatar;
  useEffect(() => {
    setTimeToBlink(getBlinkTime() + Date.now());
    setTimeout(() => {
      updateTick();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      updateTick();
    }, 40);
    toggleBlinking();
    toggleEyeDirection();
    toggleIsMouthOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const getBlinkTime = () => {
    return (Math.floor(Math.random() * (10 - 2 + 1)) + 2) * 1000;
  };

  const getCurrentImg = (layer: AvatarLayerSettings) => {
    let imgIndex;
    if (isMouthOpen) {
      imgIndex = 0;
    } else if (isThinking) {
      imgIndex = 1;
    } else if (!areEyesOpen) {
      imgIndex = 2;
    } else if (eyeDirection === "left" && !isSpeaking && !overrideTalking) {
      imgIndex = 3;
    } else if (eyeDirection === "right" && !isSpeaking && !overrideTalking) {
      imgIndex = 4;
    } else {
      imgIndex = 5;
    }
    let imgArray = [
      layer.talking,
      layer.thinking,
      layer.blinking,
      layer.altPose1,
      layer.altPose2,
      layer.default,
    ];
    for (let i = imgIndex; i < imgArray.length; i++) {
      if (imgArray[i]) {
        return imgArray[i];
      }
    }
    return false;
  };

  const toggleBlinking = () => {
    if (Date.now() >= timeToBlink) {
      setTimeToBlink(Date.now() + (!areEyesOpen ? getBlinkTime() : 200));
      setAreEyesOpen(!areEyesOpen);
    }
  };

  const toggleEyeDirection = () => {
    if (Date.now() >= timeForEyeChange) {
      if (eyeDirection === "center") {
        setEyeDirection(Math.random() < 0.5 ? "left" : "right");
        setTimeForEyeChange(
          Date.now() + (Math.floor(Math.random() * (4 - 1 + 1)) + 1) * 1000
        );
      } else {
        setEyeDirection("center");
        setTimeForEyeChange(
          Date.now() + (Math.floor(Math.random() * (12 - 6 + 1)) + 6) * 1000
        );
      }
    }
  };

  const toggleIsMouthOpen = () => {
    if (isSpeaking || overrideTalking) {
      if (Date.now() >= timeToOpenMouth) {
        setIsMouthOpen(!isMouthOpen);
        setTimeToOpenMouth(Date.now() + 200);
      }
    } else {
      setIsMouthOpen(false);
    }
  };

  const updateTick = () => {
    let newTick = tick + 1;
    if (newTick > 30) {
      newTick = 0;
    }
    setTick(newTick);
  };

  const reversedLayers = [...layers];
  reversedLayers.reverse(); // nosonar

  return (
    <div className="card">
      <div className="card-body">
        <div
          className="avatar"
          style={{ backgroundColor: `#${avatar.bgColor}` }}
        >
          {reversedLayers.map((layer, index) => {
            const imgUrl = getCurrentImg(layer);
            if (imgUrl) {
              return (
                <img
                  key={layer.id}
                  className="avatar-layer"
                  src={`${layer.path}${imgUrl}`}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
