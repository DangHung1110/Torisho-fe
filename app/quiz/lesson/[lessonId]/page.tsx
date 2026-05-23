import QuizRunner from '@/src/components/quiz/QuizRunner';

type LessonQuizPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonQuizPage({ params }: LessonQuizPageProps) {
  const { lessonId } = await params;
  return <QuizRunner mode="lesson" lessonId={lessonId} />;
}
