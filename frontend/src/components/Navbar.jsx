import { useEffect, useState } from "react";

export const Navbar = () => {
    const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "night" : "nord");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  return (
    <div className="navbar bg-base-100 shadow-sm px-[58px]">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Learn Along</a>
      </div>
      <div className="flex-none flex items-center gap-4">
        {/* ADD MENU LINKS IN THE NAVBAR HERE*/}
        <ul className="menu links">
          <li><a href = "\about">About</a></li>
        </ul>
        <label className="toggle text-base-content">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
        />

          <svg
            aria-label="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </g>
          </svg>

          <svg
            aria-label="moon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </g>
          </svg>
        </label>
      </div>
    </div>
  );
};
