import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, TrendingUp, Youtube } from "lucide-react";
import { Progress } from "./ui/progress";
import { getCurrentUser } from "../lib/auth";
import { identifyWeakAreas } from "../lib/storage";

interface WeakAreasProps {
  subjectId: string;
  onBack: () => void;
}

const subjectNames = {
  java: "Java Programming",
  datastructure: "Data Structure",
  maths: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
};

// YouTube playlists for each topic
const topicPlaylists: Record<string, Array<{ title: string; url: string; channel: string }>> = {
  // Java Programming topics
  "OOP Concepts": [
    { title: "Java OOP Fundamentals", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT809B8Qb", channel: "Neso Academy" },
    { title: "Object Oriented Programming", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ahfFNWiJz7yFaziNaRWazEa", channel: "CodeWithHarry" },
  ],
  "Collections": [
    { title: "Java Collections Framework", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ahfFNWiJz7yFaziNaRWazEa", channel: "CodeWithHarry" },
    { title: "Collections in Java", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT809B8Qb", channel: "Telusko" },
  ],
  "Multithreading": [
    { title: "Java Multithreading", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT809B8Qb", channel: "Telusko" },
    { title: "Concurrency in Java", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ahfFNWiJz7yFaziNaRWazEa", channel: "Java Brains" },
  ],
  "Exception Handling": [
    { title: "Exception Handling Tutorial", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT809B8Qb", channel: "Programming with Mosh" },
    { title: "Java Exception Handling", url: "https://www.youtube.com/playlist?list=PLu0W_9lII9ahfFNWiJz7yFaziNaRWazEa", channel: "Telusko" },
  ],
  
  // Data Structure topics
  "Arrays & Linked Lists": [
    { title: "Arrays and Linked Lists", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "Abdul Bari" },
    { title: "Data Structures - Arrays", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y", channel: "Neso Academy" },
  ],
  "Stacks & Queues": [
    { title: "Stacks and Queues", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "Abdul Bari" },
    { title: "Stack and Queue Tutorial", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y", channel: "mycodeschool" },
  ],
  "Trees & Graphs": [
    { title: "Tree Data Structure", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "Abdul Bari" },
    { title: "Graph Data Structure", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "Abdul Bari" },
  ],
  "Sorting & Searching": [
    { title: "Sorting Algorithms", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "Abdul Bari" },
    { title: "Searching Algorithms", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9lld8sWIUNwlKfdUoPd1Y", channel: "mycodeschool" },
  ],
  
  // Mathematics topics (common)
  "Algebra": [
    { title: "Algebra Basics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Complete Algebra Course", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
  ],
  "Calculus": [
    { title: "Calculus 1", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Professor Leonard" },
    { title: "Calculus Essentials", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
  ],
  "Statistics": [
    { title: "Statistics Fundamentals", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Statistics Course", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "StatQuest" },
  ],
  "Probability": [
    { title: "Probability Theory", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Probability Basics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
  ],
  "Trigonometry": [
    { title: "Trigonometry Complete Course", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Trigonometry Basics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
  ],
  
  // Physics topics
  "Mechanics": [
    { title: "Classical Mechanics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Physics Mechanics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
  ],
  "Optics": [
    { title: "Optics and Wave Physics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Light and Optics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Physics Wallah" },
  ],
  "Electricity": [
    { title: "Electricity and Magnetism", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Current Electricity", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Physics Wallah" },
  ],
  
  // Chemistry topics
  "Organic": [
    { title: "Organic Chemistry Basics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
    { title: "Complete Organic Chemistry", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Crash Course" },
  ],
  "Inorganic": [
    { title: "Inorganic Chemistry", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Inorganic Chemistry Course", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Chemistry Wallah" },
  ],
  "Physical": [
    { title: "Physical Chemistry", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "Khan Academy" },
    { title: "Physical Chemistry Basics", url: "https://www.youtube.com/playlist?list=PLU5fj1IZsUa8sRdZqL4xXYCmYn8dqZ5aL", channel: "The Organic Chemistry Tutor" },
  ],
};

export function WeakAreas({ subjectId, onBack }: WeakAreasProps) {
  const subjectName = subjectNames[subjectId as keyof typeof subjectNames];
  const user = getCurrentUser();

  const weakAreas = user ? identifyWeakAreas(user.id, subjectId) : [];
  const quizHistory = user ? JSON.parse(localStorage.getItem(`quizHistory_${user.id}_${subjectId}`) || "[]") : [];

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
          <h1 className="text-3xl mb-2">Areas for Improvement</h1>
          <p className="text-gray-600">Identify and strengthen your weak topics in {subjectName}</p>
        </div>

        {quizHistory.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <div className="text-gray-500 mb-4">No quiz data available</div>
              <p className="text-sm text-gray-600">
                Take some quizzes to identify areas that need improvement!
              </p>
            </CardContent>
          </Card>
        ) : weakAreas.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <div className="text-gray-500 mb-4">No data to analyze yet</div>
              <p className="text-sm text-gray-600">
                Complete more quizzes to see detailed weak area analysis!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Alert */}
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <div className="mb-1">Focus Areas Identified</div>
                    <p className="text-sm text-gray-700">
                      Based on your {quizHistory.length} quiz{quizHistory.length !== 1 ? 'zes' : ''}, we've identified{" "}
                      {weakAreas.length} topic{weakAreas.length !== 1 ? 's' : ''} for improvement. Check out the recommended YouTube playlists below to strengthen these areas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Weak Topics */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Topics Needing Attention</CardTitle>
                    <CardDescription>Ranked by accuracy from lowest to highest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {weakAreas.map((area, index) => (
                        <div key={area.topic} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                  area.accuracy < 60
                                    ? "bg-red-100 text-red-700"
                                    : area.accuracy < 75
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <div>{area.topic}</div>
                                <div className="text-xs text-gray-500">
                                  {area.correct}/{area.total} questions correct
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={area.accuracy} className="h-2 flex-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="text-sm">
                          <div className="mb-1">Tip for Improvement</div>
                          <p className="text-gray-700">
                            Consistent practice on these topics can help boost your overall score.
                            Watch the recommended YouTube playlists and retake quizzes to reinforce learning.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Playlists */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      Recommended Playlists
                    </CardTitle>
                    <CardDescription>YouTube resources for weak topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weakAreas.slice(0, 3).map((area) => {
                        const playlists = topicPlaylists[area.topic] || [];
                        return (
                          <div key={area.topic} className="space-y-2">
                            <div className="text-sm pb-2 border-b">
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                {area.accuracy}%
                              </span>{" "}
                              {area.topic}
                            </div>
                            {playlists.length > 0 ? (
                              playlists.map((playlist, idx) => (
                                <a
                                  key={idx}
                                  href={playlist.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors group"
                                >
                                  <div className="flex items-start gap-2">
                                    <Youtube className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm flex items-center gap-1">
                                        <span className="truncate">{playlist.title}</span>
                                      </div>
                                      <div className="text-xs text-gray-600">{playlist.channel}</div>
                                    </div>
                                  </div>
                                </a>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500 p-2">
                                No playlists available for this topic
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Study Tips */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Study Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <span>📚</span>
                        <span>Watch playlists at 1.5x speed for faster learning</span>
                      </div>
                      <div className="flex gap-2">
                        <span>✍️</span>
                        <span>Take notes while watching videos</span>
                      </div>
                      <div className="flex gap-2">
                        <span>🔄</span>
                        <span>Practice problems after each video</span>
                      </div>
                      <div className="flex gap-2">
                        <span>🎯</span>
                        <span>Retake quizzes to measure improvement</span>
                      </div>
                      <div className="flex gap-2">
                        <span>⏰</span>
                        <span>Study 20-30 minutes daily</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}