import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminSpeakingRoomsPage() {
  return (
    <AdminModulePage
      eyebrow="Speaking operations"
      title="Speaking Rooms"
      description="Monitor speaking practice rooms, matching state, waiting rooms, and active sessions."
      permission={AppPermissions.RoomsMonitor}
      actions={[
        {
          label: 'Lobby QA',
          description: 'Open the learner speaking lobby and verify idle, searching, and matched states.',
          href: '/speaking',
        },
        {
          label: 'Room Monitor',
          description: 'Track active rooms, participant counts, room state, and session duration.',
        },
        {
          label: 'Moderation Queue',
          description: 'Prepare session intervention and report review tools for speaking practice.',
        },
        {
          label: 'Connection Health',
          description: 'Inspect SignalR room health and media readiness once backend metrics are exposed.',
        },
      ]}
      notes={[
        'RoomsMonitor permission is seeded for the admin role.',
        'Speaking room UI remains learner-facing; this page is the future admin control surface.',
      ]}
    />
  );
}
