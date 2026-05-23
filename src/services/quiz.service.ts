import { api } from '../libs/api-client';
import {
  DailyQuiz,
  QuizDetail,
  QuizSubmitResult,
  SubmitQuizRequest,
} from '../types/quiz';

export class QuizService {
  static async getDailyQuiz(): Promise<DailyQuiz> {
    return api.get<DailyQuiz>('/quiz/daily');
  }

  static async getLessonQuiz(lessonId: string, type?: 'Vocabulary' | 'Grammar' | 'Reading'): Promise<QuizDetail> {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return api.get<QuizDetail>(`/quiz/lesson/${lessonId}${query}`);
  }

  static async submitQuiz(quizId: string, data: SubmitQuizRequest): Promise<QuizSubmitResult> {
    return api.post<QuizSubmitResult>(`/quiz/${quizId}/submit`, data);
  }
}
