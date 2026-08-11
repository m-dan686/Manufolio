import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      role="switch"
      className="relative flex items-center w-[54px] h-[28px] rounded-full p-[3px] cursor-pointer border-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)] transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#FF7A00" : "#1F9D55" }}
    >
      <motion.span
        className="flex items-center justify-center w-[22px] h-[22px] bg-white rounded-full shadow-md z-10"
        animate={{
          x: isDark ? 26 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        {isDark ? (
          <FiMoon className="w-3 h-3 text-[#FF7A00]" />
        ) : (
          <FiSun className="w-3 h-3 text-[#1F9D55]" />
        )}
      </motion.span>
    </button>
  );
}
