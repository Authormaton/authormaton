import { z } from 'zod';
import { protectedAction } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { Role } from '@/generated/prisma/client';
import { success, error, ErrorCodes } from '@/lib/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const isPrismaNotFoundError = (e: unknown): e is PrismaClientKnownRequestError => {
  return e instanceof PrismaClientKnownRequestError && e.code === 'P2025';
};

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
      return error('User not found', ErrorCodes.NOT_FOUND);
    }

    try {
      await prisma.projectMember.create({
        data: {
          projectId,
          userId: existingUser.id,
          role
        }
      });
      return success({ message: `User ${email} invited as ${role}` });
    } catch (e) {
      console.error('Error inviting member', e);
      return error('Failed to invite member', ErrorCodes.UNKNOWN_ERROR);
    }
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
    try {
      await prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId,
            userId: memberId
          }
        }
      });
      return success({ message: 'Member removed' });
    } catch (e) {
      console.error('Error removing member', e);
      // Check if the error is due to record not found
      if (isPrismaNotFoundError(e)) {
        return error('Member not found', ErrorCodes.NOT_FOUND);
      }
      return error('Failed to remove member', ErrorCodes.UNKNOWN_ERROR);
    }
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
    try {
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
      return success({ message: 'Member role updated' });
    } catch (e) {
      console.error('Error updating member role', e);
      // Check if the error is due to record not found
      if (isPrismaNotFoundError(e)) {
        return error('Member not found', ErrorCodes.NOT_FOUND);
      }
      return error('Failed to update member role', ErrorCodes.UNKNOWN_ERROR);
    }
  }
);

export const getProjectMembersSchema = z.object({
  projectId: z.string()
});

export const getProjectMembers = protectedAction(
  getProjectMembersSchema,
  { projectId: (input) => input.projectId, requiredRoles: [Role.USER, Role.ADMIN] },
  async ({ input: { projectId }, ctx: { user } }) => {
    try {
      const members = await prisma.projectMember.findMany({
        where: { projectId },
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      });
      return success({ data: members });
    } catch (e) {
      console.error('Error fetching project members', e);
      return error('Failed to fetch project members', ErrorCodes.UNKNOWN_ERROR);
    }
  }
);
