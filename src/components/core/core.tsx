/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import { Header, Settings, Stage } from "@/components";
import { Helpers } from "@/modules";
import { SettingsProvider, StageProvider } from "@/state";

export default function Core() {
  const [location, setLocation] = useState("");

  useEffect(() => {
    const loc = Helpers.getLocation();
    setLocation(loc ? loc : "stage");
  }, []);

  useEffect(() => {
    Helpers.setLocation(location);
  }, [location]);

  const handleSetLocation = (loc: string) => {
    setLocation(loc);
    Helpers.setLocation(loc);
  };

  return (
    <>
      <SettingsProvider>
        <StageProvider>
          <Header location={location} onSetLocation={handleSetLocation} />
          {location === "settings" && <Settings />}
          {location === "stage" && <Stage />}
        </StageProvider>
      </SettingsProvider>
    </>
  );
}
