import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, Trash2, Shield, ArrowUpRight, HelpCircle } from 'lucide-react';

interface AiAssistantViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  loading: boolean;
}

export default function AiAssistantView({
  chatHistory,
  onSendMessage,
  onClearHistory,
  loading
}: AiAssistantViewProps) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const samplePrompts = [
    'Best coding laptop under ₹60,000 with 16GB RAM?',
    'Compare NordVPN vs Hostinger promo plans',
    'Is SBI Cashback card worth the ₹999 fee?',
    'Recommend travel package for Singapore'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="rounded-3xl bg-radial from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            Empowered by Gemini 2.5 Flash
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none">Smart AI Shopping Assistant</h1>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Get instant un-biased comparisons, tech specifications check, and travel package insights. Ask me about budget laptops, best-value VPNs, hostings, or cards capping limit rules!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Sample Prompt Suggestions (Left column on large screens) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Suggested Queries
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Click any verified prompt below to see the AI assistant perform real-time shopping research, compare benchmarks, and recommend bargains.
            </p>

            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={() => onSendMessage(p)}
                  className="w-full text-left p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-xs text-slate-700 font-medium font-sans leading-snug cursor-pointer transition-colors flex items-start gap-1.5 disabled:opacity-50"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secure disclaimer */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-500 shrink-0" />
            <div className="text-[10px] text-slate-500 leading-normal">
              <span className="font-bold text-slate-700 block">Server-Side Security</span>
              All prompts are analyzed using protected server tokens. No keys or client information are exposed.
            </div>
          </div>
        </div>

        {/* Conversation Box (Right column on large screens) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col h-[550px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase font-mono">Live Session Chat Logs</span>
            </div>
            {chatHistory.length > 1 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear logs
              </button>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] space-y-1 ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="mr-auto items-start max-w-[85%] flex flex-col space-y-1">
                <div className="p-3.5 bg-white text-slate-400 border border-slate-100 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-xs font-medium">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>Gemini AI is researching deals...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask anything (e.g. Show me VPN deals, compare laptops, explain SBI cashback caps...)"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
