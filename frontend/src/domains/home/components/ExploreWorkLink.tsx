"use client";

import type { MouseEvent, ReactNode } from "react";
import { FOCUS_AREAS_ID } from "@/domains/home/constants/development";
import { smoothScrollToId } from "@/shared/lib/smoothScroll";

export function ExploreWorkLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToId(FOCUS_AREAS_ID);
  };

  return (
    <a href={`#${FOCUS_AREAS_ID}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
