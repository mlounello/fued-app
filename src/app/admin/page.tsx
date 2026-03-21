import { AdminTabs } from "@/components/admin/AdminTabs";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminPageData } from "@/lib/services/admin-service";

export default async function AdminPage() {
  await requireAdmin();
  const data = await getAdminPageData();

  return (
    <AdminTabs users={data.users} games={data.games} storage={data.storage} />
  );
}
