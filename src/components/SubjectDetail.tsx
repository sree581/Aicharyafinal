import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Code, Database, Calculator, ArrowLeft, FileQuestion, TrendingUp, AlertTriangle, BookOpen, Atom, FlaskConical, Brain } from "lucide-react";
import { Progress } from "./ui/progress";
import { getCurrentUser } from "../lib/auth";
import { getQuizHistory } from "../lib/storage";

interface SubjectDetailProps {
  subjectId: string;
  onBack: () => void;
  onSelectOption: (option: "quiz" | "progress" | "weak-areas") => void;
}

const subjectInfo = {
  java: {
    name: "Java Programming",
    icon: Code,
    color: "from-orange-500 to-red-500",
    topics: ["OOP Concepts", "Collections", "Multithreading", "Exception Handling"],
  },
  datastructure: {
    name: "Data Structure",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    topics: ["Arrays & Linked Lists", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching"],
  },
  maths: {
    name: "Mathematics",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    topics: ["Algebra", "Calculus", "Statistics", "Probability"],
  },
  physics: {
    name: "Physics",
    icon: Atom,
    color: "from-purple-500 to-pink-500",
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
  },
  chemistry: {
    name: "Chemistry",
    icon: FlaskConical,
    color: "from-teal-500 to-cyan-500",
    topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
  },
  biology: {
    name: "Biology",
    icon: Brain,
    color: "from-green-500 to-lime-500",
    topics: ["Cell Biology", "Genetics", "Ecology", "Evolution"],
  },
};

export function SubjectDetail({ subjectId, onBack, onSelectOption }: SubjectDetailProps) {
  const subject = subjectInfo[subjectId as keyof typeof subjectInfo];
  const Icon = subject.icon;
  const user = getCurrentUser();

  // Get quiz history from localStorage for current user
  const quizHistory = user ? getQuizHistory(user.id, subjectId) : [];

  // Calculate overall progress
  const calculateProgress = () => {
    if (quizHistory.length === 0) return 0;
    const averageScore = quizHistory.reduce((sum: number, q: any) => sum + q.score, 0) / quizHistory.length;
    return Math.round(averageScore);
  };

  const overallProgress = calculateProgress();

  // Get recent activity
  const recentActivity = quizHistory.slice(-3).reverse();

  const options = [
    {
      id: "quiz" as const,
      title: "Take Quiz",
      description: "AI-powered personalized quiz questions",
      icon: FileQuestion,
      color: "from-blue-500 to-cyan-500",
      badge: "AI Powered",
    },
    {
      id: "progress" as const,
      title: "View Progress",
      description: "Track your learning journey and achievements",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "weak-areas" as const,
      title: "Weak Areas",
      description: "Identify topics that need more practice",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-r ${subject.color} p-2 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl">{subject.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subject Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Your progress in {subject.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {subject.topics.map((topic) => (
                  <div key={topic} className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
              {quizHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {quizHistory.length} quiz{quizHistory.length !== 1 ? 'zes' : ''} completed
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => {
            const OptionIcon = option.icon;
            return (
              <Card
                key={option.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectOption(option.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <OptionIcon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                  {'badge' in option && (
                    <div className="mt-2 inline-block">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full">
                        🤖 {option.badge}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90`}>
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm mb-2">No recent activity</div>
                <p className="text-xs">Take a quiz to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((quiz: any, index: number) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between py-2 ${
                      index < recentActivity.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm">Quiz {quizHistory.length - index}</div>
                      <div className="text-xs text-gray-500">{quiz.date}</div>
                    </div>
                    <div className="text-sm">
                      Score: <span className={
                        quiz.score >= 80 ? 'text-green-600' :
                        quiz.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }>{quiz.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}