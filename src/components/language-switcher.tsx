"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const supportedLocales = ["en", "pt"] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentPath = pathname || "/";

  const getPathWithoutLocale = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    const first = segments[0];
    const isLocale = (supportedLocales as readonly string[]).includes(first);
    const rest = isLocale ? segments.slice(1) : segments;
    return `/${rest.join("/")}`.replace(/\/$/, "") || "/";
  };

  const pathWithoutLocale = getPathWithoutLocale(currentPath);
  const pathSegments = currentPath.split("/").filter(Boolean);
  const activeLocale = (supportedLocales as readonly string[]).includes(pathSegments[0] as any)
    ? (pathSegments[0] as (typeof supportedLocales)[number])
    : "en";

  return (
    <div className="flex items-center gap-2 text-[10px] md:text-xs">
      {supportedLocales.map((loc, idx) => (
        <React.Fragment key={loc}>
          <Link
            href={`/${loc}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
            className={`px-[12px] md:px-10px py-4 flex items-center gap-1 ${
              loc === activeLocale ? "text-brand-shadow-highlight font-medium" : "text-brand-shadow"
            }`}
            prefetch={true}
          >
            <img
              src={loc === "en" ? "/icons/uk-flag.svg" : "/icons/pt-flag.svg"}
              alt={loc === "en" ? "UK flag" : "Portugal flag"}
              
              width={16}
              height={12}
            />
            {loc.toUpperCase()}
          </Link>
          {idx < supportedLocales.length - 1 ? (
            <span aria-hidden className="w-px h-[19px] bg-brand-grey mx-[7px] md:mx-[14px]" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

 
