import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface EligibilityBadgeProps {
  status: 'POTENTIALLY_ELIGIBLE' | 'LIKELY_NOT_ELIGIBLE' | 'NEEDS_VERIFICATION' | string;
  score?: number;
  language?: 'hi' | 'en';
}

export default function EligibilityBadge({ status, score, language = 'hi' }: EligibilityBadgeProps) {
  if (status === 'POTENTIALLY_ELIGIBLE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}
        {score !== undefined && <span className="font-bold">({score}%)</span>}
      </span>
    );
  }

  if (status === 'NEEDS_VERIFICATION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
        {language === 'hi' ? 'सत्यापन आवश्यक' : 'Needs Verification'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
      {language === 'hi' ? 'शर्तें पूरी नहीं हैं' : 'Likely Not Eligible'}
    </span>
  );
}
