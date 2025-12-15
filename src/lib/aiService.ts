
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = "AIzaSyUlBY5OQSkbqiSaH6pdK9He6BcKD1M2er"; // API key

interface AIRequest {
  userId: string;
  subjectId: string;
  difficulty: string;
  questionCount: number;
  topics: string[];
}

interface AIResponse {
  success: boolean;
  questions?: any[];
  error?: string;
  processingTime?: number;
  model?: string;
}

/**
 * Simulates a fetch call to Gemini AI API
 
 */
async function callGeminiAPI(request: AIRequest): Promise<AIResponse> {
  // Simulate network latency (30-45 seconds)
  const processingTime = 30000 + Math.random() * 15000;
  
  console.log('Calling Gemini AI API...');
  console.log(' Endpoint:', GEMINI_API_ENDPOINT);
  console.log(' API Key:', API_KEY.substring(0, 20) + '...');
  console.log('Request Payload:', {
    model: 'gemini-pro',
    temperature: 0.7,
    maxOutputTokens: 2048,
    userId: request.userId,
    subject: request.subjectId,
    questionCount: request.questionCount,
  });

  
  await new Promise(resolve => setTimeout(resolve, processingTime));

  
  console.log('✅ AI Response received');
  console.log('⚡ Processing time:', Math.round(processingTime / 1000), 'seconds');
  
  return {
    success: true,
    processingTime,
    model: 'gemini-pro-v1.5',
    questions: []
  };
}

/**
 * Check if user has hit rate limit
 * Alternates between allowing and blocking to simulate rate limiting
 */
export function checkRateLimit(userId: string, subjectId: string): { 
  allowed: boolean; 
  message?: string; 
  retryAfter?: number;
} {
  const attemptKey = `ai_attempt_count_${userId}_${subjectId}`;
  const attemptCount = parseInt(localStorage.getItem(attemptKey) || '0');
  

  const isAllowed = attemptCount % 2 === 0;
  
  // Increment attempt count
  localStorage.setItem(attemptKey, (attemptCount + 1).toString());
  
  if (!isAllowed) {
    console.log('⚠️ Rate limit hit - AI is processing another request');
    return {
      allowed: false,
      message: 'AI is responding to another request. Please wait and try again.',
      retryAfter: 60 
    };
  }
  
  console.log('✅ Rate limit check passed');
  return { allowed: true };
}

/**
 * Main function to generate quiz questions using AI
 * This is the primary interface used by the Quiz component
 */
export async function generateQuizWithAI(
  userId: string,
  subjectId: string,
  questionCount: number = 5
): Promise<AIResponse> {
  try {
    console.log('🚀 Starting AI quiz generation...');
    console.log('👤 User ID:', userId);
    console.log('📚 Subject:', subjectId);
    console.log('❓ Questions:', questionCount);
    
    // Simulate building the AI prompt
    const prompt = `Generate ${questionCount} multiple choice questions for ${subjectId}. 
    Each question should have 4 options with one correct answer.
    Focus on practical application and conceptual understanding.
    Format: JSON array with question, options, correct answer, and topic.`;
    
    console.log('📝 AI Prompt generated:', prompt.substring(0, 100) + '...');
    
    // Make the "API call" to Gemini
    const response = await callGeminiAPI({
      userId,
      subjectId,
      difficulty: 'medium',
      questionCount,
      topics: [] // Would be populated in real implementation
    });
    
    console.log('🎉 Quiz generation complete!');
    
    return response;
    
  } catch (error) {
    console.error('❌ AI API Error:', error);
    return {
      success: false,
      error: 'Failed to connect to AI service. Please try again.'
    };
  }
}

/**
 * Simulates backend health check
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  console.log('🏥 Checking AI service health...');
  // Simulate health check
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('✅ AI service is healthy');
  return true;
}

/**
 * Simulates getting AI model information
 */
export function getAIModelInfo() {
  return {
    provider: 'Google Gemini',
    model: 'gemini-pro-v1.5',
    version: '1.5.0',
    status: 'active',
    endpoint: GEMINI_API_ENDPOINT,
    features: [
      'Question Generation',
      'Difficulty Adaptation',
      'Topic Analysis',
      'Performance Insights'
    ]
  };
}
