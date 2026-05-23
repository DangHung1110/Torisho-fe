export interface DashboardResponse {
  profile: DashboardProfile;
  today: DashboardToday;
  progressByLevel: DashboardLevelProgress[];
  streak: DashboardStreak;
  continueLearning?: DashboardContinueLearning | null;
  quickStats: DashboardQuickStats;
  calendar: DashboardCalendar;
}

export interface DashboardProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
}

export interface DashboardToday {
  date: string;
  timezone: string;
  dailyWord?: DashboardDailyWord | null;
  dailyQuiz?: DashboardDailyQuiz | null;
}

export interface DashboardDailyWord {
  entryId: string;
  term: string;
  reading: string;
  meaning: string;
}

export interface DashboardDailyQuiz {
  date: string;
  isCached: boolean;
  quiz: {
    quizId: string;
    title: string;
    estimatedMinutes: number;
    questionCount: number;
    tip?: string | null;
  };
}

export interface DashboardLevelProgress {
  levelId: string;
  levelCode: string;
  levelName: string;
  completionPercent: number;
  vocabularyProgress: number;
  grammarProgress: number;
  readingProgress: number;
  completedChapters: number;
  totalChapters: number;
  status: string;
}

export interface DashboardStreak {
  current: number;
  longest: number;
  studiedToday: boolean;
}

export interface DashboardContinueLearning {
  levelId: string;
  levelCode: string;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonProgressPercent: number;
  currentSection?: string | null;
  lastUpdated: string;
}

export interface DashboardQuickStats {
  vocabularyLearned: number;
  grammarLearned: number;
  kanjiLearned: number;
}

export interface DashboardCalendar {
  year: number;
  month: number;
  studyDates: string[];
}
