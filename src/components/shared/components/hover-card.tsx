"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Item {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

interface HoverCardProps {
  items: Item[];
}

export function HoverCard({ items }: HoverCardProps) {
  return (
    <div className=" mt-3 w-auto">
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="flex gap-3 p-2 rounded-lg hover:bg-neutral-100 transition items-center cursor-pointer"
          >
            <div className="mt-1 text-black">{item.icon}</div>

            <div>
              <p className="font-medium text-black">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
