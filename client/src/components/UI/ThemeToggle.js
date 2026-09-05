import React from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

/**
 * `full` renders a labelled row for the mobile menu; the default is the
 * compact icon button used in the header.
 */
const ThemeToggle = ({ full = false }) => {
  const { isLight, toggleTheme } = useTheme();
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";

  if (full) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        className="flex w-full items-center gap-3 rounded-xl2 px-3 py-3 text-[15px] font-medium text-primaryText2 transition-colors hover:bg-hair/[0.06] hover:text-primaryText4"
      >
        {isLight ? (
          <HiOutlineMoon className="h-[18px] w-[18px]" />
        ) : (
          <HiOutlineSun className="h-[18px] w-[18px]" />
        )}
        {isLight ? "Dark theme" : "Light theme"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className="icon-btn relative overflow-hidden"
    >
      <HiOutlineSun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-smooth ${
          isLight
            ? "-translate-y-6 rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <HiOutlineMoon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-smooth ${
          isLight
            ? "translate-y-0 rotate-0 opacity-100"
            : "translate-y-6 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
