import { GameList } from "@/components/dashboard/GameList";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireActiveProfile } from "@/lib/auth/guards";
import { getDashboardGames } from "@/lib/services/dashboard-service";

export default async function DashboardPage() {
  const { user } = await requireActiveProfile();
  const games = await getDashboardGames(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Create, manage, and run your games."
      />
      <DashboardActions />
      <GameList games={games} />
    </div>
  );
}
