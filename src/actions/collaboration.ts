import { z } from 'zod';
import { protectedAction } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { Role } from '@/generated/prisma/client';

export const inviteMemberSchema = z.object({
  projectId: z.string(),
  email: z.string().email().nonempty(),
  role: z.nativeEnum(Role)
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const inviteMember = protectedAction.action(
  inviteMemberSchema,
  { projectId: (input: InviteMemberInput) => input.projectId, requiredRoles: [Role.ADMIN] },
  async ({ input: { projectId, email, role }, ctx: { user } }) => {
    // TODO: Implement actual invitation logic (e.g., send email, create invitation token)
    // For now, directly add the user if they exist
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      throw new Error('User not found');
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: existingUser.id,
        role
      }
    });

    return { success: true, message: `User ${email} invited as ${role}` };
  }
);

export const removeMemberSchema = z.object({
  projectId: z.string(),
  memberId: z.string()
});

export const removeMember = protectedAction.action(
  removeMemberSchema,
  { projectId: (input: z.infer<typeof removeMemberSchema>) => input.projectId, requiredRoles: [Role.ADMIN] },
  async ({ input: { projectId, memberId }, ctx: { user } }) => {
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId
        }
      }
    });

    return { success: true, message: 'Member removed' };
  }
);

export const updateMemberRoleSchema = z.object({
  projectId: z.string(),
  memberId: z.string(),
  role: z.nativeEnum(Role)
});

export const updateMemberRole = protectedAction.action(
  updateMemberRoleSchema,
  { projectId: (input: z.infer<typeof updateMemberRoleSchema>) => input.projectId, requiredRoles: [Role.ADMIN] },
  async ({ input: { projectId, memberId, role }, ctx: { user } }) => {
    await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId
        }
      },
      data: {
        role
      }
    });

    return { success: true, message: 'Member role updated' };
  }
);

export const getProjectMembersSchema = z.object({
  projectId: z.string()
});

export const getProjectMembers = protectedAction(
  getProjectMembersSchema,
  { projectId: (input) => input.projectId, requiredRoles: [Role.USER, Role.ADMIN] },
  async ({ input: { projectId }, ctx: { user } }) => {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return { success: true, data: members };
  }
);
