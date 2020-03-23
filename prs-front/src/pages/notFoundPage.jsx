import React from "react";
import { Link } from "react-router-dom";

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NotFoundPage() {
  return (
    <div>
      <Link to="/">
        <FontAwesomeIcon icon={faHome} size="2x" />
      </Link>
      <div>
        <span>404</span>
        <span>Page Not Found...</span>
      </div>
    </div>
  );
}
