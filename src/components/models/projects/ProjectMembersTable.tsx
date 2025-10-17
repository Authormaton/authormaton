import { useState } from 'react';
import { toast } from 'sonner';
import { Role } from '@/generated/prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { BasicTable } from '@/components/common/Table/BasicTable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getProjectMembers, removeMember, updateMemberRole } from '@/actions/collaboration';
import { useQuery } from '@tanstack/react-query';

interface ProjectMembersTableProps {
  projectId: string;
}

interface ProjectMember {
  id: string;
  role: Role;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function ProjectMembersTable({ projectId }: ProjectMembersTableProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const result = await getProjectMembers({ projectId });
      if (result.success) {
        return result.data;
      } else {
        toast.error(result.message);
        return [];
      }
    }
  });

  const handleRemoveMember = async (memberId: string) => {
    const result = await removeMember({ projectId, memberId });
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateRole = async (memberId: string, role: Role) => {
    const result = await updateMemberRole({ projectId, memberId, role });
    if (result.success) {
      toast.success(result.message);
      refetch();
    } else {
      toast.error(result.message);
    }
  };

  const columns: ColumnDef<ProjectMember>[] = [
    {
      accessorKey: 'user.name',
      header: 'Name'
    },
    {
      accessorKey: 'user.email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Role'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => handleUpdateRole(member.user.id, Role.ADMIN)}>
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateRole(member.user.id, Role.USER)}>
                Make Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveMember(member.user.id)}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <div className='space-y-4'>
      <BasicTable columns={columns} data={data || []} isLoading={isLoading} />
    </div>
  );
}
