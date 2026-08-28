import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  CornerDownLeft,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { aiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, AiSuggestion } from '../../types';

export default function AiChatWidget() {
  const { language, profile } = useAuth();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Welcome Message & Fetch Suggestions
  useEffect(() => {
    const isHindi = language === 'hi';
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      sender: 'assistant',
      text: isHindi
        ? 'नमस्ते! 🙏 मैं आपका **बिहार सहायक AI** हूँ। आप मुझसे बिहार सरकार की किसी भी योजना, छात्रवृत्ति, कृषि अनुदान या करियर पाथवे के बारे में पूछ सकते हैं।'
        : 'Hello! 🙏 I am your **Bihar Sahayak AI**. Ask me anything about Bihar govt schemes, scholarships, agriculture subsidies, or BSDM career paths.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([welcomeMsg]);

    const loadSuggestions = async () => {
      try {
        const res = await aiService.getSuggestions(language);
        if (res.success) {
          setSuggestions(res.suggestions);
        }
      } catch (err) {
        console.error('Error loading AI suggestions:', err);
      }
    };

    loadSuggestions();
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await aiService.chat({
        query,
        language,
        profile: profile || null
      });

      if (res.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.response.text,
          citations: res.response.citations,
          actionChips: res.response.actionChips,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: language === 'hi'
          ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'Sorry, could not process your query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group border border-orange-400/40"
          title="Open AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black tracking-wide block leading-none">
              {language === 'hi' ? 'बिहार सहायक AI' : 'BSeva Assistant'}
            </span>
            <span className="text-[10px] text-orange-100 font-medium">
              {language === 'hi' ? 'सरकारी योजनाएं पूछें' : 'Ask Govt Schemes'}
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight">
                    {language === 'hi' ? 'बिहार सहायक AI' : 'Bihar Sahayak AI'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {language === 'hi' ? 'सत्यापित सरकारी डेटा से संचालित' : 'Grounded on verified Bihar Govt data'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Close"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}

                  {/* Citations Card */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{language === 'hi' ? 'आधिकारिक स्रोत (Verified Sources):' : 'Verified Sources:'}</span>
                      </p>
                      {msg.citations.map((c, cIdx) => (
                        <div key={cIdx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px]">
                          <div className="font-bold text-slate-900 flex items-center justify-between">
                            <span>{c.title}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-semibold">{c.type}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{c.sourceDepartment}</p>
                          <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-slate-200/50">
                            <Link to={c.slug} onClick={() => setIsOpen(false)} className="text-orange-600 font-bold hover:underline">
                              {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
                            </Link>
                            <a href={c.officialUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5">
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip, chipIdx) => (
                        <Link
                          key={chipIdx}
                          to={chip.link}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 transition"
                        >
                          {chip.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                <span>{language === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Generating verified response...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggestions Chips */}
          {messages.length === 1 && suggestions.length > 0 && (
            <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto scrollbar-none flex gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.query)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-medium hover:border-orange-400 hover:text-orange-600 whitespace-nowrap shadow-xs transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Voice Input Listening Bar */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>{language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'}</span>
              </div>
              <button onClick={toggleListening} className="text-rose-800 font-semibold underline text-[11px]">
                {language === 'hi' ? 'रूकें' : 'Stop'}
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={language === 'hi' ? 'आवाज़ से पूछें' : 'Voice Query'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={language === 'hi' ? 'योजना या छात्रवृत्ति के बारे में पूछें...' : 'Ask about schemes or scholarships...'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
