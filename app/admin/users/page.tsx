import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminUsersPage() {
  return (
    <AdminModulePage
      eyebrow="User administration"
      title="Users"
      description="Review learner accounts, account status, and role assignments."
      permission={AppPermissions.UsersRead}
      secondaryPermissions={[AppPermissions.UsersManage]}
      actions={[
        {
          label: 'User Directory',
          description: 'Browse user accounts, status, profile data, and assigned roles.',
        },
        {
          label: 'Role Assignment',
          description: 'Promote or demote users through RBAC roles once user-role endpoints are added.',
        },
        {
          label: 'Account State',
          description: 'Review active, disabled, and pending users before applying moderation actions.',
        },
        {
          label: 'Admin Seed',
          description: 'The fixed admin account is created by backend seed on application startup.',
        },
      ]}
      notes={[
        'Backend currently returns roles and permissions through auth responses and JWT claims.',
        'Add admin user listing and role update endpoints before enabling mutation controls.',
      ]}
    />
  );
}
