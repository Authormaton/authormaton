import { z } from "zod";
import { protectedAction } from "@/lib/action";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const inviteMemberSchema = z.object({
  projectId: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export const inviteMember = protectedAction(inviteMemberSchema, { projectId: (input) => input.projectId, requiredRoles: [UserRole.ADMIN] }, async ({ projectId, email, role }, { user }) => {
  // TODO: Implement actual invitation logic (e.g., send email, create invitation token)
  // For now, directly add the user if they exist
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    throw new Error("User not found");
  }

  await prisma.projectMember.create({
    data: {
      projectId,
      userId: existingUser.id,
      role,
    },
  });

  return { success: true, message: `User ${email} invited as ${role}` };
});

export const removeMemberSchema = z.object({
  projectId: z.string(),
  memberId: z.string(),
});

export const removeMember = protectedAction(removeMemberSchema, { projectId: (input) => input.projectId, requiredRoles: [UserRole.ADMIN] }, async ({ projectId, memberId }, { user }) => {
  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId: memberId,
      },
    },
  });

  return { success: true, message: "Member removed" };
});

export const updateMemberRoleSchema = z.object({
  projectId: z.string(),
  memberId: z.string(),
  role: z.nativeEnum(UserRole),
});

export const updateMemberRole = protectedAction(updateMemberRoleSchema, { projectId: (input) => input.projectId, requiredRoles: [UserRole.ADMIN] }, async ({ projectId, memberId, role }, { user }) => {
  await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId,
        userId: memberId,
      },
    },
    data: {
      role,
    },
  });

  return { success: true, message: "Member role updated" };
});

export const getProjectMembersSchema = z.object({
  projectId: z.string(),
});

export const getProjectMembers = protectedAction(getProjectMembersSchema, { projectId: (input) => input.projectId, requiredRoles: [UserRole.MEMBER, UserRole.ADMIN] }, async ({ projectId }, { user }) => {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return { success: true, data: members };
});
