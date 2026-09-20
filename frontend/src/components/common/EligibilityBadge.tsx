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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-success/10 text-success border border-success/30">
        <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={1.5} />
        <span>{language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}</span>
        {score !== undefined && <span className="font-semibold">({score}%)</span>}
      </span>
    );
  }

  if (status === 'NEEDS_VERIFICATION') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/30">
        <HelpCircle className="w-4 h-4 text-accent-gold" strokeWidth={1.5} />
        <span>{language === 'hi' ? 'सत्यापन आवश्यक' : 'Needs Verification'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-text-secondary/10 text-text-secondary border border-border">
      <AlertCircle className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
      <span>{language === 'hi' ? 'शर्तें पूरी नहीं हैं' : 'Not Eligible'}</span>
    </span>
  );
}
