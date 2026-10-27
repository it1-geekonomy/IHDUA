"use client";

import {
  MobileStack,
  SmToLgLayout,
  LgToXlLayout,
  XlLayout,
} from "./lasting-change";

export default function LastingChangeSection() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:py-14 2xl:px-40">
        <MobileStack />
        <SmToLgLayout />
        <LgToXlLayout />
        <XlLayout />
      </div>
    </section>
  );
}
