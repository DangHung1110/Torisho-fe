import { AdminModulePage } from '@/src/components/admin/AdminModulePage';
import { AppPermissions } from '@/src/libs/rbac';

export default function AdminQuizzesPage() {
  return (
    <AdminModulePage
      eyebrow="Assessment operations"
      title="Quizzes"
      description="Preview, generate, and maintain daily and lesson quiz data."
      permission={AppPermissions.QuizManage}
      actions={[
        {
          label: 'Preview Lesson Quiz',
          description: 'Call the protected quiz preview endpoint before publishing generated quiz content.',
        },
        {
          label: 'Pregenerate Lesson Quizzes',
          description: 'Prepare lesson quiz data in advance for smoother learner sessions.',
        },
        {
          label: 'Daily Quiz Review',
          description: 'Inspect daily quiz readiness from the learner quiz interface.',
          href: '/quiz/daily',
        },
        {
          label: 'Result QA',
          description: 'Review the learner result screen for score and mistake presentation.',
          href: '/quiz/result',
        },
      ]}
      notes={[
        'Quiz preview and pregeneration endpoints are now guarded by the CanManageQuiz backend policy.',
        'Add admin-specific quiz tables when the backend exposes list and mutation endpoints.',
      ]}
    />
  );
}
