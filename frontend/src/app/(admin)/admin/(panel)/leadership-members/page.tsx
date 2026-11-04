import { LeadershipMembersPage } from "@/domains/admin/components/LeadershipMembersPage";

export const metadata = {
  title: "Leadership & Team | IHDUA Admin",
  description: "Manage board trustees, core leadership, and committee members.",
};

export default function AdminLeadershipMembersRoute() {
  return <LeadershipMembersPage />;
}

