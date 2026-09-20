import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface EligibilityBadgeProps {
  status: 'POTENTIALLY_ELIGIBLE' | 'LIKELY_NOT_ELIGIBLE' | 'NEEDS_VERIFICATION';
  score?: number;
  language?: string;
  showScore?: boolean;
}

export default function EligibilityBadge({ 
  status, 
  score, 
  language = 'hi', 
  showScore = true 
}: EligibilityBadgeProps) {
  switch (status) {
    case 'POTENTIALLY_ELIGIBLE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/15 text-success border border-success/30 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{language === 'hi' ? 'योग्य' : 'Eligible'}</span>
          {showScore && score !== undefined && <span className="ml-0.5 opacity-90">({score}%)</span>}
        </span>
      );

    case 'NEEDS_VERIFICATION':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-gold/20 text-[#855B17] border border-accent-gold/40 shadow-xs">
          <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{language === 'hi' ? 'सत्यापन आवश्यक' : 'Verify'}</span>
          {showScore && score !== undefined && <span className="ml-0.5 opacity-90">({score}%)</span>}
        </span>
      );

    case 'LIKELY_NOT_ELIGIBLE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border border-gray-300">
          <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{language === 'hi' ? 'अपात्र' : 'Not Eligible'}</span>
        </span>
      );

    default:
      return null;
  }
}
