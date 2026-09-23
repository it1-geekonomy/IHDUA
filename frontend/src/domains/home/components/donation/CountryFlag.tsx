import * as Flags from "country-flag-icons/react/3x2";

export function CountryFlag({
  countryCode,
  className,
}: {
  countryCode: string;
  className?: string;
}) {
  const Flag = (Flags as Record<string, React.ElementType>)[
    countryCode.toUpperCase()
  ];
  if (!Flag) {
    return (
      <div className={`bg-gray-200 ${className}`} aria-hidden="true" />
    );
  }
  return <Flag className={className} />;
}
