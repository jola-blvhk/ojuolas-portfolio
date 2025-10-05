"use client";
import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";
import AnimatedThemeToggle from "./theme-toggle/animated-theme-toggle";
import { IoMail } from "react-icons/io5";

type HeaderProps = {
  backgroundSrc?: string;
  avatarSrc?: string;
  badgeSrc?: string;
  className?: string;
};

export function Header({
  backgroundSrc = "/images/laptop.webp",
  avatarSrc = "/images/profile-picture.webp",
  badgeSrc = "/vercel.svg",
  className,
}: HeaderProps) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="relative  ">
        <div className="relative h-[74px] md:h-[109px]  w-full">
          <Image
            src={backgroundSrc}
            alt="Header background"
            fill
            priority
            className="object-cover rounded-bl-[30px] rounded-br-[15px] md:rounded-b-[30px]  "
          />
        </div>    

        <div className="pointer-events-none absolute -bottom-9 md:-bottom-20  flex items-center">
          <div className="pointer-events-auto h-[93px] w-[93px] md:h-35 md:w-35 rounded-full overflow-hidden border-4 md:border-8 border-brand-snow ">
            <Image src={avatarSrc} alt="Avatar" width={96} height={96} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className=" relative flex items-start justify-end gap-3">
          <div className="pointer-events-auto flex items-center gap-3  md:gap-5 rounded-full   pt-[9px] md:pt-6 ">
            <LanguageSwitcher />
            <AnimatedThemeToggle />
            <button
                type="button"
                    aria-label="Mail"
      className={`w-15 h-15 rounded-full grid place-items-center border border-brand-grey bg-brand-snow backdrop-blur scale-75 md:scale-100 transition-colors hover:bg-brand-grey/66 `}
    >
   <IoMail size={36}/>
    </button>
          </div>
          
        </div>
    </div>
  );
}


