import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminSettingsPage() {
  return (
    <AdminModulePage
      eyebrow="Platform controls"
      title="Settings"
      description="Review RBAC, seed configuration, and operational settings for the admin workspace."
      permission={AppPermissions.AdminAccess}
      actions={[
        {
          label: 'RBAC Configuration',
          description: 'Review seeded roles, permissions, and protected backend policy names.',
        },
        {
          label: 'Admin Seed',
          description: 'Default admin account is created on backend startup and can be overridden by configuration.',
        },
        {
          label: 'Quiz AI Routing',
          description: 'Inspect quiz AI provider settings and disabled/enabled state from backend configuration.',
        },
        {
          label: 'Security Review',
          description: 'Confirm admin routes stay guarded in the frontend and protected by policies in the backend.',
        },
      ]}
      notes={[
        'Do not expose secret values in the frontend.',
        'Production admin password should be overridden outside committed appsettings.',
      ]}
    />
  );
}
