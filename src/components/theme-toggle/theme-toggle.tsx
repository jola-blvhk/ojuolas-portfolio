"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TbSunFilled } from "react-icons/tb";
import { IoMdMoon } from "react-icons/io";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = theme === "light";

  const switchClasses = `flex border border-brand-stroke items-center justify-center text-dark rounded-full transform ${
    isActive ? " text-purple-100 " : "text-white "
  } `;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div></div>;
  return (
    <div
      className={`relative grid content-center justify-center ${isActive ? "bg-p 0" : ""} w-15 h-15  rounded-full p-1 cursor-pointer `}
      onClick={toggleTheme}
    >
      <button className={switchClasses}>
        {isActive ? <IoMdMoon size={38} /> : <TbSunFilled color={"#ffffff"} className="text-white" size={45} />}
      </button>
    </div>
  );
};

export default ThemeToggle;