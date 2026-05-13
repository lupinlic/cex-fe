"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Item {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
}

interface HoverCardProps {
  items: Item[];
}

export function HoverCard({ items }: HoverCardProps) {
  return (
    <div className=" mt-3 w-auto">
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className={`flex gap-3 p-2 rounded-lg hover:bg-neutral-100 transition items-center ${
              item.onClick ? 'cursor-pointer' : ''
            }`}
          >
            {item.link ? (
              <Link href={item.link} className="flex gap-3 items-center w-full">
                <div className="mt-1 text-black">{item.icon}</div>
                <div>
                  <p className="font-medium text-black">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ) : (
              <>
                <div className="mt-1 text-black">{item.icon}</div>
                <div>
                  <p className="font-medium text-black">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
