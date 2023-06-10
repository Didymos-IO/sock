/* eslint-disable @next/next/no-img-element */
import { MouseEvent, useContext } from "react";

import { SettingsContext } from "@/state";

import { NavLink } from "./children";

type HeaderProps = {
  location: string;
  onSetLocation: (location: string) => void;
};

export const Header = (props: HeaderProps) => {
  const { location, onSetLocation } = props;
  const context = useContext(SettingsContext)!;
  const { isDirty, setIsDirty } = context;

  const onClickLink = (e: any) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    console.log((e.target as HTMLAnchorElement).href);
    const query = (e.target as HTMLAnchorElement).href
      .split("?loc=")[1]
      .split("#")[0];
    if (location === "settings" && isDirty) {
      if (
        window.confirm(
          "Do you want to leave settings? You have unsaved changes."
        )
      ) {
        setIsDirty(false);
        onSetLocation(query);
      }
    } else {
      onSetLocation(query);
    }
  };

  return (
    <header className="px-3 py-2 bg-dark-subtle custom-shadow-sm text-white position-relative">
      <div className="header-container container-xxl">
        <a
          href="?loc=stage"
          className="unstyled"
          onClick={(e) => {
            e.preventDefault();
            onClickLink({ target: { href: "?loc=stage" } });
          }}
        >
          <img
            src="/assets/icons/favicon-32.png"
            alt="sock-logo"
            className="d-inline-block me-3 align-top"
          />
          <h1 className="sock-headline fs-4 fw-normal mb-0 d-inline-block align-top">
            Sock
          </h1>
        </a>
        <ul className="float-end mb-0 nav">
          <NavLink
            isActive={location === "stage"}
            location="stage"
            onClick={onClickLink}
          >
            Stage
          </NavLink>
          <NavLink
            isActive={location === "settings"}
            location="settings"
            onClick={onClickLink}
          >
            Settings
          </NavLink>
          <li className="nav-item">
            <a
              className={`nav-link text-white py-0 pe-0`}
              href="https://github.com/Didymos-IO/sock/wiki"
              target="_blank"
            >
              Documentation
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};
