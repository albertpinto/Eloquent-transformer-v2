import React, { useState } from "react";
import { MdBuildCircle } from "react-icons/md";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Navbar({ title }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  

  return (
    // <nav className="navbar mb-12 shadow-lg bg-neutral text-neutral-content">
    <nav className="navbar mb-12 shadow-lg bg-gradient-to-r from-cyan-500 to blue-500 text-blue">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-none px-2">
          <MdBuildCircle className="inline pr-2 text-3xl" />
          <Link to="/" className="text-lg font-bold align-middle">
            {title}
          </Link>
        </div>

        <div className="flex-1 px-2">
          <div className="flex justify-end items-center">
            <button
              className="btn btn-ghost btn-sm rounded-btn md:hidden"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className={`menu ${isMenuOpen ? "block" : "hidden"}`}>
              <Link to="/" className="btn btn-ghost btn-sm rounded-btn mr-4">
                Basic Tasks
              </Link>
              <Link
                to="/advancedtasks"
                className="btn btn-ghost btn-sm rounded-btn mr-4"
              >
                Advanced
              </Link>
              <Link
                to="/generation"
                className="btn btn-ghost btn-sm rounded-btn mr-4"
              >
                Generation
              </Link>
              <Link
                to="/about"
                className="btn btn-ghost btn-sm rounded-btn mr-4"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  title: "Eloquent AI",
};

Navbar.propTypes = {
  title: PropTypes.string,
};

export default Navbar;
