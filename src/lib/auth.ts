// LocalStorage-based authentication system

export type ClassType = '10' | '11' | '12' | 'BTech';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  classType: ClassType;
  createdAt: string;
}

const USERS_KEY = "_users";
const CURRENT_USER_KEY = "_current_user";

// Get all users from localStorage
export function getAllUsers(): User[] {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged-in user
export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  
  const userData = JSON.parse(userJson);
  // Don't return password in current user
  const { password, ...userWithoutPassword } = userData;
  return userWithoutPassword as any;
}

// Set current logged-in user
function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user (logout)
export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Get subjects based on class
export function getSubjectsForClass(classType: ClassType): { id: string; name: string; icon: string }[] {
  if (classType === 'BTech') {
    return [
      { id: 'java', name: 'Java Programming', icon: 'Code' },
      { id: 'datastructure', name: 'Data Structure', icon: 'Database' },
      { id: 'maths', name: 'Mathematics', icon: 'Calculator' },
    ];
  }
  // For classes 10, 11, 12
  return [
    { id: 'physics', name: 'Physics', icon: 'Atom' },
    { id: 'chemistry', name: 'Chemistry', icon: 'FlaskConical' },
    { id: 'maths', name: 'Mathematics', icon: 'Calculator' },
  ];
}

// Sign up a new user
export function signUp(
  name: string, 
  email: string, 
  password: string, 
  classType: ClassType,
  acceptedTerms: boolean
): { success: boolean; message: string; user?: User } {
  // Validate inputs
  if (!name || !email || !password || !classType) {
    return { success: false, message: "All fields are required." };
  }

  if (!acceptedTerms) {
    return { success: false, message: "You must accept the terms and conditions." };
  }

  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long." };
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Invalid email address." };
  }

  // Check if user already exists
  const users = getAllUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return { success: false, message: "This email is already registered. Please login instead." };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password, // In a real app, this should be hashed
    classType,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, message: "Account created successfully!", user: newUser };
}

// Login user
export function login(email: string, password: string): { success: boolean; message: string; user?: User } {
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, message: "No account found with this email." };
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password. Please try again." };
  }

  setCurrentUser(user);
  return { success: true, message: "Successfully logged in!", user };
}

// Logout user
export function logout(): void {
  clearCurrentUser();
}

// Reset password directly with email
export function resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
  if (!email || !newPassword) {
    return { success: false, message: "All fields are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long." };
  }

  // Update user password
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return { success: false, message: "No account found with this email." };
  }

  users[userIndex].password = newPassword;
  saveUsers(users);

  return { success: true, message: "Password reset successfully! You can now login with your new password." };
}

// Update user profile
export function updateUserProfile(updates: Partial<User>): { success: boolean; message: string } {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "No user logged in." };
  }

  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex === -1) {
    return { success: false, message: "User not found." };
  }

  // Update user data
  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);
  
  // Update current user session
  setCurrentUser(users[userIndex]);

  return { success: true, message: "Profile updated successfully!" };
}
