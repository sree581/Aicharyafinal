// LocalStorage data management utilities

export interface QuizResult {
  date: string;
  score: number;
  subject: string;
  answers: Record<string, string>;
  questions: Array<{
    id: string;
    topic: string;
    question: string;
    options: string[];
    correct: string;
  }>;
}

// Get quiz history for a specific subject and user
export function getQuizHistory(userId: string, subjectId: string): QuizResult[] {
  const history = localStorage.getItem(`quizHistory_${userId}_${subjectId}`);
  return history ? JSON.parse(history) : [];
}

// Save quiz result for a specific user
export function saveQuizResult(userId: string, subjectId: string, result: QuizResult): void {
  const history = getQuizHistory(userId, subjectId);
  history.push(result);
  localStorage.setItem(`quizHistory_${userId}_${subjectId}`, JSON.stringify(history));
}

// Clear quiz history for a subject and user
export function clearQuizHistory(userId: string, subjectId: string): void {
  localStorage.removeItem(`quizHistory_${userId}_${subjectId}`);
}

// Get all quiz history across all subjects for a user
export function getAllQuizHistory(userId: string): Record<string, QuizResult[]> {
  const subjects = ['java', 'datastructure', 'maths', 'physics', 'chemistry'];
  const allHistory: Record<string, QuizResult[]> = {};
  
  subjects.forEach(subject => {
    allHistory[subject] = getQuizHistory(userId, subject);
  });
  
  return allHistory;
}

// Calculate statistics for a subject and user
export function calculateSubjectStats(userId: string, subjectId: string) {
  const history = getQuizHistory(userId, subjectId);
  
  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      improvement: 0,
    };
  }
  
  const scores = history.map(q => q.score);
  const totalQuizzes = history.length;
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalQuizzes);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  
  // Calculate improvement
  let improvement = 0;
  if (history.length >= 4) {
    const recent = history.slice(-3);
    const previous = history.slice(-6, -3);
    const recentAvg = recent.reduce((sum, q) => sum + q.score, 0) / recent.length;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, q) => sum + q.score, 0) / previous.length 
      : recentAvg;
    improvement = Math.round(recentAvg - previousAvg);
  }
  
  return {
    totalQuizzes,
    averageScore,
    highestScore,
    lowestScore,
    improvement,
  };
}

// Calculate topic-wise performance for a user
export function calculateTopicPerformance(userId: string, subjectId: string, topics: string[]) {
  const history = getQuizHistory(userId, subjectId);
  
  if (history.length === 0) {
    return topics.map(topic => ({ 
      topic, 
      accuracy: 0, 
      correct: 0, 
      total: 0,
      quizCount: 0 
    }));
  }
  
  const topicStats: Record<string, { correct: number; total: number; quizzes: Set<number> }> = {};
  
  history.forEach((quiz, quizIndex) => {
    if (quiz.questions && quiz.answers) {
      quiz.questions.forEach(question => {
        const topic = question.topic;
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0, quizzes: new Set() };
        }
        topicStats[topic].total++;
        topicStats[topic].quizzes.add(quizIndex);
        if (quiz.answers[question.id] === question.correct) {
          topicStats[topic].correct++;
        }
      });
    }
  });
  
  return topics.map(topic => {
    const stats = topicStats[topic];
    if (!stats || stats.total === 0) {
      return { topic, accuracy: 0, correct: 0, total: 0, quizCount: 0 };
    }
    return {
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total,
      quizCount: stats.quizzes.size,
    };
  });
}

// Identify weak areas (topics with lowest accuracy) for a user
export function identifyWeakAreas(userId: string, subjectId: string) {
  const history = getQuizHistory(userId, subjectId);
  
  if (history.length === 0) {
    return [];
  }
  
  const topicStats: Record<string, { correct: number; total: number }> = {};
  
  history.forEach(quiz => {
    if (quiz.questions && quiz.answers) {
      quiz.questions.forEach(question => {
        const topic = question.topic;
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0 };
        }
        topicStats[topic].total++;
        if (quiz.answers[question.id] === question.correct) {
          topicStats[topic].correct++;
        }
      });
    }
  });
  
  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

// Get recent activity (last N quizzes) for a user
export function getRecentActivity(userId: string, subjectId: string, count: number = 5): QuizResult[] {
  const history = getQuizHistory(userId, subjectId);
  return history.slice(-count).reverse();
}

// Export all data for a user (for backup)
export function exportAllData(userId: string): string {
  const allData = {
    userId,
    quizHistory: getAllQuizHistory(userId),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(allData, null, 2);
}

// Import data for a user (from backup)
export function importData(userId: string, jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.quizHistory) {
      Object.entries(data.quizHistory).forEach(([subject, history]) => {
        localStorage.setItem(`quizHistory_${userId}_${subject}`, JSON.stringify(history));
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

// Clear all quiz data for a specific user
export function clearUserQuizData(userId: string): void {
  const subjects = ['java', 'datastructure', 'maths', 'physics', 'chemistry'];
  subjects.forEach(subject => {
    localStorage.removeItem(`quizHistory_${userId}_${subject}`);
  });
}

// Clear all application data (admin only)
export function clearAllData(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('edulearn_') || key.startsWith('quizHistory_')) {
      localStorage.removeItem(key);
    }
  });
}
