import { api } from '../libs/api-client';
import {
  ChapterLessonsResponse,
  LessonDetailResponse,
  LevelChaptersResponse,
} from '../types/learning';
import { JLPTLevel } from '../types/room';

export class LearningService {
  static async getLevelChapters(
    levelCode: JLPTLevel
  ): Promise<LevelChaptersResponse> {
    return api.get<LevelChaptersResponse>(
      `/learning/levels/${levelCode}/chapters`,
      { requiresAuth: false }
    );
  }

  static async getChapterLessons(
    levelCode: JLPTLevel,
    chapterOrder: number
  ): Promise<ChapterLessonsResponse> {
    return api.get<ChapterLessonsResponse>(
      `/learning/levels/${levelCode}/chapters/${chapterOrder}/lessons`,
      { requiresAuth: false }
    );
  }

  static async getLessonBySlug(slug: string): Promise<LessonDetailResponse> {
    return api.get<LessonDetailResponse>(
      `/learning/lessons/${slug}`,
      { requiresAuth: false }
    );
  }

  static async startLesson(slug: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(`/learning/lessons/${slug}/start`);
  }

  static async updateLessonProgress(
    slug: string,
    data: LessonHeartbeatRequest
  ): Promise<{ message: string }> {
    return api.post<{ message: string }>(`/learning/lessons/${slug}/progress`, data);
  }

  static async completeLesson(
    slug: string,
    data: LessonHeartbeatRequest
  ): Promise<{ message: string }> {
    return api.post<{ message: string }>(`/learning/lessons/${slug}/complete`, data);
  }
}

export interface LessonHeartbeatRequest {
  lessonProgressPercent: number;
  chapterProgressPercent?: number;
  levelProgressPercent?: number;
  vocabularyProgress?: number;
  grammarProgress?: number;
  readingProgress?: number;
  section?: string;
}
