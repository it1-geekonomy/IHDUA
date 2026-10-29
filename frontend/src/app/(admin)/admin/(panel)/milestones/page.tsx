import { MilestonesPage } from "@/domains/admin/components/MilestonesPage";

export const metadata = {
  title: "Key Milestones | IHDUA Admin",
  description: "Manage historical journey milestones and achievements displayed across the IHDUA website.",
};

export default function AdminMilestonesRoute() {
  return <MilestonesPage />;
}

