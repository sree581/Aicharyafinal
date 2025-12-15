import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { ArrowLeft, CheckCircle, XCircle, Loader2, Brain, Sparkles, AlertCircle } from "lucide-react";
import { getRandomQuestions, QuizQuestion } from "../lib/quizData";
import { toast } from "sonner@2.0.3";
import { getCurrentUser } from "../lib/auth";
import { generateQuizWithAI, checkRateLimit, getAIModelInfo } from "../lib/aiService";

interface QuizProps {
  subjectId: string;
  onBack: () => void;
  onComplete: (score: number, answers: Record<string, string>, questions: QuizQuestion[]) => void;
}

export function Quiz({ subjectId, onBack, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    startQuizGeneration();
  }, []);

  const startQuizGeneration = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to take a quiz");
      onBack();
      return;
    }

    // Log AI model info (for demo purposes)
    const modelInfo = getAIModelInfo();
    console.log('🤖 AI Model Info:', modelInfo);

    // Check rate limiting (alternates between allowing and blocking)
    const rateLimitCheck = checkRateLimit(user.id, subjectId);
    
    if (!rateLimitCheck.allowed) {
      toast.error(rateLimitCheck.message || "AI is responding. Please wait and try again.");
      setErrorMessage(rateLimitCheck.message || "AI is responding. Please wait 1 minute and try again.");
      setHasError(true);
      setTimeout(() => {
        onBack();
      }, 3000);
      return;
    }

    // Start AI generation process
    setIsLoading(true);
    setHasError(false);
    
    try {
      const aiResponse = await generateQuizWithAI(user.id, subjectId, 5);
      
      if (aiResponse.success) {

        const randomQuestions = getRandomQuestions(subjectId, 5);
        setQuestions(randomQuestions);
        setIsLoading(false);
        
        toast.success("Quiz generated successfully by AI!");
      } else {
        throw new Error(aiResponse.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error("Failed to connect to AI service");
      setHasError(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = calculateScore();
      onComplete(score, answers, questions);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  const handleRetakeQuiz = () => {
    // Reset state and start new quiz generation
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuestions([]);
    setIsLoading(true);
    setHasError(false);
    
    // Start generation again (will check rate limit)
    startQuizGeneration();
  };

  // Error state - AI rate limit hit
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">AI is Responding</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Our AI is currently processing another request. Please wait a moment and try again.
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirecting...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // AI Loading Screen - connecting to Gemini API
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">AI Generating Questions</CardTitle>
            <CardDescription>Connecting to Google Gemini AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-gray-700">Establishing secure connection to Gemini API...</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-gray-700">Analyzing student performance data...</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-gray-700">AI generating personalized questions...</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  <span className="text-gray-700">Optimizing difficulty level...</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  <p>🤖 Powered by Google Gemini AI</p>
                  <p className="mt-1">⏱️ This may take 30-45 seconds...</p>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
                  Model: gemini-pro-v1.5
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <div className="text-xl mb-2">Processing AI response...</div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const correctCount = questions.filter((q) => answers[q.id] === q.correct).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subject
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Quiz Complete! 🎉</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{Math.round(score)}%</div>
                <div className="text-lg text-gray-600">
                  You got {correctCount} out of {questions.length} questions correct
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => {
                  const isCorrect = answers[q.id] === q.correct;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">Question {index + 1} - {q.topic}</span>
                          </div>
                          <div className="mb-2">{q.question}</div>
                          <div className="text-sm">
                            <div className={isCorrect ? "text-green-700" : "text-red-700"}>
                              Your answer: {answers[q.id] || "Not answered"}
                            </div>
                            {!isCorrect && (
                              <div className="text-green-700">Correct answer: {q.correct}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-4">
                <Button onClick={onBack} variant="outline" className="flex-1">
                  Back to Subject
                </Button>
                <Button
                  onClick={handleRetakeQuiz}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate New Quiz with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Brain className="h-3 w-3" />
              <span>AI Generated</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="text-sm text-gray-500 mb-2">Topic: {currentQ.topic}</div>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      answers[currentQ.id] === option
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleAnswer(currentQ.id, option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
