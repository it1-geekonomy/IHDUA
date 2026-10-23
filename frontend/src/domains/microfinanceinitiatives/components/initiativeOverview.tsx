import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";

interface InitiativeOverviewProps {
  title: string;
  description: string;
  mission: string;
  beneficiaries: string;
}

export default function InitiativeOverview({
  title,
  description,
  mission,
  beneficiaries,
}: InitiativeOverviewProps) {
  return (
    <FeatureHighlightSection
      label="WOMEN EMPOWERMENT"
      heading={title}
      description={description}
      items={[
        {
          icon: "/icons/mission.png",
          iconAlt: "Mission",
          heading: "Mission",
          description: mission,
        },
        {
          icon: "/icons/benifit.png",
          iconAlt: "Beneficiaries",
          heading: "Beneficiaries",
          description: beneficiaries,
        },
      ]}
    />
  );
}
