import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminCurriculumPage() {
  return (
    <AdminModulePage
      eyebrow="Content operations"
      title="Curriculum"
      description="Import and maintain JLPT levels, chapters, lessons, vocabulary, grammar, and reading content."
      permission={AppPermissions.CurriculumImport}
      secondaryPermissions={[AppPermissions.ContentManage]}
      actions={[
        {
          label: 'Import Curriculum',
          description: 'Use the protected backend import endpoint to load structured curriculum data.',
        },
        {
          label: 'Validate Lessons',
          description: 'Check lesson coverage and identify missing vocabulary, grammar, or reading sections.',
        },
        {
          label: 'Content Review',
          description: 'Prepare editorial review tools for chapters and lesson metadata.',
        },
        {
          label: 'Learner Preview',
          description: 'Open the learner adventure page to inspect how published lessons render.',
          href: '/adventure',
        },
      ]}
      notes={[
        'Curriculum import is now guarded by the CanImportCurriculum backend policy.',
        'Keep destructive import actions behind confirmation once wired to live APIs.',
      ]}
    />
  );
}
