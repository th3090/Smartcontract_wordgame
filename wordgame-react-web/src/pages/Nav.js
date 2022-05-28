//pages/Nav.js
import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <Link to="/game">
        <button>정보 화면으로</button>
      </Link>
    </>
  );
}

export default Nav;