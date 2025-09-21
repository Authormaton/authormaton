import { Project } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';

export async function getProjects(): Promise<Result<Project[]>> {
  const projects = await prisma.project.findMany();
  return success(projects);
}
