# EduLearn - Student Learning Platform

A comprehensive student learning platform with localStorage-based authentication, featuring Java Programming, Data Structure, and Mathematics courses with interactive quizzes, progress tracking, and weak area identification.

## Features

- ✅ **LocalStorage Authentication**
  - Email/Password registration and login
  - Forgot password functionality with reset codes
  - Secure user data storage in browser localStorage
  - No backend or database required
  
- 📚 **Three Subject Areas**
  - **Java Programming** - OOP, Collections, Multithreading, Exception Handling
  - **Data Structure** - Arrays, Stacks, Queues, Trees, Graphs, Sorting
  - **Mathematics** - Algebra, Calculus, Statistics, Probability

- 🎯 **Interactive Quizzes**
  - Randomized questions for each quiz attempt (5 questions from a pool of 12)
  - Multiple-choice questions
  - Instant feedback and scoring
  - Detailed answer review

- 📊 **Progress Tracking**
  - Quiz history and statistics
  - Average score tracking
  - Topic-wise performance
  - Achievement badges

- 🎓 **Weak Area Identification**
  - Identifies topics needing improvement
  - Personalized recommendations
  - Study tips and guidance

## How to Use

### Getting Started

1. **Sign Up**: Create a new account with:
   - Full name
   - Email address
   - Password (minimum 6 characters)

2. **Login**: Sign in with your email and password

3. **Forgot Password**: 
   - Click "Forgot password?" on the login page
   - Enter your email to receive a reset code
   - Copy the generated code
   - Enter the code and set a new password

### Learning Flow

1. **Select Subject**: Choose from Java Programming, Data Structure, or Mathematics
2. **Take Quiz**: Test your knowledge with randomized questions
3. **View Progress**: Track your performance and improvements over time
4. **Check Weak Areas**: Identify topics that need more practice

## Data Storage

All data is stored locally in your browser using localStorage:

- **User Accounts**: `edulearn_users` - All registered user accounts
- **Current Session**: `edulearn_current_user` - Currently logged-in user
- **Reset Tokens**: `edulearn_reset_tokens` - Password reset tokens
- **Quiz History**: `quizHistory_{subject}` - Quiz results for each subject
  - `quizHistory_java` - Java Programming quiz history
  - `quizHistory_datastructure` - Data Structure quiz history
  - `quizHistory_maths` - Mathematics quiz history

### What's Stored in Quiz History

Each quiz result contains:
- Date taken
- Score (percentage)
- Subject
- All questions asked
- User's answers
- Correct answers

This data is used to:
- Calculate progress and statistics
- Identify weak areas
- Track improvement over time
- Generate personalized recommendations

**Note**: Clearing browser data will delete all accounts and progress. This is a demo application - in production, you would use a backend database.

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- LocalStorage for data persistence
- Shadcn/ui components
- Lucide React icons
- Sonner for toast notifications

## Features in Detail

### Authentication System
- Complete signup/login system
- Password validation (minimum 6 characters)
- Email format validation
- Password reset with time-limited tokens (1 hour expiry)
- Duplicate email prevention

### Quiz System
- 12 questions per subject across 4 topics
- Randomized selection of 5 questions per quiz
- Different questions each time you take the test
- Immediate feedback on answers
- Score calculation and history tracking

### Progress Tracking
- Total quizzes completed
- Average score across all attempts
- Highest score achieved
- Improvement percentage
- Topic-wise performance breakdown

### Weak Area Analysis
- Automatic identification of weak topics based on quiz performance
- Ranked list of topics needing improvement
- Personalized study recommendations
- Priority-based action items

## Browser Compatibility

Works in all modern browsers that support:
- localStorage API
- ES6+ JavaScript
- CSS Grid and Flexbox

## Privacy & Security

- All data stored locally in your browser
- No data sent to external servers
- Passwords stored in plain text (demo only - would be hashed in production)
- No tracking or analytics

## Limitations

- Data is not synced across devices
- Clearing browser data deletes all progress
- No actual email sending for password reset
- Single-user environment per browser
