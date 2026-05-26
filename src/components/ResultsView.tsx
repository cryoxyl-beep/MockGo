import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  RotateCcw,
  Play,
  ArrowUpRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { MockTest, Question } from '../types';
import { motion } from 'motion/react';

interface ResultsViewProps {
  mockTest: MockTest;
  onRetest: () => void;
  onBackToDashboard: () => void;
}

export default function ResultsView({
  mockTest,
  onRetest,
  onBackToDashboard
}: ResultsViewProps) {
  const scoreData = mockTest.bestScore;
  if (!scoreData) {
    return (
      <div className="flex-1 bg-[#090909] text-[#EDEDED] p-8 text-center flex flex-col justify-center items-center h-screen font-sans">
        <AlertCircle className="w-10 h-10 text-[#555] mb-2 animate-bounce" />
        <p className="font-sans text-sm">Grading session directory failed to compile.</p>
        <button onClick={onBackToDashboard} className="mt-4 underline text-xs font-mono font-bold tracking-widest text-[#888] hover:text-white uppercase">
          Return to directory
        </button>
      </div>
    );
  }

  // Calculate detailed analytics from answer logs
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const questionsList = mockTest.questions;

  // Track sub-topic scoring
  const topicStats: Record<string, { total: number; correct: number }> = {};

  questionsList.forEach(q => {
    const userAns = scoreData.answers[q.id];
    const top = q.topic || 'General Syllabus';
    if (!topicStats[top]) {
      topicStats[top] = { total: 0, correct: 0 };
    }
    topicStats[top].total += 1;

    if (userAns === undefined) {
      unansweredCount++;
    } else if (userAns === q.correctAnswer) {
      correctCount++;
      topicStats[top].correct += 1;
    } else {
      incorrectCount++;
    }
  });

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#090909] text-[#EDEDED] p-6 md:p-8 min-h-screen font-sans">
      
      {/* Header menu navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1F1F1F] select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded bg-[#0C0C0C] border border-[#1F1F1F] text-[#888] hover:text-white transition-colors"
            title="Back to center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">
              Automated Scorecard Grading
            </span>
            <h2 className="font-sans font-bold text-2xl text-white tracking-tight mt-0.5">
              Performance Journal
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="results-retest-btn"
            onClick={onRetest}
            className="p-2.5 bg-[#0C0C0C] text-[#888] hover:text-white border border-[#1F1F1F] hover:border-[#333] font-sans text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 duration-150"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Sheet</span>
          </button>

          <button
            id="results-back-btn"
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white text-black rounded font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
          >
            Terminal Directory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: KPI Stats & SVG Visual Analytics */}
        <div className="space-y-6">
          
          {/* Main grade card */}
          <div className="p-6 rounded bg-[#0C0C0C] border border-[#1F1F1F] text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 p-1.5">
              <Bookmark className="w-4 h-4 text-[#333]" />
            </div>

            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest block mb-2">Grading Quotient</span>
            
            {/* Visual Trophy Badge */}
            <div className="w-16 h-16 rounded-full bg-[#121212] border border-[#1F1F1F] flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <p className="font-sans font-extrabold text-4xl text-white">
                {scoreData.score} <span className="text-[#555] text-xl font-light">/ {scoreData.maxScore}</span>
              </p>
              <p className="font-mono text-[10px] text-[#888] font-bold uppercase tracking-widest bg-[#121212] border border-[#1F1F1F] px-3 py-1 rounded inline-block">
                Evaluated level: {mockTest.difficulty}
              </p>
            </div>

            {/* Performance line metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#1F1F1F] text-center select-none">
              <div>
                <p className="font-mono text-[9px] text-[#555] font-bold uppercase">Correct Ratio</p>
                <p className="text-lg font-sans font-bold text-emerald-400 mt-0.5">{correctCount} of {questionsList.length}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#555] font-bold uppercase">Solve Time</p>
                <p className="text-lg font-sans font-bold text-white mt-0.5">{formatMinutes(scoreData.timeTaken)}</p>
              </div>
            </div>
          </div>

          {/* Elegant Custom SVG Pie Chart mapping Accuracy ratio */}
          <div className="p-6 rounded bg-[#0C0C0C] border border-[#1F1F1F] select-none">
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest block mb-4">Precision Index</span>
            
            <div className="flex items-center justify-around gap-4">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                {/* Visual donut using simple SVG parameters */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background track */}
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#1D1D1F"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Dynamic value arc */}
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="289" // 2 * pi * r = 2 * 3.14 * 46 ≈ 289
                    strokeDashoffset={289 - (289 * scoreData.accuracy) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-sans font-extrabold text-white">{scoreData.accuracy}%</span>
                  <span className="text-[8px] font-mono text-[#555] font-bold uppercase tracking-widest">Accuracy</span>
                </div>
              </div>

              <div className="space-y-3 text-[10px] font-mono font-bold uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-white inline-block" />
                  <span className="text-[#888]">{correctCount} Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-red-500 inline-block" />
                  <span className="text-[#888]">{incorrectCount} Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-[#1D1D1F] inline-block" />
                  <span className="text-[#555]">{unansweredCount} Blank</span>
                </div>
              </div>
            </div>
          </div>

          {/* WEAK TOPIC BREAKDOWN DIAGNOSTIC SCREEN */}
          <div className="p-6 rounded bg-[#0C0C0C] border border-[#1F1F1F] select-none">
            <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest block mb-4">Topic Masteries breakdown</span>

            <div className="space-y-4">
              {Object.entries(topicStats).map(([topicName, stats], idx) => {
                const percent = Math.round((stats.correct / stats.total) * 100);
                
                let feedbackText = 'Requires Review';
                let indicatorColor = 'bg-red-400';
                if (percent >= 80) {
                  feedbackText = 'Exceptional Mastery';
                  indicatorColor = 'bg-emerald-400';
                } else if (percent >= 40) {
                  feedbackText = 'Plausible Progress';
                  indicatorColor = 'bg-amber-400';
                }

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans font-bold text-white truncate max-w-[150px]">{topicName}</span>
                      <span className="font-mono text-[#555] font-bold">{stats.correct}/{stats.total} Correct ({percent}%)</span>
                    </div>

                    <div className="h-1 bg-[#121212] rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full ${indicatorColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="font-mono text-[8px] text-[#555] font-bold uppercase tracking-widest">
                      Recommendation: {feedbackText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Question Sheets Review journal with detailed explanations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between select-none">
            <h3 className="font-sans font-bold text-lg text-[#EDEDED]">
              Technical Corrections Journal ({questionsList.length} items)
            </h3>
            <span className="font-mono text-[10px] text-[#555] font-bold uppercase tracking-widest">Graded Session</span>
          </div>

          <div className="space-y-4 font-sans">
            {questionsList.map((q, qIdx) => {
              const selectedAnsIdx = scoreData.answers[q.id];
              const isCorrect = selectedAnsIdx === q.correctAnswer;
              const isUnanswered = selectedAnsIdx === undefined;

              return (
                <div
                  key={q.id}
                  className="p-5 md:p-6 rounded bg-[#0C0C0C] border border-[#1F1F1F] flex flex-col gap-5 text-left"
                >
                  {/* Item header with status values */}
                  <div className="flex items-start justify-between gap-4 select-none border-b border-[#1F1F1F] pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#555] font-bold block mb-0.5">QUESTION {qIdx + 1}</span>
                      <span className="font-mono text-[9px] text-[#888] font-bold bg-[#121212] border border-[#1F1F1F] px-2 py-0.5 rounded capitalize">
                        {q.topic || 'General Syllabus'}
                      </span>
                    </div>

                    {isUnanswered ? (
                      <span className="font-mono text-[9px] bg-[#121212] text-[#888] border border-[#1F1F1F] px-2 py-1 rounded uppercase tracking-wider shrink-0 font-bold">
                        Blank (0 pts)
                      </span>
                    ) : isCorrect ? (
                      <span className="font-mono text-[9px] bg-[#121212] text-emerald-400 border border-[#1F1F1F] px-2.5 py-1 rounded uppercase tracking-wider font-bold shrink-0">
                        Correct (+{mockTest.markingScheme.correct} pts)
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] bg-[#121212] text-red-400 border border-[#1F1F1F] px-2.5 py-1 rounded uppercase tracking-wider font-bold shrink-0">
                        Incorrect ({mockTest.markingScheme.incorrect} pts)
                      </span>
                    )}
                  </div>

                  {/* Problem statement */}
                  <p className="font-sans text-sm md:text-base leading-relaxed text-[#EDEDED] whitespace-pre-wrap">
                    {q.text}
                  </p>

                  {/* MCQ Option lists showing correct versus chosen */}
                  <div className="space-y-2 pointer-events-none select-none">
                    {q.options.map((option, optIdx) => {
                      const isCorrectOpt = optIdx === q.correctAnswer;
                      const isSelectedOpt = optIdx === selectedAnsIdx;

                      let nodeStyle = 'border-[#1F1F1F] bg-[#121212] text-[#555]';
                      let labelLetterStyle = 'bg-[#161616] border-[#222] text-[#555]';

                      if (isCorrectOpt) {
                        nodeStyle = 'border-emerald-950 bg-[#121212] text-white font-semibold';
                        labelLetterStyle = 'bg-white border-transparent text-black font-bold';
                      } else if (isSelectedOpt && !isCorrectOpt) {
                        nodeStyle = 'border-red-950 bg-[#121212] text-[#888]';
                        labelLetterStyle = 'bg-[#121212] border-red-500 text-red-500 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded border text-xs flex items-center justify-between gap-3 ${nodeStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5.5 h-5.5 rounded font-mono text-[10px] flex items-center justify-center border ${labelLetterStyle}`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-sans">{option}</span>
                          </div>

                          {isCorrectOpt && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isSelectedOpt && !isCorrectOpt && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Collapsible/Polished scholastic explanation block */}
                  <div className="p-4 rounded bg-[#121212] border border-[#1F1F1F] space-y-2">
                    <p className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest flex items-center gap-2">
                      <HelpCircle className="w-3 h-3 text-[#555]" />
                      <span>Scholastic Derivation & Explanation</span>
                    </p>
                    <p className="font-sans text-xs text-[#888] leading-relaxed font-light">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
