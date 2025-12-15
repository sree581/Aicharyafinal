import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { getCurrentUser } from "../lib/auth";

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  timestamp: string;
}

const FEEDBACK_KEY = "Aicharya_feedback";

function saveFeedback(feedback: Feedback): void {
  const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
  allFeedback.push(feedback);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
}

function getUserFeedback(userId: string): Feedback[] {
  const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
  return allFeedback.filter((f: Feedback) => f.userId === userId);
}

export function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setFeedbackHistory(getUserFeedback(user.id));
    }
  }, [user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }

    setSubmitting(true);

    try {
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        message: feedback.trim(),
        timestamp: new Date().toISOString(),
      };

      saveFeedback(newFeedback);
      setFeedbackHistory([...feedbackHistory, newFeedback]);
      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Send Feedback</h1>
        <p className="text-gray-600">We'd love to hear your thoughts</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts, suggestions, or report issues..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{feedback.length}/1000 characters</span>
              <Button
                type="submit"
                disabled={submitting || !feedback.trim()}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {feedbackHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackHistory.slice().reverse().map((item) => (
                <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-700 mb-2">{item.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}