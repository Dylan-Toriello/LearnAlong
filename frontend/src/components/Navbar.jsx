import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "night";
  });

  useEffect(() => {
    const root = document.documentElement;
    const theme = isDark ? "night" : "nord";
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="navbar w-full max-w-[100vw] px-4 md:px-6 overflow-x-hidden">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-48 sm:w-52 bg-base-100"
          >
            <li>
              <a href="/">Home</a>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="/">
          Learn Along
        </a>
      </div>

      <div className="navbar-end">
        <label className="toggle text-base-content">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </g>
          </svg>
          <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </g>
          </svg>
        </label>
      </div>
    </div>
  );
};
