export type Role = 'admin' | 'employee' | 'client';

export const rolePaths: Record<Role, string> = {
  admin: '/admin/projects',
  employee: '/employee/projects',
  client: '/client',
};

