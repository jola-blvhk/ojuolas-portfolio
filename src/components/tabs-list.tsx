"use client";

import { useState } from "react";

type TabItem = {
  title: string;
  href?: string;
};

type TabsListProps = {
  items: TabItem[];
  initialActiveIndex?: number;
  activeIndex?: number;
  onChange?: (index: number, item: TabItem) => void;
};

export default function TabsList({ items, initialActiveIndex = 0, activeIndex: controlledActiveIndex, onChange }: TabsListProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(initialActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  return (
    <nav className="w-full overflow-x-auto scrollbar-none ">
      <ul className="flex w-max  items-center gap-6 whitespace-nowrap border-b border-brand-grey text-xs text-brand-shadow md:text-base">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={item.title} className="relative">
              <button
                type="button"
                className={
                  "pb-1.5 px-[10px] pt-[10px] leading-[200%]  transition-colors" +
                  (isActive ? " text-foreground font-medium" : " hover:font-medium hover:text-foreground")
                }
                onClick={() => {
                  if (controlledActiveIndex === undefined) {
                    setInternalActiveIndex(index);
                  }
                  onChange?.(index, item);
                }}
              >
                {item.title}
              </button>
              {isActive ? (
                <div className="pointer-events-none absolute bottom-[-1px] left-1/2 h-[1px] w-[65px] -translate-x-1/2 rounded-full bg-foreground" />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


