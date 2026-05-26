import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  HelpCircle, 
  Minimize2, 
  Maximize2, 
  Play, 
  Pause, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  BookOpen
} from 'lucide-react';
import { MockTest, Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ExamViewProps {
  mockTest: MockTest;
  onSubmitMock: (answers: Record<string, number>, timeTakenSeconds: number) => void;
  onExitMock: () => void;
}

export default function ExamView({
  mockTest,
  onSubmitMock,
  onExitMock
}: ExamViewProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Timer state (seconds remaining)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(mockTest.timeLimit * 60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  const activeQuestion = mockTest.questions[currentIndex];

  useEffect(() => {
    let timerId: any = null;
    if (isTimerActive && secondsRemaining > 0) {
      timerId = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      // Auto-submit when time completes
      handleSubmitConfirmed();
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTimerActive, secondsRemaining]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleClearOption = (questionId: string) => {
    const updated = { ...selectedAnswers };
    delete updated[questionId];
    setSelectedAnswers(updated);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleNext = () => {
    if (currentIndex < mockTest.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleExitRequest = () => {
    setShowExitModal(true);
  };

  const handlePromptSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleSubmitConfirmed = () => {
    const timeTaken = mockTest.timeLimit * 60 - secondsRemaining;
    onSubmitMock(selectedAnswers, timeTaken);
  };

  const totalQuestions = mockTest.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeLow = secondsRemaining < 60; // Less than 1 minute gets highlighted red

  return (
    <div className="fixed inset-0 bg-[#090909] text-[#EDEDED] flex flex-col z-40 select-none overflow-hidden font-sans">
      
      {/* 1. TOP HEADER NAVIGATION EXAM CONTROLS */}
      <header className="p-4 border-b border-[#1F1F1F] bg-[#0C0C0C] flex items-center justify-between shrink-0 px-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#888]" />
          <div className="hidden sm:block leading-tight">
            <h3 className="font-sans font-bold text-sm text-[#EDEDED]">{mockTest.title}</h3>
            <p className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">{mockTest.subject} Academic Sandbox Exam</p>
          </div>
        </div>

        {/* Dynamic ticking timer */}
        <div className="flex items-center gap-4 bg-[#121212] p-1.5 px-4 rounded border border-[#1F1F1F] shadow-inner">
          <div className={`flex items-center gap-2 ${isTimeLow ? 'text-red-400 animate-pulse font-bold' : 'text-[#EDEDED]'}`}>
            <Clock className={`w-3.5 h-3.5 ${isTimeLow ? 'text-red-400' : 'text-[#888]'}`} />
            <span className="font-mono text-sm tracking-wider font-semibold">{formatTime(secondsRemaining)}</span>
          </div>

          <div className="h-4 w-[1px] bg-[#1F1F1F]" />

          {/* Pause simulation triggers */}
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="p-1 text-[#888] hover:text-[#EDEDED] transition-colors"
            title={isTimerActive ? 'Pause clock' : 'Resume clock'}
          >
            {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Global Exit & Submit Triggers */}
        <div className="flex items-center gap-3">
          <button
            id="exam-focus-toggle-btn"
            onClick={() => setFocusMode(!focusMode)}
            className="p-2.5 bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#333] rounded text-[#888] hover:text-white transition-colors"
            title={focusMode ? 'Normal Layout' : 'Focus Max Mode'}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="exam-exit-btn"
            onClick={handleExitRequest}
            className="px-3 py-2 bg-transparent text-[#555] hover:text-[#888] font-sans text-xs font-bold uppercase tracking-wider"
          >
            Abandon Exam
          </button>

          <button
            id="exam-submit-trigger-btn"
            onClick={handlePromptSubmit}
            className="px-4 py-2 bg-white hover:opacity-95 text-black rounded font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            Submit Academic Sheet
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT LAYOUT */}
      <div className="flex-1 flex max-w-full overflow-hidden">
        
        {/* LEFT NAVIGATOR BAR: Diminished entirely if focusMode is turned on */}
        <AnimatePresence>
          {!focusMode && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-[#1F1F1F] bg-[#0C0C0C]/80 p-5 flex flex-col justify-between overflow-y-auto shrink-0 font-sans"
            >
              <div className="space-y-6">
                
                {/* Score rules */}
                <div className="p-3.5 rounded bg-[#121212] border border-[#1F1F1F]">
                  <span className="font-mono text-[9px] text-[#555] font-bold tracking-widest uppercase block mb-1">Mark Scheme Mapping</span>
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-emerald-500">+{mockTest.markingScheme.correct}</span>
                    <span className="text-red-400">{mockTest.markingScheme.incorrect === 0 ? 'No loss' : `${mockTest.markingScheme.incorrect}`}</span>
                  </div>
                </div>

                {/* Sub-Topics identified in current question paper */}
                <div>
                  <span className="font-mono text-[9px] text-[#555] font-bold tracking-widest uppercase block mb-3">Topic Mappings</span>
                  <div className="space-y-2">
                    <div className="text-xs text-[#888] font-sans flex items-center justify-between">
                      <span>Active Topic:</span>
                      <span className="font-bold text-white truncate max-w-[130px]">{activeQuestion.topic || 'General Syllabus'}</span>
                    </div>
                  </div>
                </div>

                {/* Question index matrix list navigator */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#1F1F1F] pb-2">
                    <span className="font-mono text-[9px] text-[#555] font-bold tracking-widest uppercase">Question Matrix</span>
                    <span className="font-mono text-[9px] text-[#888] font-bold">{answeredCount} of {totalQuestions} answered</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {mockTest.questions.map((q, idx) => {
                      const isVisited = idx === currentIndex;
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const isFlagged = flaggedQuestions[q.id];

                      let btnStyle = 'border-[#1F1F1F] hover:border-[#333] text-[#888] bg-transparent';
                      if (isVisited) {
                        btnStyle = 'border-white text-white font-bold bg-[#121212]';
                      } else if (isAnswered) {
                        btnStyle = 'border-transparent bg-white text-black font-semibold';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`py-2 rounded font-mono text-xs border text-center transition-all relative ${btnStyle}`}
                        >
                          {idx + 1}
                          
                          {/* Flag marker dot indicator overlay */}
                          {isFlagged && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Grid guide indices legend */}
              <div className="pt-4 border-t border-[#1F1F1F] space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#555] font-bold uppercase">
                  <span className="w-2.5 h-2.5 bg-white rounded shrink-0" />
                  <span>Answered / Saved</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#555] font-bold uppercase font-bold">
                  <span className="w-2.5 h-2.5 bg-transparent border border-[#1F1F1F] rounded shrink-0" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#555] font-bold uppercase font-bold">
                  <span className="w-2.5 h-2.5 bg-transparent rounded shrink-0 border border-blue-500 relative flex items-center justify-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full" />
                  </span>
                  <span>Flagged for review</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT AREA: Centered Active Question Sheet */}
        <main className="flex-1 overflow-y-auto bg-[#090909] flex flex-col justify-between py-10 px-6">
          <div className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
            
            {/* Subject mapping banner */}
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4 shrink-0 select-none">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#888] font-bold uppercase tracking-widest">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-[#333]">&middot;</span>
                <span className="font-sans text-xs text-[#555] font-semibold">
                  {activeQuestion.subject || mockTest.subject}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Flag question toggler */}
                <button
                  onClick={() => toggleFlag(activeQuestion.id)}
                  className={`p-1.5 rounded hover:bg-[#121212] transition-colors flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase ${
                    flaggedQuestions[activeQuestion.id] 
                      ? 'text-blue-400' 
                      : 'text-[#555] hover:text-[#888]'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[activeQuestion.id] ? 'fill-current text-blue-400' : ''}`} />
                  <span>{flaggedQuestions[activeQuestion.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>
            </div>

            {/* Core text of exam problem */}
            <div className="py-2 flex-1 flex flex-col justify-center">
              <div className="p-4 rounded bg-[#0C0C0C] border border-[#1F1F1F] shadow-inner mb-6 md:mb-8 font-sans leading-relaxed text-[#EDEDED] text-sm md:text-base border-l-4 border-l-stone-300">
                {activeQuestion.text}
              </div>

              {/* MCQs Option nodes mapped vertically */}
              <div className="space-y-3">
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[activeQuestion.id] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                      className={`w-full text-left p-4 rounded border flex items-center gap-4 transition-all duration-150 ${
                        isSelected 
                          ? 'bg-white text-black font-semibold border-transparent shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                          : 'bg-[#0C0C0C] hover:bg-[#121212] border-[#1F1F1F] hover:border-[#333] text-[#888] hover:text-white'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded font-mono text-xs flex items-center justify-center font-bold border transition-colors ${
                        isSelected 
                          ? 'bg-black border-transparent text-white' 
                          : 'bg-[#161616] border-[#222] text-[#888]'
                      }`}>
                        {letter}
                      </span>
                      <span className="font-sans text-sm">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Reset selected action button */}
              {selectedAnswers[activeQuestion.id] !== undefined && (
                <div className="text-left mt-3 shrink-0">
                  <button
                    onClick={() => handleClearOption(activeQuestion.id)}
                    className="font-mono text-[9px] text-[#555] hover:text-[#888] font-bold uppercase tracking-widest underline"
                  >
                    Clear selection choice
                  </button>
                </div>
              )}
            </div>

            {/* Pagination footer trigger blocks */}
            <footer className="pt-6 border-t border-[#1F1F1F] flex items-center justify-between shrink-0 select-none">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-[#0C0C0C] hover:bg-[#121212] border border-[#1F1F1F] hover:border-[#333] disabled:opacity-40 rounded text-[#888] hover:text-white font-sans text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Question</span>
              </button>

              <div className="hidden sm:flex font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">
                SCROLL OR USE KEYBOARD
              </div>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  id="exam-finish-trigger-btn"
                  onClick={handlePromptSubmit}
                  className="px-5 py-2.5 bg-white text-black rounded font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                >
                  Save & Complete Sheet
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#0C0C0C] hover:bg-[#121212] border border-[#1F1F1F] hover:border-[#333] rounded text-[#888] hover:text-white font-sans text-xs font-semibold flex items-center gap-2 transition-colors duration-150"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </footer>

          </div>
        </main>

      </div>

      {/* 3. CONFIRMATION DIALOGS OVERLAYS */}
      
      {/* 3A. SUBMIT CONFIRMATION SCREEN */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
          <div className="w-full max-w-sm bg-[#0C0C0C] border border-[#1F1F1F] rounded p-6 shadow-2xl space-y-5 text-center">
            
            <div className="w-12 h-12 rounded-full bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-sans font-bold text-lg text-white">Complete Evaluation?</h4>
              <p className="font-sans text-xs text-[#888] font-light max-w-xs mx-auto leading-relaxed">
                You have resolved <span className="font-bold text-white">{answeredCount} of {totalQuestions}</span> questions in the allowed slot. Proceed to generate grading analytics?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="py-2 bg-[#121212] border border-[#1F1F1F] rounded text-[#888] hover:text-white hover:bg-[#161616] font-sans text-xs font-semibold animate-all"
              >
                Resume Test
              </button>
              <button
                id="exam-confirm-submit-btn"
                onClick={handleSubmitConfirmed}
                className="py-2 bg-white text-black font-sans text-xs font-bold rounded shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
              >
                Grading Engine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3B. EXIT PREMATURELY CONFIRMATION SCREEN */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
          <div className="w-full max-w-sm bg-[#0C0C0C] border border-[#1F1F1F] rounded p-6 shadow-2xl space-y-5 text-center">
            
            <div className="w-12 h-12 rounded-full bg-red-950/30 text-red-500 border border-red-900/30 flex items-center justify-center mx-auto animate-pulse">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-sans font-bold text-lg text-white">Abandon Active Exam?</h4>
              <p className="font-sans text-xs text-[#888] font-light max-w-xs mx-auto leading-relaxed">
                Your progressive inputs in this evaluation cycle will not be committed to the academic scorecard directory. Are you sure you wish to exit?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="py-2 bg-[#121212] border border-[#1F1F1F] rounded text-[#888] hover:text-[#EDEDED] hover:bg-[#161616] font-sans text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="exam-confirm-abandon-btn"
                onClick={onExitMock}
                className="py-2 bg-red-950 bg-red-900/60 hover:bg-red-900 text-white font-sans text-xs font-bold rounded border border-red-800"
              >
                Disconnect Unit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
