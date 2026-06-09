import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminDictionaryPage() {
  return (
    <AdminModulePage
      eyebrow="Dictionary operations"
      title="Dictionary"
      description="Review dictionary entries, kanji data, examples, metadata, and moderation surfaces."
      permission={AppPermissions.DictionaryManage}
      secondaryPermissions={[AppPermissions.CommentsModerate]}
      actions={[
        {
          label: 'Dictionary Search QA',
          description: 'Open the learner dictionary search page to inspect entry discovery and suggestion behavior.',
          href: '/dictionary',
        },
        {
          label: 'Entry Review',
          description: 'Prepare admin review for meanings, readings, JLPT tags, examples, and kanji breakdown.',
        },
        {
          label: 'Kanji Data Review',
          description: 'Review kanji metadata and stroke information before exposing it in popups.',
        },
        {
          label: 'Comment Moderation',
          description: 'Moderate dictionary comments when comment administration endpoints are available.',
        },
      ]}
      notes={[
        'Dictionary management permission is seeded for Admin even before mutation endpoints are exposed.',
        'Discussion UI was removed from learner dictionary detail, but moderation permission is reserved for future comment tools.',
      ]}
    />
  );
}
