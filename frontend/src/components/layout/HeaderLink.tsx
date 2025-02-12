import React from "react";
import { Link } from "react-router-dom";

type HeaderLinkProps = {
  to: string;
  text: string;
};

const HeaderLink: React.FC<HeaderLinkProps> = ({ to, text }) => {
  return (
    <Link
      to={to}
      style={{ color: "#159d17", fontSize: "1.25rem", margin: "auto" }}
    >
      {text}
    </Link>
  );
};

export default HeaderLink;