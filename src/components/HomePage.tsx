import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Code, Database, Calculator, User, HelpCircle, MessageSquare, LogOut, Atom, FlaskConical } from "lucide-react";
import { getCurrentUser } from "../lib/auth";

interface HomePageProps {
  onSelectSubject: (subject: string) => void;
  onNavigate: (page: 'profile' | 'help' | 'feedback') => void;
  onLogout: () => void;
}

const iconMap = {
  Code,
  Database,
  Calculator,
  Atom,
  FlaskConical,
};

export function HomePage({ onSelectSubject, onNavigate, onLogout }: HomePageProps) {
  const user = getCurrentUser();
  
  if (!user) return null;

  const subjects = user.classType === 'BTech' 
    ? [
        {
          id: "java",
          name: "Java Programming",
          description: "OOP, Collections, Threads & more",
          icon: "Code",
          color: "from-orange-500 to-red-500",
        },
        {
          id: "datastructure",
          name: "Data Structure",
          description: "Arrays, Trees, Graphs, Algorithms",
          icon: "Database",
          color: "from-green-500 to-emerald-500",
        },
        {
          id: "maths",
          name: "Mathematics",
          description: "Algebra, Calculus, Statistics",
          icon: "Calculator",
          color: "from-blue-500 to-cyan-500",
        },
      ]
    : [
        {
          id: "physics",
          name: "Physics",
          description: "Mechanics, Optics, Electricity",
          icon: "Atom",
          color: "from-purple-500 to-pink-500",
        },
        {
          id: "chemistry",
          name: "Chemistry",
          description: "Organic, Inorganic, Physical",
          icon: "FlaskConical",
          color: "from-green-500 to-emerald-500",
        },
        {
          id: "maths",
          name: "Mathematics",
          description: "Algebra, Calculus, Trigonometry",
          icon: "Calculator",
          color: "from-blue-500 to-cyan-500",
        },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl">Aicharya</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate">{user.name}</div>
              <div className="text-xs text-gray-500">Class {user.classType}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onNavigate('profile')}
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onNavigate('help')}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Need Help
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onNavigate('feedback')}
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Feedback
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-gray-600">Select a subject to continue learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const Icon = iconMap[subject.icon as keyof typeof iconMap];
              return (
                <Card
                  key={subject.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onSelectSubject(subject.id)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full bg-gradient-to-r ${subject.color} hover:opacity-90`}>
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
