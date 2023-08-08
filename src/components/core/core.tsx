/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import { Header, Settings, Stage } from "@/components";
import { Helpers } from "@/modules";
import { SettingsProvider, StageProvider, TwitchProvider } from "@/state";

export default function Core() {
  const [tab, setTab] = useState("identity");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const [loc, tab] = Helpers.getLocation();
    setLocation(loc ? loc : "stage");
    if (tab) {
      setTab(tab);
    }
  }, []);

  useEffect(() => {
    Helpers.setLocation(location, location === "settings" ? tab : "");
  }, [tab, location]);

  const handleChangeTab = (tab: string) => {
    setTab(tab);
  };

  const handleSetLocation = (loc: string) => {
    setLocation(loc);
    // Helpers.setLocation(loc, loc === "settings" ? tab : "");
  };

  return (
    <>
      <SettingsProvider>
        <TwitchProvider>
          <StageProvider>
            <Header location={location} onSetLocation={handleSetLocation} />
            {location === "settings" && (
              <Settings onChangeTab={handleChangeTab} />
            )}
            {location === "stage" && <Stage />}
          </StageProvider>
        </TwitchProvider>
      </SettingsProvider>
    </>
  );
}
