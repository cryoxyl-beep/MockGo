/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import ChatBuilderView from './components/ChatBuilderView';
import ConfigPanel from './components/ConfigPanel';
import ExamView from './components/ExamView';
import ResultsView from './components/ResultsView';

import { MockTest, PDFFile, Message } from './types';
import { INITIAL_MOCKS, INITIAL_PDFS, INITIAL_CHAT_MESSAGES } from './mockData';
import { generateQuestionsForSubject } from './utils/questionGenerator';
import { useAuth } from './context/AuthContext';
import { useDrive } from './context/DriveContext';

export default function App() {
  const { profile, loading, logout } = useAuth();
  const { googleDriveConnected, drivePdfs, disconnectDrive } = useDrive();

  // Screen routing or tabs
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Storage arrays (using local storage to persist user-generated tests/PDFs across reload)
  const [mocks, setMocks] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem('instamocks_mocks');
    return saved ? JSON.parse(saved) : INITIAL_MOCKS;
  });

  const [pdfs, setPdfs] = useState<PDFFile[]>(() => {
    const saved = localStorage.getItem('instamocks_pdfs');
    return saved ? JSON.parse(saved) : INITIAL_PDFS;
  });

  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('instamocks_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Active actions state
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [calibrationOpen, setCalibrationOpen] = useState<boolean>(false);
  const [calibrationPdfId, setCalibrationPdfId] = useState<string | null>(null);
  
  // Exam-taking states
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [activeResultsId, setActiveResultsId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('instamocks_mocks', JSON.stringify(mocks));
  }, [mocks]);

  useEffect(() => {
    localStorage.setItem('instamocks_pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  useEffect(() => {
    localStorage.setItem('instamocks_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const handleLogout = async () => {
    await logout();
    disconnectDrive();
    setCurrentExamId(null);
    setActiveResultsId(null);
    setActiveTab('dashboard');
  };

  const handleAddPdf = (newPdf: Omit<PDFFile, 'id' | 'uploadDate'>) => {
    const freshPdf: PDFFile = {
      ...newPdf,
      id: `pdf-dyn-${Math.random().toString(36).substr(2, 5)}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setPdfs(prev => [freshPdf, ...prev]);
  };

  const handleRemovePdf = (id: string) => {
    setPdfs(prev => prev.filter(p => p.id !== id));
  };

  const handleOpenCalibration = (pdfId?: string) => {
    if (pdfId) {
      setCalibrationPdfId(pdfId);
    } else {
      setCalibrationPdfId(null);
    }
    setCalibrationOpen(true);
  };

  // Calibration hub generator trigger
  const handleGenerateMock = (config: {
    title: string;
    sourcePdfId?: string;
    sourcePdfName?: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
    markingScheme: { correct: number; incorrect: number };
    subject: string;
  }) => {
    setCalibrationOpen(false);

    // Dynamic question bank mapping
    const questions = generateQuestionsForSubject(
      config.subject,
      config.questionCount,
      config.difficulty
    );

    // Form final Mock object
    const finalMock: MockTest = {
      ...config,
      id: `mock-dyn-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0],
      hasAttempted: false,
      questions
    };

    setMocks(prev => [finalMock, ...prev]);
    // Directly enter live examination attempt!
    setCurrentExamId(finalMock.id);
  };

  // Chat NLP Compiler triggers
  const handleSendChatMessage = (text: string) => {
    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    // Simulate smart AI response in 1.4 seconds
    setTimeout(() => {
      const lower = text.toLowerCase();
      let detectedSubject = 'General Aptitude';
      let detectedDiff: 'easy' | 'medium' | 'hard' = 'medium';
      let detectedCount = 5;
      let titlePreset = 'Custom Syllabus Evaluation';

      if (lower.includes('physics') || lower.includes('jee')) {
        detectedSubject = 'Physics';
        titlePreset = 'JEE Targeted Physics Review';
      } else if (lower.includes('chemistry') || lower.includes('cuet')) {
        detectedSubject = 'Chemistry';
        titlePreset = 'CUET Organic Chemistry Unit';
      } else if (lower.includes('bio') || lower.includes('biology')) {
        detectedSubject = 'Biology';
        titlePreset = 'Genetics & Botanics Practice';
      }

      if (lower.includes('hard') || lower.includes('difficult')) {
        detectedDiff = 'hard';
      } else if (lower.includes('easy') || lower.includes('simple')) {
        detectedDiff = 'easy';
      }

      // Check numbers
      const numMatch = lower.match(/\b(\d+)\b/);
      if (numMatch) {
        detectedCount = Math.min(Math.max(Number(numMatch[1]), 3), 15);
      }

      const aiMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: `Understood. Analyzing parameters for a **${detectedDiff}** difficulty set on **${detectedSubject}** consisting of **${detectedCount} questions**. \n\nI have structured a comprehensive testing schema to match competitive patterns, including complete answer explanation indices. Please evaluate the configuration blueprint below to generate:`,
        timestamp: new Date().toISOString(),
        isGeneratingConfig: true,
        generatedConfig: {
          title: titlePreset,
          subject: detectedSubject,
          questionCount: detectedCount,
          difficulty: detectedDiff,
          timeLimit: detectedCount * 2 // 2 minutes per question
        }
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1400);
  };

  const handleLaunchChatConfig = (config: {
    title: string;
    subject: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
  }) => {
    // Generate mock test immediately under custom subject profile
    handleGenerateMock({
      title: config.title,
      questionCount: config.questionCount,
      difficulty: config.difficulty,
      timeLimit: config.timeLimit,
      markingScheme: { correct: 4, incorrect: -1 },
      subject: config.subject
    });
  };

  // Exam completion grading trigger hook
  const handleSubmitMockTest = (answers: Record<string, number>, timeTakenSeconds: number) => {
    if (!currentExamId) return;

    setMocks(prevMocks => 
      prevMocks.map(m => {
        if (m.id === currentExamId) {
          // Grade active answers
          let score = 0;
          let correctCount = 0;
          m.questions.forEach(q => {
            const userAns = answers[q.id];
            if (userAns !== undefined) {
              if (userAns === q.correctAnswer) {
                correctCount++;
                score += m.markingScheme.correct;
              } else {
                score += m.markingScheme.incorrect;
              }
            }
          });

          const maxScore = m.questions.length * m.markingScheme.correct;
          const accuracy = m.questions.length > 0 
            ? Math.round((correctCount / m.questions.length) * 100) 
            : 0;

          return {
            ...m,
            hasAttempted: true,
            bestScore: {
              score,
              maxScore,
              accuracy,
              timeTaken: timeTakenSeconds,
              date: new Date().toISOString().split('T')[0],
              answers
            }
          };
        }
        return m;
      })
    );

    const savedExamId = currentExamId;
    setCurrentExamId(null);
    setActiveResultsId(savedExamId);
  };

  // Handle Loading Session Overlay
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex flex-col items-center justify-center font-sans">
        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-[10px] text-[#555] uppercase tracking-widest font-bold">Initializing Secure Session...</p>
      </div>
    );
  }

  // Protected Route: Unauthenticated views mapping
  if (!profile) {
    if (activeTab === 'auth') {
      return (
        <AuthView 
          onBack={() => setActiveTab('landing')} 
        />
      );
    }
    return (
      <LandingView 
        onGetStarted={() => setActiveTab('auth')} 
      />
    );
  }

  // Render Live Exam viewport
  if (currentExamId) {
    const activeExamObj = mocks.find(m => m.id === currentExamId);
    if (activeExamObj) {
      return (
        <ExamView
          mockTest={activeExamObj}
          onSubmitMock={handleSubmitMockTest}
          onExitMock={() => setCurrentExamId(null)}
        />
      );
    }
  }

  // Active workspace panels
  return (
    <div className="flex h-screen bg-[#090909] text-zinc-100 font-sans overflow-hidden">
      
      {/* 1. Sidemenu Navigation (now bound to Firestore state hook) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveResultsId(null); // Clear active results if switching menus
          setActiveTab(tab);
        }}
        mockTestsCount={mocks.length}
        pdfFilesCount={pdfs.length}
        onLogout={handleLogout}
      />

      {/* 2. Main content panels containing calibration panel overlays */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {activeResultsId ? (
          <ResultsView
            mockTest={mocks.find(m => m.id === activeResultsId)!}
            onRetest={() => {
              // Direct relaunch configuration
              const activeMock = mocks.find(m => m.id === activeResultsId)!;
              setCurrentExamId(activeMock.id);
              setActiveResultsId(null);
            }}
            onBackToDashboard={() => {
              setActiveResultsId(null);
              setActiveTab('dashboard');
            }}
          />
        ) : activeTab === 'dashboard' ? (
          <DashboardView
            mocks={mocks}
            pdfs={googleDriveConnected ? drivePdfs : pdfs}
            onStartMock={(id) => setCurrentExamId(id)}
            onViewResults={(id) => setActiveResultsId(id)}
            onOpenConfig={handleOpenCalibration}
            setActiveTab={setActiveTab}
          />
        ) : activeTab === 'upload' ? (
          <UploadView
            pdfs={googleDriveConnected ? drivePdfs : pdfs}
            onAddPdf={handleAddPdf}
            onRemovePdf={handleRemovePdf}
            onOpenConfig={handleOpenCalibration}
          />
        ) : activeTab === 'ai-builder' ? (
          <ChatBuilderView
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
            onLaunchSimulatedTest={handleLaunchChatConfig}
            isAiTyping={isAiTyping}
          />
        ) : null}

        {/* 3. Floating configuration sheet calibration overlay modal */}
        {calibrationOpen && (
          <ConfigPanel
            pdfs={googleDriveConnected ? drivePdfs : pdfs.filter(p => p.status === 'ready')}
            preselectedPdfId={calibrationPdfId}
            onClose={() => setCalibrationOpen(false)}
            onGenerate={handleGenerateMock}
          />
        )}

      </div>
    </div>
  );
}
