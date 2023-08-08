import React, { MouseEvent } from "react";

type NavLinkProps = {
  children: React.ReactNode;
  isActive: boolean;
  location: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export const NavLink = (props: NavLinkProps) => {
  const { isActive, location, onClick, children } = props;

  return (
    <li className="nav-item">
      <a
        className={`nav-link text-white ${
          isActive ? "fw-semibold" : ""
        } py-0 pe-0`}
        href={`?loc=${location}`}
        onClick={onClick}
      >
        {children}
      </a>
    </li>
  );
};
