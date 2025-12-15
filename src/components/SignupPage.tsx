import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { BookOpen, Loader2 } from "lucide-react";
import { signUp, ClassType } from "../lib/auth";
import { toast } from "sonner@2.0.3";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignupSuccess, onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classType, setClassType] = useState<ClassType | "">("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!classType) {
      toast.error("Please select your class!");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions!");
      return;
    }

    setLoading(true);

    try {
      const result = signUp(name, email, password, classType as ClassType, acceptedTerms);
      
      if (result.success) {
        toast.success(result.message);
        onSignupSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>New face Alert!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={classType} onValueChange={(value) => setClassType(value as ClassType)}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                  <SelectItem value="BTech">BTech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    alert("Terms and Conditions:\n\n1. You agree to use this platform for educational purposes only.\n2. Your data is stored locally in your browser.\n3. You are responsible for maintaining the confidentiality of your account.\n4. The platform is provided 'as is' without any warranties.");
                  }}
                >
                  terms and conditions
                </button>
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
