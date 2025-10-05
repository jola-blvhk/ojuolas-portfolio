'use client';
import Image from 'next/image';
import { LanguageSwitcher } from './language-switcher';
import AnimatedThemeToggle from './theme-toggle/animated-theme-toggle';
import { IoMail } from 'react-icons/io5';

type HeaderProps = {
  backgroundSrc?: string;
  avatarSrc?: string;
  badgeSrc?: string;
  className?: string;
};

export function Header({
  backgroundSrc = '/images/laptop.webp',
  avatarSrc = '/images/profile-picture.webp',
  badgeSrc = '/vercel.svg',
  className,
}: HeaderProps) {
  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="relative">
        <div className="relative h-[74px] w-full md:h-[109px]">
          <Image
            src={backgroundSrc}
            alt="Header background"
            fill
            priority
            className="rounded-br-[15px] rounded-bl-[30px] object-cover md:rounded-b-[30px]"
          />
        </div>

        <div className="pointer-events-none absolute -bottom-9 flex items-center md:-bottom-20">
          <div className="border-brand-snow pointer-events-auto h-[93px] w-[93px] overflow-hidden rounded-full border-4 md:h-35 md:w-35 md:border-8">
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative flex items-start justify-end gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full pt-[9px] md:gap-5 md:pt-6">
          <LanguageSwitcher />
          <AnimatedThemeToggle />
          <a
            href="mailto:ojuolapebello99@gmail.com"
            aria-label="Mail"
            className={`border-brand-grey bg-brand-snow hover:bg-brand-grey/66 grid h-15 w-15 scale-75 place-items-center rounded-full border backdrop-blur transition-colors md:scale-100`}
          >
            <IoMail size={36} />
          </a>
        </div>
      </div>
    </div>
  );
}
