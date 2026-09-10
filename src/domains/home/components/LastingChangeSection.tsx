import {
  MobileStack,
  SmToLgLayout,
  LgToXlLayout,
  XlLayout,
} from "./lasting-change";

export default function LastingChangeSection() {
  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 py-10 lg:px-10 lg:py-16 2xl:px-40">
        <MobileStack />
        <SmToLgLayout />
        <LgToXlLayout />
        <XlLayout />
      </div>
    </section>
  );
}
