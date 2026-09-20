import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  Compass, 
  RefreshCw,
  Info
} from 'lucide-react';
import { aiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, AiSuggestion, SourceCitation, ActionChip } from '../../types';

export default function AiChatWidget() {
  const { profile, language } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते! मैं बिहार सहायक AI हूँ। आप मुझसे बिहार की किसी भी सरकारी योजना, पात्रता, या कौशल विकास कोर्स के बारे में पूछ सकते हैं।'
        : 'Namaste! I am Bihar Sahayak AI assistant. Ask me anything about Bihar Government schemes, eligibility criteria, or skill development courses.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await aiService.getSuggestions();
        if (res.success) setSuggestions(res.suggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || query;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await aiService.chat({
        query: messageText,
        language: (language as 'hi' | 'en') || 'hi',
        profile: profile || undefined
      });

      if (res.success) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: res.response.text,
          citations: res.response.citations,
          actionChips: res.response.actionChips,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Could not get response');
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'hi'
          ? 'माफ़ कीजिये, सर्वर से संपर्क नहीं हो पाया। कृपया कुछ देर बाद पुनः प्रयास करें।'
          : 'Sorry, unable to connect to the assistant server. Please try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-brand hover:bg-brand-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center group"
          title={language === 'hi' ? 'AI सहायक से पूछें' : 'Ask AI Assistant'}
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={1.75} />
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-xl shadow-cardHover border border-border flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="p-4 bg-brand text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-accent-gold-light" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {language === 'hi' ? 'बिहार सहायक AI' : 'Bihar Sahayak AI'}
                </h3>
                <span className="text-[11px] text-white/80 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'hi' ? 'सत्यापित पोर्टल ज्ञान' : 'Official Portal Knowledge'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-border text-text-primary rounded-bl-none shadow-card'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Citations Box */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border space-y-1.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                        {language === 'hi' ? 'आधिकारिक स्रोत:' : 'Official Sources:'}
                      </span>
                      {msg.citations.map((c, idx) => (
                        <a
                          key={idx}
                          href={c.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-1.5 rounded-lg bg-background hover:bg-hero-bg text-brand text-[11px] font-semibold transition-colors border border-border"
                        >
                          <span className="truncate pr-2">{c.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={2} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip, idx) => (
                        <a
                          key={idx}
                          href={chip.link}
                          className="px-2.5 py-1 rounded-md bg-brand/10 hover:bg-brand text-brand hover:text-white border border-brand/25 text-[11px] font-semibold transition-colors shadow-xs"
                        >
                          {chip.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-text-secondary bg-white p-3 rounded-xl border border-border w-fit shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand" strokeWidth={2} />
                <span>{language === 'hi' ? 'सरकारी नियमों का विश्लेषण जारी...' : 'Analyzing official schemes...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts / Suggestions */}
          {suggestions.length > 0 && messages.length <= 2 && (
            <div className="p-2.5 bg-white border-t border-border flex gap-1.5 overflow-x-auto scrollbar-none">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.query)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand/5 hover:bg-brand text-brand hover:text-white border border-brand/20 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'hi' ? 'प्रश्न पूछें (उदा. SC छात्रवृत्ति, किसान अनुदान)...' : 'Ask a question (e.g. Student credit card, farm subsidy)...'}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
