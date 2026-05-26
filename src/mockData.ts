import { MockTest, PDFFile, Message } from './types';

export const INITIAL_PDFS: PDFFile[] = [];

export const INITIAL_MOCKS: MockTest[] = [];

export const INITIAL_CHAT_MESSAGES: Message[] = [
  {
    id: 'msg-greeting-1',
    sender: 'assistant',
    text: 'Hello! I am your InstaMocks AI Assistant. Once you connect your academic materials, I can help you compile them into targeted custom mock tests with detailed grading rubrics. Connect Google Drive or upload your PYQ PDFs to get started.',
    timestamp: new Date().toISOString()
  }
];
