export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index in options (0-3)
  explanation: string;
  subject?: string;
  topic?: string;
}

export interface MockTest {
  id: string;
  title: string;
  sourcePdfId?: string;
  sourcePdfName?: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  markingScheme: {
    correct: number;
    incorrect: number;
  };
  subject: string;
  createdAt: string;
  questions: Question[];
  hasAttempted: boolean;
  bestScore?: {
    score: number;
    maxScore: number;
    accuracy: number;
    timeTaken: number; // in seconds
    date: string;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
  };
}

export interface PDFFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: 'processing' | 'ready';
  pageCount: number;
  subject: string;
  topics?: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isGeneratingConfig?: boolean;
  generatedConfig?: {
    title: string;
    subject: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
  };
}
