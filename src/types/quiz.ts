export interface QuizDetail {
  quizId: string;
  type: string;
  targetContentId: string;
  title: string;
  isDaily: boolean;
  dailyDate?: string | null;
  estimatedMinutes: number;
  tip?: string | null;
  questionCount: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  order: number;
  skill: string;
  source: string;
  difficulty: string;
  topic?: string | null;
  content: string;
  options: QuizOption[];
}

export interface QuizOption {
  optionId: string;
  text: string;
}

export interface DailyQuiz {
  date: string;
  isCached: boolean;
  quiz: QuizDetail;
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitQuizRequest {
  answers: QuizAnswerSubmission[];
}

export interface QuizSubmitResult {
  attemptId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: string;
  completedAt: string;
  skillScores: QuizSkillScore[];
  questions: QuizQuestionResult[];
}

export interface QuizSkillScore {
  skill: string;
  total: number;
  correct: number;
  score: number;
}

export interface QuizQuestionResult {
  questionId: string;
  skill: string;
  content: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
}

export interface StoredQuizResult {
  result: QuizSubmitResult;
  source: {
    kind: 'daily' | 'lesson';
    lessonId?: string;
    title: string;
  };
}
