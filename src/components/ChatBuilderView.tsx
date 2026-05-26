import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Sliders, 
  Play, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Message, MockTest } from '../types';
import { motion } from 'motion/react';

interface ChatBuilderViewProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onLaunchSimulatedTest: (configObj: {
    title: string;
    subject: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
  }) => void;
  isAiTyping: boolean;
}

export default function ChatBuilderView({
  messages,
  onSendMessage,
  onLaunchSimulatedTest,
  isAiTyping
}: ChatBuilderViewProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompts = [
    { text: "Generate a hard JEE Physics mock", sub: "Physics" },
    { text: "Create a CUET Chemistry test with negative marking", sub: "Chemistry" },
    { text: "Construct an easy General Aptitude mock", sub: "Aptitude" }
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handlePromptClick = (text: string) => {
    onSendMessage(text);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  return (
    <div className="flex-1 flex flex-col bg-[#090909] text-[#EDEDED] h-screen sticky top-0 font-sans">
      
      {/* Top action header info */}
      <div className="p-6 border-b border-[#1F1F1F] bg-[#0C0C0C] flex items-center justify-between shrink-0">
        <div>
          <span className="font-mono text-[9px] text-[#555] font-bold uppercase tracking-widest">Natural Language Compiler</span>
          <h2 className="font-sans font-bold text-lg text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AI Mock Builder Engine</span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#555] font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Context Window</span>
        </div>
      </div>

      {/* Main Messages scroll frame container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id}
                className={`flex gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded bg-[#121212] border border-[#222] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#888]" />
                  </div>
                )}

                <div className={`space-y-3 max-w-[85%] ${isAi ? '' : 'text-right'}`}>
                  
                  {/* Message Bubble text wrapper */}
                  <div className={`p-4 rounded-xl text-sm leading-relaxed border ${
                    isAi 
                      ? 'bg-[#0C0C0C] border-[#1F1F1F] text-[#888]' 
                      : 'bg-white text-black border-transparent font-semibold text-left shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  }`}>
                    {/* Preserve line breaks for elegant paragraphs formatting */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* If the message has an embedded actionable simulated config */}
                  {isAi && msg.isGeneratingConfig && msg.generatedConfig && (
                    <div className="p-5 rounded-xl bg-[#0F0F0F] border border-[#1F1F1F] text-left space-y-4 max-w-md shadow-2xl">
                      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2">
                        <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider font-bold">Target Blueprint Config</span>
                        <span className="font-mono text-[9px] bg-emerald-950/20 text-[#34D399] px-2 py-0.5 rounded border border-emerald-900/30 font-bold uppercase tracking-widest">CALIBRATING</span>
                      </div>

                      <div>
                        <h4 className="font-sans font-bold text-sm text-[#EDEDED]">{msg.generatedConfig.title}</h4>
                        <p className="font-mono text-[9px] text-[#555] mt-1 uppercase font-bold">Subject: {msg.generatedConfig.subject}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-1 select-none">
                        <div className="bg-[#121212] p-2.5 rounded border border-[#222] text-center">
                          <p className="font-mono text-[8px] text-[#555] uppercase font-bold">Questions</p>
                          <p className="font-sans font-bold text-xs text-white mt-0.5">{msg.generatedConfig.questionCount}</p>
                        </div>
                        <div className="bg-[#121212] p-2.5 rounded border border-[#222] text-center">
                          <p className="font-mono text-[8px] text-[#555] uppercase font-bold">Difficulty</p>
                          <p className="font-sans font-bold text-xs text-white mt-0.5 capitalize">{msg.generatedConfig.difficulty}</p>
                        </div>
                        <div className="bg-[#121212] p-2.5 rounded border border-[#222] text-center">
                          <p className="font-mono text-[8px] text-[#555] uppercase font-bold">Duration</p>
                          <p className="font-sans font-bold text-xs text-white mt-0.5">{msg.generatedConfig.timeLimit}m</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onLaunchSimulatedTest(msg.generatedConfig!)}
                        className="w-full py-2.5 bg-white text-black font-sans text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Launch Dynamic Evaluation Engine</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="font-mono text-[8px] text-[#555] font-bold block mt-1 tracking-widest uppercase">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded bg-[#121212] border border-[#222] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#888]" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Simulated reflection typing line indicator */}
          {isAiTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded bg-[#121212] border border-[#222] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#888] rotate-12 animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-[#0C0C0C] border border-[#1F1F1F]">
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Center Prompt suggestion pills & Send container */}
      <div className="p-6 border-t border-[#1F1F1F] shrink-0 bg-[#090909]">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 items-center justify-center select-none">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p.text)}
                className="px-3.5 py-1.5 rounded-full bg-[#0C0C0C] hover:bg-[#121212] border border-[#1F1F1F] hover:border-[#333] text-xs text-[#888] hover:text-white transition-all cursor-pointer font-sans font-semibold"
              >
                <span>{p.text}</span>
              </button>
            ))}
          </div>

          {/* Main User Chat text box form wrapper */}
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              id="ai-builder-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Prompt the compiler: e.g. Make a 10 question Biology test with negative marking..."
              className="w-full bg-[#0C0C0C] border border-[#1F1F1F] focus:border-[#333] hover:border-[#222] rounded-xl py-3.5 pl-4 pr-12 text-sm text-[#EDEDED] placeholder-[#555] outline-none transition-colors"
            />
            <button
              id="ai-builder-send-btn"
              type="submit"
              disabled={!inputText.trim() || isAiTyping}
              className="absolute right-2 px-3.5 py-1.5 bg-white text-black font-bold rounded transition-all duration-150 flex items-center justify-center disabled:opacity-40 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="font-mono text-[9px] text-[#555] font-bold text-center uppercase tracking-widest">
            InstaMocks Core Generative Engine &middot; Powered by local academic model parameters
          </p>

        </div>
      </div>

    </div>
  );
}
