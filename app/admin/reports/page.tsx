import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminReportsPage() {
  return (
    <AdminModulePage
      eyebrow="Operational reports"
      title="Reports"
      description="Prepare usage, learning progress, content quality, quiz, and speaking practice reports."
      permission={AppPermissions.AdminAccess}
      actions={[
        {
          label: 'Learning Progress',
          description: 'Summarize learner progress by JLPT level, chapter, lesson, and skill type.',
        },
        {
          label: 'Quiz Performance',
          description: 'Review score distribution, mistakes, and question quality signals.',
        },
        {
          label: 'Content Coverage',
          description: 'Inspect curriculum completeness across vocabulary, grammar, reading, and quiz sections.',
        },
        {
          label: 'Speaking Usage',
          description: 'Track speaking sessions, room duration, matching success, and participant activity.',
        },
      ]}
      notes={[
        'Reports should use read-only admin endpoints and avoid mutating learner data.',
        'Keep report cards dense and table-first once real metrics exist.',
      ]}
    />
  );
}
