const { prisma } = require('../../database/db');
const config = require('../../config');

/**
 * AI Grounded Knowledge Service & RAG Engine
 * Combines Supabase scheme retrieval with OpenRouter LLM generation.
 */
class AiService {
  /**
   * Classify user query intent
   */
  classifyIntent(query = '') {
    const q = query.toLowerCase();
    if (
      q.includes('career') ||
      q.includes('job') ||
      q.includes('salary') ||
      q.includes('skill') ||
      q.includes('bsdm') ||
      q.includes('training') ||
      q.includes('करियर') ||
      q.includes('नौकरी') ||
      q.includes('वेतन') ||
      q.includes('कोर्स')
    ) {
      return 'CAREER_GUIDANCE';
    }
    if (
      q.includes('document') ||
      q.includes('certificate') ||
      q.includes('दस्तावेज') ||
      q.includes('प्रमाण पत्र') ||
      q.includes('कागजात')
    ) {
      return 'DOCUMENT_REQUIREMENT';
    }
    return 'SCHEME_INQUIRY';
  }

  /**
   * Fetch all active scheme & career context from Supabase PostgreSQL
   */
  async getKnowledgeBase() {
    const [schemes, careers] = await Promise.all([
      prisma.scheme.findMany({
        where: { status: 'ACTIVE' },
        include: { department: true, category: true, rules: true }
      }),
      prisma.careerPath.findMany()
    ]);
    return { schemes, careers };
  }

  /**
   * Match citations based on AI response content and user query
   */
  extractCitations(responseText, query, schemes, careers, isHindi, intent) {
    const citations = [];
    const textLower = (responseText + ' ' + query).toLowerCase();

    for (const s of schemes) {
      const matchTitleEn = s.title_en.toLowerCase();
      const matchTitleHi = s.title_hi.toLowerCase();
      const slugClean = s.slug.replace(/-/g, ' ');

      if (
        textLower.includes(matchTitleEn) ||
        textLower.includes(matchTitleHi) ||
        textLower.includes(slugClean) ||
        (textLower.includes('credit') && s.slug.includes('credit')) ||
        (textLower.includes('scholarship') && s.slug.includes('scholarship')) ||
        (textLower.includes('छात्रवृत्ति') && s.slug.includes('scholarship')) ||
        (textLower.includes('क्रेडिट कार्ड') && s.slug.includes('credit')) ||
        (textLower.includes('kanya') && s.slug.includes('kanya')) ||
        (textLower.includes('udyami') && s.slug.includes('udyami')) ||
        (textLower.includes('krishi') && s.slug.includes('krishi'))
      ) {
        citations.push({
          title: isHindi ? s.title_hi : s.title_en,
          type: 'SCHEME',
          sourceDepartment: isHindi ? (s.department?.name_hi || s.department?.name_en) : s.department?.name_en,
          officialUrl: s.official_portal_url,
          lastVerifiedDate: s.last_verified_date,
          slug: `/schemes/${s.slug}`
        });
      }
    }

    for (const c of careers) {
      const matchTitle = c.title_en.toLowerCase();
      const matchIndustry = c.industry.toLowerCase();
      if (
        textLower.includes(matchTitle) ||
        textLower.includes(matchIndustry) ||
        textLower.includes(c.slug.replace(/-/g, ' ')) ||
        (textLower.includes('solar') && c.slug.includes('solar')) ||
        (textLower.includes('software') && c.slug.includes('software')) ||
        (textLower.includes('it') && c.slug.includes('software'))
      ) {
        citations.push({
          title: isHindi ? c.title_hi : c.title_en,
          type: 'CAREER',
          sourceDepartment: 'Bihar Skill Development Mission (BSDM)',
          officialUrl: 'https://skillmissionbihar.org',
          slug: `/careers/${c.slug}`
        });
      }
    }

    // If intent is CAREER_GUIDANCE and citations is empty, attach top career
    if (intent === 'CAREER_GUIDANCE' && citations.length === 0 && careers.length > 0) {
      const topC = careers[0];
      citations.push({
        title: isHindi ? topC.title_hi : topC.title_en,
        type: 'CAREER',
        sourceDepartment: 'Bihar Skill Development Mission (BSDM)',
        officialUrl: 'https://skillmissionbihar.org',
        slug: `/careers/${topC.slug}`
      });
    }

    // If intent is SCHEME_INQUIRY and citations is empty, attach student credit card
    if (intent === 'SCHEME_INQUIRY' && citations.length === 0 && schemes.length > 0) {
      const topS = schemes.find(s => s.slug.includes('credit')) || schemes[0];
      citations.push({
        title: isHindi ? topS.title_hi : topS.title_en,
        type: 'SCHEME',
        sourceDepartment: isHindi ? (topS.department?.name_hi || topS.department?.name_en) : topS.department?.name_en,
        officialUrl: topS.official_portal_url,
        lastVerifiedDate: topS.last_verified_date,
        slug: `/schemes/${topS.slug}`
      });
    }

    // Deduplicate citations by slug
    const uniqueCitations = [];
    const seen = new Set();
    for (const item of citations) {
      if (!seen.has(item.slug)) {
        seen.add(item.slug);
        uniqueCitations.push(item);
      }
    }

    return uniqueCitations.slice(0, 4);
  }

  /**
   * Generate action navigation chips based on extracted citations
   */
  generateActionChips(citations, isHindi) {
    const chips = [];

    for (const c of citations) {
      chips.push({
        label: isHindi ? `${c.title.slice(0, 24)}... विवरण` : `View ${c.title.slice(0, 22)}`,
        link: c.slug
      });
    }

    chips.push({
      label: isHindi ? 'पात्रता जांचें' : 'Check Eligibility',
      link: '/eligibility'
    });

    if (chips.length < 4) {
      chips.push({
        label: isHindi ? 'दस्तावेज चेकलिस्ट' : 'Document Checklist',
        link: '/documents'
      });
    }

    return chips.slice(0, 4);
  }

  /**
   * Process Query with OpenRouter LLM + Supabase Grounding
   */
  async processQuery({ query, language = 'hi', userProfile = null }) {
    const isHindi = language === 'hi';
    const intent = this.classifyIntent(query);
    const { schemes, careers } = await this.getKnowledgeBase();

    // If OpenRouter API key is available, call OpenRouter LLM using native fetch
    if (config.openRouterApiKey) {
      try {
        const schemesSummary = schemes.map(s => `
[SCHEME: ${s.title_en} / ${s.title_hi}]
- Slug: ${s.slug}
- Department: ${s.department?.name_en}
- Category: ${s.categoryId}
- Application Mode: ${s.application_mode}
- Key Benefits: ${s.benefits_en} (Hindi: ${s.benefits_hi})
- Eligibility Rules: ${(s.rules || []).map(r => r.message_en || `${r.field}: ${JSON.stringify(r.value)}`).join('; ')}
- Required Documents: ${(s.required_documents || []).join(', ')}
- Official Portal: ${s.official_portal_url}
        `).join('\n');

        const careersSummary = careers.map(c => `
[CAREER: ${c.title_en} / ${c.title_hi}]
- Slug: ${c.slug}
- Industry: ${c.industry}
- Min Education: ${c.min_education}
- Avg Salary: ₹${c.avg_starting_salary_inr} INR/year (${c.growth_prospects} growth)
- Skills Required: ${(c.required_skills || []).join(', ')}
- BSDM Training Programs: ${(c.bsdm_training_path || []).join(', ')}
        `).join('\n');

        const systemPrompt = `You are "Bihar Sahayak AI" (बिहार सहायक AI), an intelligent, highly accurate, and empathetic assistant for citizens, students, farmers, women, and youth in Bihar, India.

CRITICAL INSTRUCTIONS:
1. ONLY provide advice and recommendations based on verified Bihar government schemes and career opportunities provided in the knowledge base below.
2. CAREFULLY analyze the citizen's demographic & academic profile in the query.
   - If the user asks about career/skills, provide BSDM training programs and job prospect details.
   - If the user is a B.Tech / College student, recommend Bihar Student Credit Card, Post-Matric Scholarship, and tech career courses.
   - NEVER recommend old-age pensions or unrelated farmer subsidies to students or young citizens!
3. Format your response cleanly using markdown with bold headings, bullet points, financial benefit amounts in INR (₹), eligibility summary, and official application portals.
4. Reply in ${isHindi ? 'fluent, respectful Hindi (हिंदी)' : 'clear, professional English'}. If the user writes in English, reply in English.
5. Conclude with a helpful note mentioning that they can check their exact eligibility using the BSeva Eligibility Checker or prepare documents via Document Readiness tool.

VERIFIED KNOWLEDGE BASE OF BIHAR GOVERNMENT SCHEMES:
${schemesSummary}

VERIFIED BSDM CAREER & SKILL PATHWAYS:
${careersSummary}
`;

        const userMessageContent = userProfile
          ? `User Profile: ${JSON.stringify(userProfile)}\n\nCitizen Question: ${query}`
          : `Citizen Question: ${query}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.openRouterApiKey}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Bihar Sahayak (BSeva)',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.openRouterModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessageContent }
            ],
            temperature: 0.2,
            max_tokens: 1000
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          const aiText = data?.choices?.[0]?.message?.content;

          if (aiText) {
            const citations = this.extractCitations(aiText, query, schemes, careers, isHindi, intent);
            const actionChips = this.generateActionChips(citations, isHindi);

            return {
              success: true,
              query,
              intent,
              language,
              response: {
                text: aiText,
                citations,
                actionChips,
                disclaimer: isHindi
                  ? 'अस्वीकरण: यह जानकारी बिहार सरकार के सत्यापित आधिकारिक स्रोतों पर आधारित है। अंतिम पात्रता एवं स्वीकृति संबंधित विभाग का निर्णय है।'
                  : 'Disclaimer: This response is grounded on verified official Bihar government sources. Final eligibility and approval remain under the respective department.'
              }
            };
          }
        }
      } catch (openRouterErr) {
        // Fallback gracefully
      }
    }

    // Fallback deterministic RAG processor
    return this.fallbackDeterministicProcessor({ query, language, schemes, careers, isHindi, intent });
  }

  /**
   * Deterministic Fallback Processor with Enhanced Student & Academic Filters
   */
  fallbackDeterministicProcessor({ query, language, schemes, careers, isHindi, intent }) {
    const q = query.toLowerCase();

    const isStudentQuery = q.includes('btech') || q.includes('b.tech') || q.includes('cse') || q.includes('engineering') || q.includes('12th') || q.includes('college') || q.includes('student') || q.includes('पढ़ाई') || q.includes('छात्रवृत्ति') || q.includes('क्रेडिट');
    const isCareerQuery = intent === 'CAREER_GUIDANCE' || q.includes('career') || q.includes('solar') || q.includes('bsdm') || q.includes('skill');
    const isFarmerQuery = q.includes('किसान') || q.includes('खेती') || q.includes('कृषि') || q.includes('कल्टीवेटर') || q.includes('यंत्र') || q.includes('farmer');

    let answerText = '';

    if (isCareerQuery) {
      if (isHindi) {
        answerText = `बिहार कौशल विकास मिशन (BSDM) के अंतर्गत तकनीकी एवं रोजगारपरक प्रशिक्षण कार्यक्रम:\n\n` +
          `• **Solar PV Installation & Energy Technician:** ₹2.5L - ₹4.5L/वर्ष। रूफटॉप सोलर एवं नवीकरणीय ऊर्जा में कुशल तकनीशियन कोर्स।\n` +
          `• **Full-Stack & Cloud Software Developer:** ₹4.5L - ₹8.5L/वर्ष। अत्याधुनिक सॉफ्टवेयर, क्लाउड एवं वेब डेवलपमेंट प्रोग्राम।\n` +
          `• **कुशल युवा कार्यक्रम (KYP):** बुनियादी कंप्यूटर साक्षरता एवं सॉफ्ट स्किल्स (15 से 28 वर्ष के युवाओं हेतु निःशुल्क)।`;
      } else {
        answerText = `Key Career and Skill Training Courses under Bihar Skill Development Mission (BSDM):\n\n` +
          `• **Solar PV Installation & Energy Technician:** Avg starting salary ₹2.5L - ₹4.5L/yr in rooftop solar and renewable energy.\n` +
          `• **Full-Stack & Cloud Software Developer:** Avg starting salary ₹4.5L - ₹8.5L/yr for engineering and IT students.\n` +
          `• **Kushal Yuva Program (KYP):** Free 240-hour certified IT literacy and communication course for youth.`;
      }
    } else if (isStudentQuery) {
      if (isHindi) {
        answerText = `12वीं और उच्च शिक्षा के छात्रों के लिए बिहार सरकार की प्रमुख योजनाएं:\n\n` +
          `• **बिहार स्टूडेंट क्रेडिट कार्ड योजना (MNSSBY):** B.Tech, डिप्लोमा, स्नातक आदि हेतु ₹4 लाख तक का शिक्षा ऋण (1% से 4% ब्याज)।\n` +
          `• **पोस्ट-मैट्रिक स्कॉलरशिप (PMS Bihar):** उच्च शिक्षा शिक्षण शुल्क व रखरखाव भत्ते की प्रतिपूर्ति।\n` +
          `• **मुख्यमंत्री निश्चय स्वयं सहायता भत्ता:** 12वीं के बाद ₹1,000 प्रति माह (अधिकतम 2 वर्ष)।`;
      } else {
        answerText = `Key higher education schemes in Bihar for students:\n\n` +
          `• **Bihar Student Credit Card Scheme (MNSSBY):** Up to ₹4,00,000 education loan at 1% to 4% interest rate.\n` +
          `• **Post-Matric Scholarship (PMS Bihar):** Tuition fee reimbursement for BC/EBC/SC/ST students.\n` +
          `• **Mukhyamantri Nishchay Swayam Sahayata Bhatta:** ₹1,000 monthly allowance for youth transitioning from 12th.`;
      }
    } else if (isFarmerQuery) {
      if (isHindi) {
        answerText = `कृषि एवं किसान कल्याण हेतु प्रमुख योजनाएं:\n\n` +
          `• **कृषि यंत्रीकरण योजना:** कृषि यंत्रों पर 40% से 80% अनुदान।\n` +
          `• **PM-किसान सम्मान निधि:** ₹6,000 वार्षिक सहायता।`;
      } else {
        answerText = `Key agricultural assistance schemes:\n\n` +
          `• **Krishi Yantrikaran Subsidy:** 40% to 80% subsidy on modern farm equipment.\n` +
          `• **PM-Kisan Samman Nidhi:** ₹6,000 annual direct income support.`;
      }
    } else {
      if (isHindi) {
        answerText = `नमस्ते! मैं बिहार सहायक AI हूँ। मैं आपको बिहार सरकार की 25+ सत्यापित योजनाओं और BSDM करियर पाथवे की आधिकारिक जानकारी दे सकता हूँ।`;
      } else {
        answerText = `Hello! I am Bihar Sahayak AI. I can assist you with verified information on Bihar government schemes and BSDM career pathways.`;
      }
    }

    const citations = this.extractCitations(answerText, query, schemes, careers, isHindi, intent);
    const actionChips = this.generateActionChips(citations, isHindi);

    return {
      success: true,
      query,
      intent,
      language,
      response: {
        text: answerText,
        citations,
        actionChips,
        disclaimer: isHindi
          ? 'अस्वीकरण: यह जानकारी बिहार सरकार के सत्यापित आधिकारिक स्रोतों पर आधारित है। अंतिम पात्रता एवं स्वीकृति संबंधित विभाग का निर्णय है।'
          : 'Disclaimer: This response is grounded on verified official Bihar government sources. Final eligibility and approval remain under the respective department.'
      }
    };
  }

  /**
   * Starter suggestions
   */
  getSuggestions(language = 'hi') {
    if (language === 'en') {
      return [
        { label: 'Scholarships for B.Tech & College Students', query: 'What scholarships and student credit card schemes are available for B.Tech engineering students in Bihar?' },
        { label: 'Subsidies for Agricultural Equipment', query: 'How to get subsidy on agricultural equipment in Bihar?' },
        { label: 'Mukhyamantri Kanya Utthan Yojana benefits', query: 'What are the benefits of Mukhyamantri Kanya Utthan Yojana?' },
        { label: 'Bihar Student Credit Card (up to 4 Lakh)', query: 'How to apply for Bihar Student Credit Card scheme?' },
        { label: 'IT and Solar career courses under BSDM', query: 'What career and skill training courses are offered for Solar and IT in Bihar?' }
      ];
    }

    return [
      { label: 'B.Tech / कॉलेज छात्रों के लिए योजनाएं', query: '12वीं पास और B.Tech इंजीनियरिंग छात्रों के लिए बिहार में कौन सी योजनाएं और स्टूडेंट क्रेडिट कार्ड है?' },
      { label: 'कृषि यंत्र पर सरकारी सब्सिडी कैसे मिलेगी?', query: 'बिहार में कृषि यंत्रों और कल्टीवेटर पर कितना अनुदान मिलता है?' },
      { label: 'बिहार स्टूडेंट क्रेडिट कार्ड (₹4 लाख ऋण)', query: 'स्टूडेंट क्रेडिट कार्ड योजना की पात्रता और आवश्यक दस्तावेज क्या हैं?' },
      { label: 'मुख्यमंत्री कन्या उत्थान योजना के लाभ', query: 'कन्या उत्थान योजना में स्नातक पास बालिकाओं को कितनी राशि मिलती है?' },
      { label: 'कुशल युवा कार्यक्रम (KYP) और टेक करियर', query: 'BSDM के तहत निशुल्क कंप्यूटर और सॉफ्टवेयर ट्रेनिंग कैसे मिलेगी?' }
    ];
  }
}

module.exports = new AiService();
