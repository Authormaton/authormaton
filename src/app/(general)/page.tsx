import { getProjects } from "@/actions/projects/getProjects";
import { getProjectAnalytics } from "@/actions/analytics";
import { BasicAlert } from "@/components/common/BasicAlert";
import { HomePageContainer } from "@/components/pages/home/HomePageContainer";
import { ExportDialog } from "@/components/models/projects/ExportDialog";
import { ProjectStats } from "@/components/models/analytics/ProjectStats";
import { safeAwait } from "@/lib/async";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();
  const userId = session.user?.id;

  if (!userId) {
    redirect("/signin");
  }

  const [projectsError, projectsResult] = await safeAwait(getProjects(userId));
  const [analyticsError, analyticsResult] = await safeAwait(getProjectAnalytics());

  if (projectsError) {
    return <BasicAlert variant="destructive" title="Error loading projects" description={projectsError.message} />;
  }

  if (!projectsResult.success) {
    return <BasicAlert variant="destructive" title="Error loading projects" description={projectsResult.error} />;
  }

  if (analyticsError) {
    return <BasicAlert variant="destructive" title="Error loading analytics" description={analyticsError.message} />;
  }

  if (!analyticsResult.success) {
    return <BasicAlert variant="destructive" title="Error loading analytics" description={analyticsResult.error} />;
  }

  const projects = projectsResult.data;
  const analytics = analyticsResult.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ExportDialog />
      </div>
      <ProjectStats
        totalProjects={analytics.totalProjects}
        projectsByStatus={analytics.projectsByStatus}
        projectsByCreationMonth={analytics.projectsByCreationMonth}
      />
      <HomePageContainer projects={projects} />
    </div>
  );
}