import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress as ProgressBar } from "./ui/progress";
import { ArrowLeft, TrendingUp, Award, Target } from "lucide-react";
import { Badge } from "./ui/badge";
import { getCurrentUser } from "../lib/auth";
import { getQuizHistory, calculateSubjectStats, calculateTopicPerformance } from "../lib/storage";

interface ProgressProps {
  subjectId: string;
  onBack: () => void;
}

const subjectNames = {
  java: "Java Programming",
  datastructure: "Data Structure",
  maths: "Mathematics",
};

const subjectTopics = {
  java: ["OOP Concepts", "Collections", "Multithreading", "Exception Handling"],
  datastructure: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching"],
  maths: ["Algebra", "Calculus", "Statistics", "Probability"],
};

export function Progress({ subjectId, onBack }: ProgressProps) {
  const subjectName = subjectNames[subjectId as keyof typeof subjectNames];
  const topics = subjectTopics[subjectId as keyof typeof subjectTopics] || [];
  const user = getCurrentUser();

  const quizHistory = user ? getQuizHistory(user.id, subjectId) : [];
  
  // Calculate real statistics from quiz history
  const stats = user ? calculateSubjectStats(user.id, subjectId) : {
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    improvement: 0,
  };

  // Calculate topic progress from quiz history
  const topicProgress = user ? calculateTopicPerformance(user.id, subjectId, topics) : [];

  const recentQuizzes = quizHistory.length > 0 ? quizHistory.slice(-5).reverse() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {subjectName}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Your Progress in {subjectName}</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {quizHistory.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <div className="text-gray-500 mb-4">No quiz data yet</div>
              <p className="text-sm text-gray-600">
                Take your first quiz to start tracking your progress!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Quizzes</div>
                      <div className="text-3xl">{stats.totalQuizzes}</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Average Score</div>
                      <div className="text-3xl">{stats.averageScore}%</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Highest Score</div>
                      <div className="text-3xl">{stats.highestScore}%</div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Improvement</div>
                      <div className="text-3xl">
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                      </div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Topic Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress by Topic</CardTitle>
                  <CardDescription>Your performance across different topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {topicProgress.map((topic) => (
                      <div key={topic.topic}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>{topic.topic}</span>
                          <span className="text-gray-600">
                            {topic.accuracy}% ({topic.quizCount} {topic.quizCount === 1 ? 'quiz' : 'quizzes'})
                          </span>
                        </div>
                        <ProgressBar value={topic.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Quizzes */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quizzes</CardTitle>
                  <CardDescription>Your latest quiz attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentQuizzes.map((quiz: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <div className="text-sm">Quiz {quizHistory.length - index}</div>
                          <div className="text-xs text-gray-500">{quiz.date}</div>
                        </div>
                        <Badge
                          variant={quiz.score >= 80 ? "default" : quiz.score >= 60 ? "secondary" : "outline"}
                          className={
                            quiz.score >= 80
                              ? "bg-green-100 text-green-800"
                              : quiz.score >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {quiz.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Achievements 🏆</CardTitle>
                <CardDescription>Milestones you've unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.totalQuizzes >= 1 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                      <div className="text-3xl">🌟</div>
                      <div>
                        <div className="text-sm">First Quiz</div>
                        <div className="text-xs text-gray-600">Completed your first quiz</div>
                      </div>
                    </div>
                  )}
                  {stats.highestScore >= 90 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="text-3xl">🎯</div>
                      <div>
                        <div className="text-sm">High Achiever</div>
                        <div className="text-xs text-gray-600">Scored above 90%</div>
                      </div>
                    </div>
                  )}
                  {stats.totalQuizzes >= 5 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <div className="text-3xl">🔥</div>
                      <div>
                        <div className="text-sm">Dedicated Learner</div>
                        <div className="text-xs text-gray-600">Completed 5+ quizzes</div>
                      </div>
                    </div>
                  )}
                  {stats.averageScore >= 80 && stats.totalQuizzes >= 3 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                      <div className="text-3xl">💎</div>
                      <div>
                        <div className="text-sm">Consistent Performer</div>
                        <div className="text-xs text-gray-600">80%+ average score</div>
                      </div>
                    </div>
                  )}
                  {stats.highestScore === 100 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300">
                      <div className="text-3xl">👑</div>
                      <div>
                        <div className="text-sm">Perfect Score</div>
                        <div className="text-xs text-gray-600">Got 100% on a quiz</div>
                      </div>
                    </div>
                  )}
                  {stats.totalQuizzes >= 10 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
                      <div className="text-3xl">🚀</div>
                      <div>
                        <div className="text-sm">Quiz Master</div>
                        <div className="text-xs text-gray-600">Completed 10+ quizzes</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}