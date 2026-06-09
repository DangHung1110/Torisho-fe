import { User } from '../types/auth';

export const AppRoles = {
  Admin: 'Admin',
  User: 'User',
} as const;

export const AppPermissions = {
  AdminAccess: 'admin.access',
  UsersRead: 'users.read',
  UsersManage: 'users.manage',
  ContentRead: 'content.read',
  ContentManage: 'content.manage',
  CurriculumImport: 'curriculum.import',
  QuizManage: 'quiz.manage',
  DictionaryManage: 'dictionary.manage',
  CommentsModerate: 'comments.moderate',
  RoomsMonitor: 'rooms.monitor',
} as const;

export function hasRole(user: User | null | undefined, role: string): boolean {
  if (!user) return false;
  return user.roles?.includes(role) === true || user.role === role;
}

export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false;
  return user.permissions?.includes(permission) === true;
}

export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, AppRoles.Admin);
}

export function getPostLoginPath(user: User | null | undefined): string {
  return isAdmin(user) ? '/admin/dashboard' : '/dashboard';
}
