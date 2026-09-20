import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
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
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉयस इनपुट को सपोर्ट नहीं करता।' : 'Your browser does not support voice input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
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

      if (res.success && res.response) {
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
      {/* Floating Trigger Button: Circular, brand color, single Lucide MessageCircle icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-brand hover:bg-brand-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center group"
          title="Open AI Assistant / बिहार सहायक AI"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
          <span className="sr-only">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[85vh] bg-surface rounded-xl shadow-cardHover border border-border flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="p-4 bg-hero-bg text-text-primary flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-sm">
                ब
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {language === 'hi' ? 'बिहार सहायक AI' : 'Bihar Sahayak AI'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-success/10 text-success border border-success/30 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-success" strokeWidth={1.5} />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {language === 'hi' ? 'सत्यापित विभागीय डेटा' : 'Official Portal Guide'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors cursor-pointer"
              title="Close"
              aria-label="Close Chat"
            >
              <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white font-medium'
                      : 'bg-surface text-text-primary border border-border whitespace-pre-line'
                  }`}
                >
                  {msg.text}

                  {/* Citations Card */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border space-y-1.5">
                      <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-success" strokeWidth={1.5} />
                        <span>{language === 'hi' ? 'आधिकारिक स्रोत:' : 'Official Sources:'}</span>
                      </p>
                      {msg.citations.map((c, cIdx) => (
                        <div key={cIdx} className="p-2 rounded-lg bg-background border border-border text-xs">
                          <div className="font-semibold text-text-primary flex items-center justify-between">
                            <span>{c.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-hero-bg text-text-secondary font-medium border border-border">{c.type}</span>
                          </div>
                          <p className="text-[10px] text-text-secondary mt-0.5">{c.sourceDepartment}</p>
                          <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-border">
                            <Link to={c.slug} onClick={() => setIsOpen(false)} className="text-brand font-semibold hover:underline">
                              {language === 'hi' ? 'विवरण देखें →' : 'View Details →'}
                            </Link>
                            <a href={c.officialUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary flex items-center gap-0.5">
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip, chipIdx) => (
                        <Link
                          key={chipIdx}
                          to={chip.link}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1 rounded-lg bg-hero-bg hover:bg-border text-brand text-xs font-medium border border-border transition-colors"
                        >
                          {chip.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-text-secondary px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg w-fit text-xs text-text-secondary shadow-card">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand" strokeWidth={1.5} />
                <span>{language === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Finding verified information...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Chips */}
          {messages.length === 1 && suggestions.length > 0 && (
            <div className="px-4 py-2 bg-surface border-t border-border overflow-x-auto scrollbar-none flex gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.query)}
                  className="px-2.5 py-1 rounded-lg bg-background hover:bg-border border border-border text-text-secondary hover:text-text-primary text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Voice Input Listening Bar */}
          {isListening && (
            <div className="px-4 py-2 bg-brand/10 border-t border-brand/30 text-xs font-semibold text-brand flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping"></span>
                <span>{language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now'}</span>
              </div>
              <button onClick={toggleListening} className="text-brand-dark underline text-xs cursor-pointer">
                {language === 'hi' ? 'रूकें' : 'Stop'}
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-2.5 bg-surface border-t border-border flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'bg-brand text-white'
                  : 'bg-background text-text-secondary hover:text-text-primary'
              }`}
              title={language === 'hi' ? 'आवाज़ से पूछें' : 'Voice Query'}
              aria-label="Voice Query"
            >
              {isListening ? <MicOff className="w-4 h-4" strokeWidth={1.5} /> : <Mic className="w-4 h-4" strokeWidth={1.5} />}
            </button>

            <input
              type="text"
              placeholder={language === 'hi' ? 'योजना या छात्रवृत्ति के बारे में पूछें...' : 'Ask about schemes or scholarships...'}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-xs text-text-primary placeholder:text-text-secondary/60 focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-surface transition-all outline-none"
            />

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2 bg-brand hover:bg-brand-dark disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
              title="Send"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
