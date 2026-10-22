import Bannersection from "@/domains/about/components/Bannersection";
import MilestoneSection from "@/domains/about/components/Milestonesection";
import WhoWeAre from "@/domains/about/components/whoweare";
import MissionVisionValues from "@/domains/about/components/missionVisionValues";
import MeetOurLeadership from "@/domains/about/components/MeetOurLeadership";
import OurDocuments from "@/domains/about/components/OurDocuments";

export default function OurTeamPage() {
  return (
    <>
      <Bannersection />
      <WhoWeAre />
      <MissionVisionValues />
      <MeetOurLeadership />
      <MilestoneSection />
      <OurDocuments />
    </>
  );
}