"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TbSunFilled } from "react-icons/tb";
import useSound from "use-sound";
import { IoMdMoon } from "react-icons/io";

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isActive = (theme ?? resolvedTheme) === "light";
  const toggleSfx = "/sounds/click.mp3";

  // Use sound hook
  const [play] = useSound(toggleSfx, { volume: 2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div></div>;

  const toggleTheme = () => {
    // If user toggles when system is default, we switch to explicit theme
    setTheme(isActive ? "dark" : "light");
    play(); // Play toggle sound
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`w-15 h-15 rounded-full grid place-items-center border border-brand-grey bg-brand-snow backdrop-blur scale-75 md:scale-100 transition-colors hover:bg-brand-grey/66 `}
    >
      {isActive ? (
        <IoMdMoon className="text-black "size={38} />
      ) : (
        <TbSunFilled className="text-white" size={38} />
      )}
    </button>
  );
};

export default ThemeToggle;
