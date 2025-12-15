import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { HomePage } from "./components/HomePage";
import { SubjectDetail } from "./components/SubjectDetail";
import { Quiz } from "./components/Quiz";
import { Progress } from "./components/Progress";
import { WeakAreas } from "./components/WeakAreas";
import { ProfilePage } from "./components/ProfilePage";
import { NeedHelpPage } from "./components/NeedHelpPage";
import { FeedbackPage } from "./components/FeedbackPage";
import { Toaster } from "./components/ui/sonner";
import { getCurrentUser, logout } from "./lib/auth";
import { saveQuizResult } from "./lib/storage";
import { BookOpen, User, HelpCircle, MessageSquare, LogOut, Home } from "lucide-react";
import { Button } from "./components/ui/button";

type Page = "login" | "signup" | "home" | "profile" | "help" | "feedback" | "subject" | "quiz" | "progress" | "weak-areas";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [user, setUser] = useState<{ name: string; email: string; classType: string } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isBackendRunning, setIsBackendRunning] = useState<boolean | null>(null); // null means checking

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Attempt to fetch from the backend. A simple GET to the root or a health check endpoint.
        // Using 'no-cors' mode to avoid CORS issues if backend doesn't have CORS configured,
        // and we'll rely on the presence of a response (even if it's an opaque one) or a catch.
        // A more robust check might involve a specific health endpoint if available.
        const response = await fetch('http://localhost:8080/', { mode: 'no-cors' });
        // If fetch succeeds without throwing an error, we assume the backend is running.
        // 'no-cors' mode means response.ok will always be false, so we rely on the try block.
        setIsBackendRunning(true);
      } catch (error) {
        console.error("Backend check failed:", error);
        setIsBackendRunning(false);
      } finally {
        setLoading(false); // Set loading to false once the check is done
      }
    };

    checkBackend();

    // Check if user is logged in on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.name, email: currentUser.email, classType: currentUser.classType });
      setCurrentPage("home");
    }
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.name, email: currentUser.email, classType: currentUser.classType });
      setCurrentPage("home");
    }
  };

  const handleSignupSuccess = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.name, email: currentUser.email, classType: currentUser.classType });
      setCurrentPage("home");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentPage("login");
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setCurrentPage("subject");
  };

  const handleSubjectOption = (option: "quiz" | "progress" | "weak-areas") => {
    setCurrentPage(option);
  };

  const handleNavigate = (page: 'profile' | 'help' | 'feedback') => {
    setCurrentPage(page);
  };

  const handleQuizComplete = (score: number, answers: Record<string, string>, questions: QuizQuestion[]) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const quizResult = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: Math.round(score),
      subject: selectedSubject,
      answers,
      questions,
    };

    saveQuizResult(currentUser.id, selectedSubject, quizResult);
  };

  const handleBackToSubject = () => {
    setCurrentPage("subject");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-xl mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (isBackendRunning === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">ERR_CONNECTION_REFUSED</h1>
          <p className="text-lg">0x00000000: Failed to establish connection to server.</p>
          <p className="text-sm">Status: 503 Service Unavailable</p>
        </div>
      </div>
    );
  }

  if (currentPage === "login") {
    return (
      <>
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setCurrentPage("signup")} 
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "signup") {
    return (
      <>
        <SignupPage 
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setCurrentPage("login")} 
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "home" && user) {
    return (
      <>
        <HomePage
          onSelectSubject={handleSelectSubject}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "profile" && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        <ProfilePageWrapper onBack={handleBackToHome} onLogout={handleLogout} onNavigate={handleNavigate} />
        <Toaster />
      </div>
    );
  }

  if (currentPage === "help" && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        <NeedHelpPageWrapper onBack={handleBackToHome} onLogout={handleLogout} onNavigate={handleNavigate} />
        <Toaster />
      </div>
    );
  }

  if (currentPage === "feedback" && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        <FeedbackPageWrapper onBack={handleBackToHome} onLogout={handleLogout} onNavigate={handleNavigate} />
        <Toaster />
      </div>
    );
  }

  if (currentPage === "subject" && selectedSubject) {
    return (
      <>
        <SubjectDetail
          subjectId={selectedSubject}
          onBack={handleBackToHome}
          onSelectOption={handleSubjectOption}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "quiz" && selectedSubject) {
    return (
      <>
        <Quiz
          subjectId={selectedSubject}
          onBack={handleBackToSubject}
          onComplete={handleQuizComplete}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "progress" && selectedSubject) {
    return (
      <>
        <Progress
          subjectId={selectedSubject}
          onBack={handleBackToSubject}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "weak-areas" && selectedSubject) {
    return (
      <>
        <WeakAreas
          subjectId={selectedSubject}
          onBack={handleBackToSubject}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="text-xl">Please log in to continue</div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

// Wrapper components with sidebar
function ProfilePageWrapper({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (page: 'profile' | 'help' | 'feedback') => void }) {
  return (
    <>
      <Sidebar onNavigate={onNavigate} onLogout={onLogout} onBack={onBack} currentPage="profile" />
      <main className="flex-1 overflow-auto">
        <ProfilePage />
      </main>
    </>
  );
}

function NeedHelpPageWrapper({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (page: 'profile' | 'help' | 'feedback') => void }) {
  return (
    <>
      <Sidebar onNavigate={onNavigate} onLogout={onLogout} onBack={onBack} currentPage="help" />
      <main className="flex-1 overflow-auto">
        <NeedHelpPage />
      </main>
    </>
  );
}

function FeedbackPageWrapper({ onBack, onLogout, onNavigate }: { onBack: () => void; onLogout: () => void; onNavigate: (page: 'profile' | 'help' | 'feedback') => void }) {
  return (
    <>
      <Sidebar onNavigate={onNavigate} onLogout={onLogout} onBack={onBack} currentPage="feedback" />
      <main className="flex-1 overflow-auto">
        <FeedbackPage />
      </main>
    </>
  );
}

// Shared Sidebar Component
function Sidebar({ onNavigate, onLogout, onBack, currentPage }: { onNavigate: (page: 'profile' | 'help' | 'feedback') => void; onLogout: () => void; onBack: () => void; currentPage: string }) {
  const user = getCurrentUser();

  if (!user) return null;

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl">EduLearn</span>
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
            onClick={onBack}
          >
            <Home className="h-4 w-4 mr-3" />
            Home
          </Button>
          <Button
            variant={currentPage === 'profile' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onNavigate('profile')}
          >
            <User className="h-4 w-4 mr-3" />
            Profile
          </Button>
          <Button
            variant={currentPage === 'help' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onNavigate('help')}
          >
            <HelpCircle className="h-4 w-4 mr-3" />
            Need Help
          </Button>
          <Button
            variant={currentPage === 'feedback' ? 'secondary' : 'ghost'}
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
  );
}
